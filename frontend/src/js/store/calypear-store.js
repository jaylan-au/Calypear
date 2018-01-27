import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import uuid from 'uuid/v4';
Vue.use(Vuex)
//Use vuex
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    componenttype: [],
    relationtype: [],
    tagtype: [],
  },
  mutations: {
    loadClassTypes (state, payload) {
      Vue.set(state,payload.classTypeName,payload.classTypeData);
    },
    createSimpleType( state, payload) {
      state[payload.typeClassName].push(payload.data);
    },
    updateSimpleType(state, payload) {
      const simpleTypeIndex = state[payload.typeClassName].findIndex((currType) => {
        return currType._id == payload.data._id;
      });
      if (simpleTypeIndex >= 0) {
        //Vue.set(array,index,value) will also work
        state[payload.typeClassName].splice(simpleTypeIndex, 1, payload.data);
      }
    },
    deleteSimpleType(state, payload) {
      const simpleTypeIndex = state[payload.typeClassName].findIndex((currType) => {
        return currType._id == payload.id;
      });

      if (simpleTypeIndex >= 0) {
        state[payload.typeClassName].splice(simpleTypeIndex, 1);
      }
    }
  },
  actions: {
    loadClassTypes({commit},payload) {
      return Axios.get('/admin/simple-type/'.concat(payload.typeClassName)).then((response) => {
        commit('loadClassTypes',{
          classTypeName: payload.typeClassName,
          classTypeData: response.data
        });

      });
    },
    createSimpleType({commit},createProps) {
      Axios.post('/admin/simple-type/'.concat(createProps.typeClassName),{
        typeName: createProps.typeName
      }).then((response) => {
        commit('createSimpleType',{
          typeClassName: createProps.typeClassName,
          data: response.data
        });
      }).catch((err) => {
        //FIXME: Handle this - error popup?
        console.log(err);
      });
    },
    updateSimpleType({commit},updateProps) {
      Axios.put('/admin/simple-type/'.concat(updateProps.typeClassName).concat('/').concat(updateProps.data._id),updateProps.data).then((response) => {
        commit('updateSimpleType',{
          typeClassName: updateProps.typeClassName,
          data: response.data
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    deleteSimpleType({commit},deleteProps) {
      Axios.delete('/admin/simple-type/'.concat(deleteProps.typeClassName).concat('/').concat(deleteProps.id)).then((response) => {
        commit('deleteSimpleType',{
          typeClassName: deleteProps.typeClassName,
          id: deleteProps.id
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    reloadAllTypes({commit, dispatch}){
      let typeClassNames = ['componenttype','relationtype','tagtype'];
      typeClassNames.forEach((typeClassName) => {
        dispatch('loadClassTypes',{typeClassName: typeClassName});
      });
    }
  },
  getters: {
    typeByID: (state) => (typeClassName,id) => {
      return state[typeClassName].find((currType) => {
        return currType._id == id;
      });
    }
  }
});
