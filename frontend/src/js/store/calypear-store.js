import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import uuid from 'uuid/v4';
import storeArchComponent from './store-arch-component';
import storeSimpleType from './store-simple-type';
import storeRelationType from './store-relation-type'
Vue.use(Vuex)
//Use vuex
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    archComponent: storeArchComponent,
    simpleType: storeSimpleType,
    relationType: storeRelationType,
  },
  state: {
    currentUser: null
  },
  mutations: {
    setCurrentUser (state, payload) {
      Vue.set(state,'currentUser',payload);
    },
  },
  getters: {
    isUserLoggedIn: state => {
      if (state.currentUser) {
        return true;
      } else {
        return false;
      }
    },
    loggedInUser: state => {
      return state.currentUser;
    },
  }
});
