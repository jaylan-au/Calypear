<template>
  <div class="ui list grid">
    <component-relation-item
      v-for="componentRelation in componentRelations"
      v-bind:componentRelation="componentRelation" :key="componentRelation._id"
      :archComponentNameResolver="archComponentNameById"
      :typeNameResolver="typeNameByTypeId">
    </component-relation-item>
    <component-relation-new
      v-bind:componentId="componentId"
      v-on:component-relation-new="addComponentRelation"
      :archComponentNameResolver="archComponentNameById"
      :typeNameResolver="typeNameByTypeId">
    </component-relation-new>
  </div>
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
    let vm = this;
    console.log('a',vm.componentId);
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
    deleteComponentRelation(relationTransaction) {
      Axios.delete('/component-relation/',relationTransaction).then((results) => {
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
    typeNameByTypeId(typeClassName,id) {
      let typeData = this.$store.getters.typeByID(typeClassName,id);
      if (typeData) {
        return typeData.typeName;
      }
      return '';
    },
  },
  watch: {
    componentId: function(to, from) {
      this.fetchComponentRelations(to);
    }
  }
}


</script>
