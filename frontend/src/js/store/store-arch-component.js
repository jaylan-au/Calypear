import Axios from 'axios';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    archComponentCache: [],
  },
  mutations: {
    setArchComponentCache (state, payload) {
      Vue.set(state,'archComponentCache',payload.archComponents);
    },
  },
  actions: {
    reloadArchComponentCache({commit, dispatch}){
      return Axios.get('/arch-component').then((response) => {
        commit('setArchComponentCache',{
          archComponents: response.data,
        });
      });
    }
  },
  getters: {
    archComponentById: (state) => (id) => {
      //Try to find the component first
      return state.archComponentCache.find((currentComponent) => {
        return currentComponent._id == id;
      });
      //If not found refresh the casche
    }
  }
}
