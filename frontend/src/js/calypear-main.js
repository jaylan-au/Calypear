import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Logger from './lib/logger';
import store from './store/calypear-store.js';

import simpleTypeList from './pages/admin/simple-type-list.vue';
import relationTypeList from './components/relation-type/list.vue';
import archComponentSearch from './pages/arch-component-search.vue';
import archComponentView from './pages/arch-component-view.vue';
import archComponentNewPage from './pages/arch-component-new.vue';
import archComponentQuicksearch from './components/arch-component/arch-component-quicksearch.vue';
import componentTypeFilterList from './components/component-type/component-type-filter-list.vue';
import appUserList from './pages/admin/app-user.vue';
import loginPage from './pages/auth/login.vue';
//import store from './calypear-store.js';
import Axios from 'axios';
import qs from 'qs';

Vue.use(VueRouter);
Vue.use(Logger);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/app/admin/simple-type/:typeClassName',
      component: simpleTypeList,
      props: (route) => ({"typeClassName": route.params.typeClassName})
    },
    {
      path: '/app/admin/relation-type',
      component: relationTypeList
    },
    {
      path: '/app/admin/app-user',
      component: appUserList
    },
    {
      path: '/app/arch-component',
      name: 'arch-component-search',
      component: archComponentSearch
    },
    {
      path: '/app/arch-component/new',
      name: 'arch-component-new',
      component: archComponentNewPage,
    },
    {
      path: '/app/arch-component/view/:componentId',
      name: 'arch-component-view',
      component: archComponentView,
      props: (route) => ({"componentId": route.params.componentId})
    },
    {
      path: '/app/login',
      name: 'login',
      component: loginPage,
    }
  ]
})

//Register an interceptor to handle standard backend errors
Axios.interceptors.response.use(function (response) {
  return response;
}, function (err) {
    if (401 === err.response.status) {
      //Redirect to login
      let loginParams = {
        forwardTo: err.request.responseURL
      }
      window.location = '/app/login?'+qs.stringify(loginParams);
      //Forward on the error
      return Promise.reject(err);
    } else {
      //Some other error let the caller handle it
      return Promise.reject(err);
    }
});

store.subscribe((mutation, state) => {
	// Store the state object as a JSON string
  console.log('Store Mutation');

  // where mutation.type = 'setCurrentUser'
  if (mutation.type == 'setCurrentUser') {
      let userState = mutation.payload;
      localStorage.setItem('user', JSON.stringify(userState));
  }
	//localStorage.setItem('store', JSON.stringify(state));
});

const app = new Vue({
  components: {
    archComponentQuicksearch,
    componentTypeFilterList,
    appUserList
  },
  router: router,
  store,
  created: function() {
    this.$store.dispatch('reloadAllTypes');
    this.$store.dispatch('relationType/reloadRelationTypeCache');
    this.$store.dispatch('archComponent/reloadArchComponentCache');
  }
}).$mount('#vueapp');
