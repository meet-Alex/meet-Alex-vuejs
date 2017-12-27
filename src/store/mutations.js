
import Vue from 'vue'
import globalData from '../global_data';
import axios from '../backend/vue-axios';

const noCollection = {
  "id": -1,
  "parent_id": null,
  "collection_name": "",
  "collection_description": "",
  "public": "1",
  "receive_notifications": "1",
  "created_by": -1,
  "created_at": "",
  "updated_at": "",
  "term_count": 0,
  "ontologies_count": 0,
  "owner_name": "",
  "bookmarked": true,
  "relations": [],
  "relationList": [],
  "ontologies": [],
  "terms": [],
  "owner": {},
  "links": []
};
export var state = {
  userinfo: { email: "", token: "" },
  collections: [],
  emptyCollection: noCollection,
  collection: noCollection,
  collection_relationList: [],
  showTermList: [] //this is the list of detailed terms which are displayed
}

export const getters = {
  getLogin: state => {
    return state.userinfo;
  },
  getCollections: state => {
    return state.collections;
  },
  relationList: state => {
    return state.collection_relationList;
  }
}

export const mutations = {
  getLogin(state) {
    getLoginFromStorage();
    handleLoginAdmin();
  },
  updateLogin(state, logininfo) {
    if (logininfo.token.length) {
      state.userinfo = {
        email: logininfo.user.email,
        name: logininfo.user.name,
        id: logininfo.user.id,
        token: logininfo.token,
        loggedin: true
      };
      setLoginToStorage();
    }
    handleLoginAdmin();
  },
  logOut(state) {
    state.userinfo = {
      email: "",
      name: "",
      id: "",
      token: "",
      loggedin: false
    };
    setLoginToStorage();
    handleLoginAdmin();

  },
  removeTermFromList(state, index) {
    state.showTermList.splice(index, 1);
  },
  clearTermList(state) {
    state.showTermList = [];
  },
  // handle term changes
  fetchTerm(state, term) {
    Vue.axios.get('terms/' + term.termId)
      .then(response => {
        var data = response.data;
        constructRelations(data);
        // avoid that a term occurs twice, so first remove from list, then add again
        state.showTermList = state.showTermList.filter(function (thisterm) {
          return thisterm.id != term.termId;
        })
        state.showTermList.splice(term.position, 0, data);
      })
      .catch(error => {
        console.log(error.response, error);
        alert(error.response.data.message);
      });
    function constructRelations(data) {
      var relations = [];
      data.objects.map(function (object) {
        relations.push({ subject: data, relation: object.relation, object: object.object, type: 0 });
      });
      data.subjects.map(function (subject) {
        relations.push({ object: data, relation: subject.relation, subject: subject.subject, type: 1 });
      });
      data.relations = relations;
    }
  },
  addTerm(state, newTerm) {
    console.log('call term create api here...', newTerm);
    Vue.axios.post("terms", {
      "collection_id": state.collection.id,
      "term_name": newTerm.term_name,
      "term_definition": newTerm.term_definition
    })
      .then(response => {
        console.log(response);
        state.collection.terms.push(response.data);
      })
      .catch(error => {
        console.log(error.response);
        alert(error.response.data.message);
      });
  },
  changeTerm(state, term) {
    if (state.collection.terms.find(x => x.id === term.id)) {
      //only call change if term is not removed before
      console.log('call term change  api here...', term);
      Vue.axios.put("terms/" + term.id, {
        "collection_id": term.collection_id,
        "term_name": term.term_name,
        "term_definition": term.term_definition
      })
        .then(resonse => { })
        .catch(error => {
          console.log(error.response);
          alert(error.response.data.message);
        });
    }
  },
  removeTerm(state, term) {
    console.log('call term remove  api here...', term);
    Vue.axios.delete("terms/" + term.id)
      .then(response => {
        state.collection.terms = state.collection.terms.filter(function (thisterm) {
          return thisterm.id != term.id;
        })
      })
      .catch(error => {
        console.log(error.response);
        alert(error.response.data.message);
      });
  },
  // handle relation changes
  addRelation(state, parms) {
    addRelation1(state, parms);
  },
  removeRelation(state, id) {
    removeRelation1(state, id, null);
  },
  changeRelation(state, parms) {
    var relation=parms.relation;
    var collectionId=parms.collectionId;
    console.log('Todo Change relation api call', relation);
    removeRelation1(state, relation.id);
    addRelation1(state, parms);
  },
  // handle collection changes
  fetchCollections(state) { // fetch list of all collections
    var self = this;
    Vue.axios.get("collections")
      .then(response => {
        var data = response.data;
        //data is an object, change it to array
        state.collections = Object.keys(data).map(key => data[key]);

        //@TODO: now faked owner/collaborate/bookmared for DEMO
        state.collections.forEach(function (collection) {
          collection.authorisation = globalData.AUTHTYPE.NONE;
        });
        state.collections[3].authorisation = globalData.AUTHTYPE.OWNER;
        state.collections[1].authorisation = globalData.AUTHTYPE.OWNER;
        state.collections[6].authorisation = globalData.AUTHTYPE.CONTRIBUTOR;
        state.collections[8].authorisation = globalData.AUTHTYPE.BOOKMARKED;
        state.collections[9].authorisation = globalData.AUTHTYPE.BOOKMARKED;
      })
      .catch(error => {
        console.log(error.response);
        alert(error.response.data.message);
      });
  },
  fetchCollection(state, collectionId) {  // fetch one collection
    if (collectionId === 'new') {
      state.collection = JSON.parse(JSON.stringify(noCollection));
      return;
    }

    function makeRelations() {
      var ontology, term, orgRelation;
      var relation = {}, relationList = [];
      var i, a;
      for (i = 0; i < state.collection.ontologies.length; i++) {

        ontology = state.collection.ontologies[i];
        if (ontology.archived) {continue}; // remove deleted relations
        relation={};
        relation.id = ontology.id;
        // replace ids by the objects
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
        if (!relation.object || !relation.subject) {  // fetch terms which are not part of this collection
          getOntology(ontology.id);
        }
        else {
           relationList.push({ id: relation.id, object: relation.object, name: relation.name, subject: relation.subject });
        }
      }
      return (relationList);
    };

    Vue.axios.get("collections/" + collectionId)
      .then(response => {
        var data = response.data;
        state.collection = data;
        state.collection_relationList = makeRelations();
        state.collection.public = state.collection.public.toString();
        state.collection.receive_notifications = state.collection.receive_notifications.toString();
      })
      .catch(error => {
        console.log(error.response);
        alert(error.response.data.message);
      });
  },
  changeCollection(state, collection) {
    console.log('call collection change api here..', collection);
  }

}

//helper functions
function getLoginFromStorage() {
  state.userinfo = {
    email: localStorage.email,
    name: localStorage.name,
    id: localStorage.id,
    token: localStorage.token,
    loggedin: (localStorage.loggedin === "true")
  };
}
function setLoginToStorage() {
  localStorage.token = state.userinfo.token;
  localStorage.name = state.userinfo.name;
  localStorage.id = state.userinfo.id;
  localStorage.email = state.userinfo.email;
  localStorage.loggedin = state.userinfo.loggedin
}

function handleLoginAdmin() {
  Vue.axios.defaults.headers.common['authorization'] = "Bearer " + state.userinfo.token;
  if (!state.userinfo.loggedin) {
    state.collections = [];
  }
  console.log(state.userinfo);
}
function addRelation1(state, parms) {
  console.log('call relation create api here...', parms);
  var newRelation = parms.relation;
  var collectionId = parms.collectionId;
  Vue.axios.post("ontologies", {
    "collection_id": collectionId,
    "object_id": newRelation.object.id,
    "relation_name": newRelation.name,
    "subject_id": newRelation.subject.id
  })
    .then(response => {
      console.log(response);
      state.collection_relationList.push({ subject: newRelation.subject, name: newRelation.name, object: newRelation.object, id: response.data.id });
    })
    .catch(error => {
      console.log(error);
      if (error.status == 201) {  // somehow 201 is reported as error, but it is ok
        state.collection_relationList.push({ subject: newRelation.subject, name: newRelation.name, object: newRelation.object, id: response.data.id });
      } else {
        alert(error.response.data.message);
      }
    });
}
function  removeRelation1(state, id) {
  console.log('call relation remove  api here...', id);
  Vue.axios.delete("ontologies/" + id)
    .then(response => {
      state.collection_relationList = state.collection_relationList.filter(function (relation) {
        return relation.id != id;
      });
    })
    .catch(error => {
      console.log(error.response);
      alert(error.response.data.message);
    });
}
function getOntology(id) {
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
