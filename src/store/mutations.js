import Vue from 'vue'
import globalData from '../global_data';
import axios from '../backend/vue-axios';

export const mutations = {
  getLogin(state) {
    getLoginFromStorage(state);
    handleLoginAdmin(state);
  },
  updateLogin(state, logininfo) {
    console.log(logininfo);
    if (logininfo.token.length) {
      state.userinfo = {
        email: logininfo.user.email,
        name: logininfo.user.name,
        id: logininfo.user.id,
        token: logininfo.token,
        loggedin: true
      };
      setLoginToStorage(state);
    }
    handleLoginAdmin(state);
  },
  showSearchBox(state, value) {
    state.showSearchBox=value;
  },
  isLoading(state, value) {
    state.isLoading=value;
  },
  logOut(state) {
    state.userinfo = {
      email: "",
      name: "",
      id: "",
      token: "",
      loggedin: false
    };
    setLoginToStorage(state);
    handleLoginAdmin(state);
  },
  removeTermFromList(state, index) {
    state.showTermList.splice(index, 1);
  },
  clearTermList(state) {
    state.showTermList = [];
  },

  // handle term changes
  fetchTerm(state, term) {
    console.log(term);
    state.showTermList = state.showTermList.filter(function (thisterm) {
      return thisterm.id != term.id
    })

    // @todo: is this term editable, should come from api actually
    term.editable = (state.userinfo.id == term.created_by)

    state.showTermList.splice(term.position, 0, term)
  },

  addTerm(state, newTerm) {
    state.collection.terms.push(newTerm)
  },
  changeTerm(state, term) {
    var nr = state.collection.terms.findIndex(x => x.id === term.id)
    state.collection.terms.splice(nr, 1, term)
  },
  removeTerm(state, term) {
    state.collection.terms = state.collection.terms.filter(function (thisterm) {
      return thisterm.id != term.id
    });
    // also remove the relations to this term
    state.collection_relationList = state.collection_relationList.filter(function (relation) {
      return (relation.object.id!=term.id) && (relation.subject.id!=term.id)
    });
  },
  // handle relation changes

  removeRelation(state, id) {
    state.collection_relationList = state.collection_relationList.filter(function (relation) {
      return relation.id != id;
    });
  },
  changeRelation(state, parms) {
  },
  // handle collection changes
  fetchCollections(state, collections) { // fetch list of all collections
    collections.forEach(function (collection) {
      if (collection.created_by == state.userinfo.id) {
        collection.authorisation = globalData.AUTHTYPE.OWNER;
      } else if (collection.bookmarked) {
        collection.authorisation = globalData.BOOKMARKED;
      } else {
        collection.authorisation = globalData.NONE;
      }
      //collection.authorisation = globalData.AUTHTYPE.CONTRIBUTOR;
    });
    state.collections = collections;
  },
  clearCollection(state, collectionId) {
    console.log(state.collection.id, collectionId);
    if (state.collection.id !== collectionId)
      state.collection = {}
  },
  fetchCollection(state, collection) {  // fetch one collection
    console.log(collection);
    function makeRelations() {
      var ontology, term, orgRelation;
      var relation = {}, relationList = [];
      var i, a;
      for (i = 0; i < state.collection.ontologies.length; i++) {
        ontology = state.collection.ontologies[i];
        if (ontology.archived) { continue }; // remove deleted relations
        relation = {};
        relation.id = ontology.id;
        // replace ids by the objects
        // @todo: this should come from the api
        for (a = 0; a < state.collection.terms.length; a++) {
          term = state.collection.terms[a];
          if (ontology.subject_id === term.id) {
            relation.subject = term;
          }
          if (ontology.object_id === term.id) {
            relation.object = term;
          }
          if (relation.object && relation.subject) {
            break;
          }
        }
        for (a = 0; a < state.collection.relations.length; a++) {
          orgRelation = state.collection.relations[a];
          if (ontology.relation_id === orgRelation.id) {
            relation.name = orgRelation.relation_name;
            break;
          }
        }
        //@todo: this should come from the api
        if (!relation.object || !relation.subject) {  // fetch terms which are not part of this collection
          getOntology(state, ontology.id);
        }
        else {
          relationList.push({ id: relation.id, object: relation.object, name: relation.name, subject: relation.subject });
        }
      }
      return (relationList);
    };
    // @todo: the api must deliver editable
    collection.editable = (collection.created_by == state.userinfo.id);
    state.collection = collection;

    // @todo: the api must deliver proper relations
    state.collection_relationList = makeRelations();
  },
  changeCollection(state, collection) {
    console.log('call collection change api here..', collection);
  },
  addCollection(state, collection) {
    state.collection=collection;
    state.collections.push(collection);
  },
  addRelation(state, newRel) {
    state.collection_relationList.push(newRel);
  }


}

//helper functions
function getLoginFromStorage(state) {
  state.userinfo = {
    email: localStorage.email,
    name: localStorage.name,
    id: localStorage.id,
    token: localStorage.token,
    loggedin: (localStorage.loggedin === "true")
  };
  console.log(state.userinfo);
}
function setLoginToStorage(state) {
  localStorage.token = state.userinfo.token;
  localStorage.name = state.userinfo.name;
  localStorage.id = state.userinfo.id;
  localStorage.email = state.userinfo.email;
  localStorage.loggedin = state.userinfo.loggedin
}

function handleLoginAdmin(state) {
  Vue.axios.defaults.headers.common['authorization'] = "Bearer " + state.userinfo.token;
  if (!state.userinfo.loggedin) {
    state.collections = [];
  }
  console.log(state.userinfo);
}
// can be removed when api delivers it properly
function getOntology(state, id) {
  Vue.axios.get('ontologies/' + id)
    .then(response => {
      var data = response.data;
      state.collection_relationList.push({ id: id, object: data.object, name: data.relation.relation_name, subject: data.subject });
    })
    .catch(error => {
      console.log(error.response, error);
      alert(error.response.data.message);
    });
}

