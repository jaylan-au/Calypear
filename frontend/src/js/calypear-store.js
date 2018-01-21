import Vue from 'vue';
import Vuex from 'vuex';
import uuid from 'uuid/v4';
Vue.use(Vuex)
//Use vuex
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    componentTypes: [
      {
        _id: '1-A',
        typeName: 'Database'
      },
      {
        _id: '2-A',
        typeName: 'Logical System'
      }
    ],
  },
  mutations: {
    createComponentType (state, newComponentType) {
      newComponentType._id = uuid();
      state.componentTypes.push(newComponentType);
    },
    updateComponentType (state, newComponentType) {
      const componentTypeIndex = state.componentTypes.findIndex((currType) => {
        return currType._id == newComponentType._id;
      });
      console.log(newComponentType);
      if (componentTypeIndex) {
        console.log(componentTypeIndex);
        //Vue.set(array,index,value) will also work
        state.componentTypes.splice(componentTypeIndex, 1, newComponentType);
      }
      console.log(state.componentTypes);
    },
    deleteComponentType (state, typeToDeleteId) {
      const componentTypeIndex = state.componentTypes.findIndex((currType) => {

        return currType._id == typeToDeleteId;
      });

      if (componentTypeIndex) {
        state.componentTypes.splice(componentTypeIndex, 1);
      }

    }
  },
  actions: {
    createComponentType({commit},componentType) {
      commit('createComponentType',componentType);
    },
    updateComponentType({commit},componentType) {
      commit('updateComponentType',componentType);
    },
    deleteComponentType({commit},typeToDeleteId) {
      commit('deleteComponentType',typeToDeleteId);
    }
  }
});
