import Vue from 'vue';
import Vuex from 'vuex';
import store from './calypear-store.js';
import componentTypeList from './component-type-list.vue';
//import store from './calypear-store.js';



new Vue({
  el: '#vueapp',
  store,
  components: {
    componentTypeList
  }

});
