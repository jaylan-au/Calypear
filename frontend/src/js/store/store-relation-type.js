import Axios from 'axios';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    relationTypeCache: [],
  },
  mutations: {
    setRelationTypes (state, payload) {
      Vue.set(state,'relationTypeCache',payload.relationTypes);
    },
    createRelationType( state, payload) {
      state.relationTypeCache.push(payload.relationType);
    },
    updateRelationType(state, payload) {
      const simpleTypeIndex = state.relationTypeCache.findIndex((currType) => {
        return currType._id == payload.relationType._id;
      });
      if (simpleTypeIndex >= 0) {
        //Vue.set(array,index,value) will also work
        state.relationTypeCache.splice(simpleTypeIndex, 1, payload.relationType);
      }
    },
    deleteRelationType(state, payload) {
      const simpleTypeIndex = state.relationTypeCache.findIndex((currType) => {
        return currType._id == payload.id;
      });

      if (simpleTypeIndex >= 0) {
        state.relationTypeCache.splice(simpleTypeIndex, 1);
      }
    }
  },
  actions: {
    reloadRelationTypeCache({commit},payload) {
      return Axios.get('/admin/relation-type/').then((response) => {
        commit('setRelationTypes',{
          relationTypes: response.data
        });

      });
    },
    createRelationType({commit},createProps) {
      Axios.post('/admin/relation-type/',{
        typeName: createProps.relationType.typeName,
        typeNameInverse: createProps.relationType.typeNameInverse,
      }).then((response) => {
        commit('createRelationType',{
          relationType: response.data
        });
      }).catch((err) => {
        //FIXME: Handle this - error popup?
        console.log(err);
      });
    },
    updateRelationType({commit},updateProps) {
      let updateRequestProps = {
        typeName : updateProps.relationType.typeName,
        typeNameInverse : updateProps.relationType.typeNameInverse
      };
      Axios.put('/admin/relation-type/'.concat(updateProps.relationType._id),updateRequestProps).then((response) => {
        commit('updateRelationType',{
          relationType: response.data
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    deleteRelationType({commit},deleteProps) {
      Axios.delete('/admin/relation-type/'.concat(deleteProps.id)).then((response) => {
        commit('deleteRelationType',{
          id: deleteProps.id
        });
      }).catch((err) => {
        console.log(err);
      });
    },
  },
  getters: {
    relationTypeByID: (state) => (typeClassName,id) => {
      return state.relationTypeCache.find((currType) => {
        return currType._id == id;
      });
    }
  }
}
