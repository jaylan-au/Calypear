import Axios from 'axios';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    archComponentCache: [],
  },
  mutations: {
    setArchComponentCache(state, payload) {
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
    },
    createdArchComponent({commit, dispatch}, createProps) {
      // Axios.post('/arch-component/'.concat(createProps.id),createProps).then((response) => {
      //   //FIXME: actually update the cache intelligently
      //   if (response.data._id) {
      //     this.lastCreatedComponentId = response.data._id;
      //   }
        dispatch('reloadArchComponentCache');
      // }).catch((err) => {
      //   console.log(err);
      // });
    },
    updateArchComponent({commit, dispatch}, updateProps) {
      Axios.put('/arch-component/'.concat(updateProps.id),updateProps).then((response) => {
        //FIXME: actually update the cache intelligently
        dispatch('reloadArchComponentCache');
      }).catch((err) => {
        console.log(err);
      });
    },
    deleteArchComponent({commit, dispatch}, deleteProps) {
      Axios.delete('/arch-component/'.concat(deleteProps.id)).then((response) => {
        //FIXME: actually update the cache intelligently
        dispatch('reloadArchComponentCache');
      }).catch((err) => {
        console.log(err);
      });
    },
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
