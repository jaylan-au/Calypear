import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import uuid from 'uuid/v4';
Vue.use(Vuex)
//Use vuex
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    componentTypes: [],
  },
  mutations: {
    loadComponentTypes (state, payload) {
      state.componentTypes = [].concat(payload);
    },
    createComponentType (state, newComponentType) {
      state.componentTypes.push(newComponentType);
    },
    updateComponentType (state, newComponentType) {
      const componentTypeIndex = state.componentTypes.findIndex((currType) => {
        return currType._id == newComponentType._id;
      });
      if (componentTypeIndex >= 0) {
        //Vue.set(array,index,value) will also work
        state.componentTypes.splice(componentTypeIndex, 1, newComponentType);
      }
    },
    deleteComponentType (state, typeToDeleteId) {
      const componentTypeIndex = state.componentTypes.findIndex((currType) => {
        return currType._id == typeToDeleteId;
      });

      if (componentTypeIndex >= 0) {
        state.componentTypes.splice(componentTypeIndex, 1);
      }

    }
  },
  actions: {
    loadComponentTypes({commit}) {
      return Axios.get('/component-type').then((response) => {
        commit('loadComponentTypes',response.data);
      });
    },
    createComponentType({commit},componentType) {
      Axios.post('/component-type',componentType).then((response) => {
        commit('createComponentType',response.data);
      }).catch((err) => {
        //FIXME: Handle this - error popup?
        console.log(err);
      });

    },
    updateComponentType({commit},componentType) {
      //Decide ? Push to DB first and on success do the commit
      //OR commit first then try the DB and pus back later?
      Axios.put('/component-type/'.concat(componentType._id),componentType).then((response) => {
        commit('updateComponentType',componentType);
      }).catch((err) => {
        console.log(err);
      });


    },
    deleteComponentType({commit},typeToDeleteId) {
      Axios.delete('/component-type/'.concat(typeToDeleteId)).then((response) => {
        commit('deleteComponentType',typeToDeleteId);
      }).catch((err) => {
        console.log(err);
      });

    }
  }
});
