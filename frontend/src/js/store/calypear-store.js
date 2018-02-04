import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import uuid from 'uuid/v4';
import storeArchComponent from './store-arch-component.js';
import storeSimpleType from './store-simple-type.js';
Vue.use(Vuex)
//Use vuex
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    archComponent: storeArchComponent,
    simpleType: storeSimpleType,
  }
});
