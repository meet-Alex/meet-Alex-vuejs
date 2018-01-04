import Vue from 'vue'
import globalData from '../global_data';
import axios from '../backend/vue-axios';

export const LOGIN = ({ commit }, userData) => {
    return new Promise((resolve, reject) => {
        Vue.axios.post("login", userData)
            .then((response) => {
                commit('updateLogin', response.data)
                resolve(response)
            })
    })
}
export const LOGOUT = ({ commit }) => {
    return new Promise((resolve, reject) => {
        commit('logOut');
        resolve();
    })
}
export const REGISTER = ({ commit }, userData) => {
    //@todo: this does not work yet
    return new Promise((resolve, reject) => {
        Vue.axios.post("register", userData)
            .then((response) => {
                Vue.axios.post("login", userData)
                    .then((response) => {
                        commit('updateLogin', response.data)
                        resolve()
                    })
            })
    })
}
export const ADD_TERM = ({ commit }, term) => {
    Vue.axios.post("terms", term)
        .then(response => {
            commit('addTerm', response.data)
        })
}
export const CHANGE_TERM = ({ commit }, term) => {
    Vue.axios.put("terms/" + term.id, term)
        .then(response => {
            commit('changeTerm', response.data)
        })
}
export const REMOVE_TERM = ({ commit }, term) => {
    // maybe make a promise here
    Vue.axios.delete("terms/" + term.id)
        .then(response => {
            commit('removeTerm', term)
        })
}

export const FETCH_TERM = ({ commit }, term) => {
    Vue.axios.get('terms/' + term.id)
        .then(response => {
            var data = response.data
            data.relations = constructRelations(data)
            data.position = term.position
            commit('fetchTerm', data)
        })
}

export const FETCH_COLLECTIONS = ({ commit }) => {
    Vue.axios.get("collections")
        .then(response => {
            var data = response.data
            //data is an object, change it to array
            var collections = Object.keys(data).map(key => data[key])
            commit('fetchCollections', collections)
        })
}
export const ADD_COLLECTION = ({ commit }, collection) => {

    return new Promise((resolve, reject) => {
        Vue.axios.post("collections", collection)
        .then(response => {
            resolve(response.data);
        })
  
    })
}

export const DELETE_COLLECTION = ({ commit }, collection) => {
    // maybe make a promise here

    return new Promise((resolve, reject) => {
        Vue.axios.delete("collections/" + collection.id)
        .then(response => {
            resolve(response.data);
        })
    })
}


export const FETCH_COLLECTION = ({ commit }, collectionId) => {
    if (collectionId === 'new') {
        var collection = JSON.parse(JSON.stringify(noCollection));
        commit('fetchCollection', collection)
    } else {
        Vue.axios.get("collections/" + collectionId)
            .then(response => {
                var collection = response.data;
                collection.public = collection.public.toString();
                collection.receive_notifications = collection.receive_notifications.toString();
                commit('fetchCollection', collection)
            })
    }
}
export const REFRESH_TERMLIST = ({ commit, state }) => {
    state.showTermList.map(function (term, index) {
        console.log(term, index);
        Vue.axios.get('terms/' + term.id)
            .then(response => {
                var data = response.data
                data.relations = constructRelations(data)
                data.position = index
                commit('fetchTerm', data)
            })
    });
}
export const ADD_RELATION = ({ commit, state }, parms) => {
    var newRelation = parms.relation;
    var collectionId = parms.collectionId;
    Vue.axios.post("ontologies", {
        "collection_id": collectionId,
        "object_id": newRelation.object.id,
        "relation_name": newRelation.name,
        "subject_id": newRelation.subject.id
    })
        .then(response => {
            console.log(response.data)
            commit('addRelation', { subject: newRelation.subject, name: newRelation.name, object: newRelation.object, id: response.data.id });
            for (var i = 0; i < state.showTermList.length; i++) {
                var term = state.showTermList[i];
                //@todo: should come from api
                if ((term.id === newRelation.subject.id) || (term.id === newRelation.object.id)) {
                    Vue.axios.get('terms/' + term.id)
                        .then(response => {
                            var data = response.data
                            data.relations = constructRelations(data)

                            data.position = term.position
                            commit('fetchTerm', data)
                        })
                }
            }
        })
}

export const REMOVE_RELATION = ({ commit, state }, id) => {
    Vue.axios.delete("ontologies/" + id)
        .then(response => {
            commit('removeRelation', id)
            for (var i = 0; i < state.showTermList.length; i++) {
                var term = state.showTermList[i];
                if (term.relations.find(x => x.id === id)) {
                    Vue.axios.get('terms/' + term.id)
                    .then(response => {
                        var data = response.data
                        data.relations = constructRelations(data)
                        data.position = i
                        commit('fetchTerm', data)
                    })
                }
            }
        })
}
export const CHANGE_RELATION = ({ commit, state }, parms) => {
    //todo: should come from api
    // now delete/add
    Vue.axios.delete("ontologies/" + parms.relation.id)
    .then(response => {
        commit('removeRelation', parms.relation.id)

        //add relation
        var newRelation = parms.relation;
        var collectionId = parms.collectionId;
        Vue.axios.post("ontologies", {
            "collection_id": collectionId,
            "object_id": newRelation.object.id,
            "relation_name": newRelation.name,
            "subject_id": newRelation.subject.id
        })
            .then(response => {
                console.log(response.data)
                commit('addRelation', { subject: newRelation.subject, name: newRelation.name, object: newRelation.object, id: response.data.id });
                for (var i = 0; i < state.showTermList.length; i++) {
                    var term = state.showTermList[i];
                    //@todo: should come from api
                    if ((term.id === newRelation.subject.id) || (term.id === newRelation.object.id)) {
                        Vue.axios.get('terms/' + term.id)
                            .then(response => {
                                var data = response.data
                                data.relations = constructRelations(data)
    
                                data.position = term.position
                                commit('fetchTerm', data)
                            })
                    }
                }
            })

        for (var i = 0; i < state.showTermList.length; i++) {
            var term = state.showTermList[i];
            if (term.relations.find(x => x.id === parms.relation.id)) {
                Vue.axios.get('terms/' + term.id)
                .then(response => {
                    var data = response.data
                    data.relations = constructRelations(data)
                    data.position = i
                    commit('fetchTerm', data)
                })
            }
        }
    })
}

function constructRelations(data) {
    var relations = [];
    data.objects.map(function (object) {
        if (!object.archived)
            relations.push({ subject: { id: data.id, term_name: data.term_name }, name: object.relation.relation_name, id: object.id, object: { id: object.object.id, term_name: object.object.term_name }, type: 0 });
    })
    data.subjects.map(function (subject) {
        if (!subject.archived)
            relations.push({ object: { id: data.id, term_name: data.term_name }, name: subject.relation.relation_name, id: subject.id, subject: { id: subject.subject.id, term_name: subject.subject.term_name }, type: 1 })

    })
    return relations;
}

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












