import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import { mutations } from './mutations'


Vue.use(Vuex)

const state = {
  userinfo: { email: "", token: "" },
  collections: [],
  emptyCollection: {},
  collection: {},
  collection_relationList: [],
  showTermList: [] //this is the list of detailed terms which are displayed
}

export default new Vuex.Store({
  state ,
  mutations,
  getters,
  actions
})