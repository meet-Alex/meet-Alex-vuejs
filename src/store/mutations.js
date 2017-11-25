
import Vue from 'vue'
import globalData from '../global_data';
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
  collection: noCollection
}

export const getters = {
  getTodo: state => {
    return state.todos
  },
  getLogin: state => {
    return state;
  },
  getCollections: state => {
    return state.collections;
  }
}

export const mutations = {
  updateLogin(state, logininfo) {
    if (logininfo.token.length) {
      state.userinfo = {
        email: logininfo.email,
        name: logininfo.email.split("@")[0],
        token: logininfo.token,
        loggedin: true
      };
    } else {
      state.userinfo = { loggedin: false };
    }
  },
  fetchCollections(state) {
    var self = this;
    Vue.http.get('collections', { body: { _token: state.userinfo.token } })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(data => {
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
    if (collectionId==='new') {
      state.collection=JSON.parse(JSON.stringify(noCollection));
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
    Vue.http.get('collections/' + collectionId)
      .then(response => {
        return response.json();
      })
      .then(data => {
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
  addTodo(state, { text }) {
    state.todos.push({
      text,
      done: false
    })
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