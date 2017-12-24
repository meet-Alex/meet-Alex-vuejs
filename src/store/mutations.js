
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
  "relationlist": [],
  "ontologies": [],
  "terms": [],
  "owner": {},
  "links": []
};
export var state = {
  todos: ['a', 'b'],
  userinfo: { email: "cc", token: "" },
  collections: [],
  emptyCollection: noCollection,
  collection: noCollection,
  showTermList: [] //this is the list of detailed terms which are displayed
}

export const getters = {
  getTodo: state => {
    return state.todos
  },
  getLogin: state => {
    return state.userinfo;
  },
  getCollections: state => {
    return state.collections;
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
    console.log(">>", index);
    state.showTermList.splice(index, 1);
  },
  clearTermList(state) {
    state.showTermList = [];
  },
  fetchTerm(state, value) {
    //  Vue.http.get('terms/' + value.termId)
    Vue.axios.get('terms/' + value.termId)
      .then(response => {
        return response;
      })
      .then(response => {
        var data = response.data;
        console.log(data);
        //  state.showTermList.push(data);
        constructRelations(data);
        state.showTermList.splice(value.position, 0, data);
        console.log(value.position, state.showTermList);
      }
      ,
      function (error) {
        console.log(error);
      });

    function constructRelations(data) {
      console.log("construct Relations");
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
  fetchCollections(state) {
    var self = this;
    Vue.axios.get("collections")
      .then(response => {
        console.log(response);
        return response;
      })
      .then(response => {
        var data = response.data;
        console.log(data);
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
      },
      function (error) {
        console.log(error);
      });
  },
  fetchCollection(state, collectionId) {
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
          if (ontology.subject && ontology.subject) {
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
        relationList.push({ id: relation.id, object: relation.object, name: relation.name, subject: relation.subject });
      }
      return (relationList);
    };

    Vue.axios.get("collections/" + collectionId)
      .then(response => {
        console.log(response)
        return response;
      })
      .then(response => {
        var data = response.data;
        console.log(data);
        state.collection = data;
        //fill breadcrum
        state.collection.relationList = makeRelations();
        state.collection.public = state.collection.public.toString();
        state.collection.receive_notifications = state.collection.receive_notifications.toString();
      }
      ,
      function (error) {
        console.log(error);
      });
  },
  changeCollection(state, collection) {
    console.log('call collection change api here..', collection);
  },
  addTerm(state, newTerm) {
    var addedTerm = JSON.parse(JSON.stringify(newTerm));
    addedTerm.id = 9999;
    console.log('call term create api here...', addedTerm);
    state.collection.terms.push(addedTerm);
    Vue.axios.post("terms", {
      "collection_id": state.collection.id,
      "term_name": addedTerm.term_name,
      "term_definition": "Test definition",
      "token": state.userinfo.token

    });

  },
  changeTerm(state, term) {
    if (state.collection.terms.find(x => x.id === term.id)) {
      //only call change if term is not removed before
      console.log('call term change  api here...', term);
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
    //if (event) event.stopPropagation();
  },
  deleteTodo(state, { todo }) {
    state.todos.splice(state.todos.indexOf(todo), 1)
  },

  toggleTodo(state, { todo }) {
    todo.done = !todo.done
  },

  editTodo(state, { todo, value }) {
    todo.text = value
  },

  toggleAll(state, { done }) {
    state.todos.forEach((todo) => {
      todo.done = done
    })
  },

  clearCompleted(state) {
    state.todos = state.todos.filter(todo => !todo.done)
  }
}
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
