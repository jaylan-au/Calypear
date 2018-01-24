import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import store from './store/calypear-store.js';
import componentTypeList from './component-type-list.vue';
import archComponent from './arch-component/arch-component.vue';
//import store from './calypear-store.js';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/component-type',
      component: componentTypeList
    },
    {
      path: '/arch-component/:id',
      component: archComponent
    }
  ]
})

const app = new Vue({
  router: router,
  store
}).$mount('#vueapp');
// new Vue({
//   el: '#vueapp',
//   store,
//   components: {
//     componentTypeList
//   }
//
// });
