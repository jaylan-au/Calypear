<template>
  <table class="ui table">
    <tbody>
      <component-relation-item
        v-for="componentRelation in componentRelations"
        v-bind:componentRelation="componentRelation" :key="componentRelation._id"
        :archComponentNameResolver="archComponentNameById"
        :typeNameResolver="typeNameByTypeId"
        v-on:component-relation-delete="deleteComponentRelation">
      </component-relation-item>
      <component-relation-new
        v-bind:componentId="componentId"
        v-on:component-relation-new="addComponentRelation"
        :archComponentNameResolver="archComponentNameById"
        :typeNameResolver="typeNameByTypeId">
      </component-relation-new>
    </tbody>
  </table>
</template>
<script>
import Axios from 'axios';
import componentRelationItem from './component-relation-item.vue';
import componentRelationNew from './component-relation-new.vue';

export default {
  props: ['componentId'],
  components: {
    componentRelationItem,
    componentRelationNew,
  },
  data() {
    return {
      componentRelations: [],
    }
  },
  mounted() {
    this.fetchComponentRelations(this.componentId);
  },
  methods: {
    addComponentRelation(payload) {
      //console.log(payload);
      Axios.post('/component-relation/',payload.relationData).then((results) => {
        this.fetchComponentRelations(this.componentId);
      }).catch((err) => {
        //FIXME: handle this proeprly
        console.log(err);
      });
    },
    deleteComponentRelation(transaction) {
      Axios.delete('/component-relation/'.concat(transaction)).then((results) => {
        this.fetchComponentRelations(this.componentId);
      }).catch((err) => {
        //FIXME: handle this proeprly
        console.log(err);
      });
    },
    fetchComponentRelations(componentId) {
      let vm = this;
      Axios.get('/component-relation/component/'.concat(componentId)).then((results) => {
        this.componentRelations = results.data;
      }).catch((err) => {
        //FIXME: handle this
        console.log(err);
      })
    },
    archComponentNameById(id) {
      let archComponentData = this.$store.getters['archComponent/archComponentById'](id);
      if (archComponentData) {
        return archComponentData.componentName;
      }

      return 'Unknown Component:'+id;
    },
    typeNameByTypeId(typeClassName,id,isInverse = false) {
      let typeData = this.$store.getters.typeByID(typeClassName,id);
      if (typeData) {
        //Handle the special case for relation types
        if ((isInverse) && (typeClassName == 'relationtype')) {
          return typeData.typeNameInverse;
        } else {
          return typeData.typeName;
        }
      }
      return 'Unknown type:'+id;
    },
  },
  watch: {
    componentId: function(to, from) {
      this.fetchComponentRelations(to);
    }
  }
}


</script>
