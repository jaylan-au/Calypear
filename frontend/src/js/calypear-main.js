import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Logger from './lib/logger';
import store from './store/calypear-store.js';

import simpleTypeList from './simple-type/simple-type-list.vue';
import archComponentSearch from './pages/arch-component-search.vue';
import archComponentView from './pages/arch-component-view.vue';
//import store from './calypear-store.js';

Vue.use(VueRouter);
Vue.use(Logger);

const router = new VueRouter({
  routes: [
    {
      path: '/admin/simple-type/:typeClass',
      component: simpleTypeList
    },
    {
      path: '/arch-component',
      name: 'arch-component-search',
      component: archComponentSearch
    },
    {
      path: '/arch-component/view/:componentId',
      name: 'arch-component-view',
      component: archComponentView,
      props: (route) => ({"componentId": route.params.componentId})
    }
  ]
})

const app = new Vue({
  router: router,
  store,
  created: function() {
    this.$store.dispatch('reloadAllTypes');
    this.$store.dispatch('archComponent/reloadArchComponentCache')
  }
}).$mount('#vueapp');
// new Vue({
//   el: '#vueapp',
//   store,
//   components: {
//     componentTypeList
//   }
//
// });
