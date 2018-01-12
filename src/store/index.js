import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import { mutations } from './mutations'


Vue.use(Vuex)

const state = {
  userinfo: { email: "", token: "" },
  showSearchBox: true,
  isLoading: false,
  collections: [],
  emptyCollection: {},
  collection:  {
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
  },
  collection_relationList: [],
  showTermList: [] //this is the list of detailed terms which are displayed
}

export default new Vuex.Store({
  state ,
  mutations,
  getters,
  actions
})