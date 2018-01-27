<template>
  <div>
    <div class="ui section">
      <div class="ui middle aligned selection list ">
        <simple-type-item
          v-for="simpleTypeData in classTypes"
          v-bind:simpleTypeData="simpleTypeData"
          v-bind:typeClassName="typeClassName"
          :key="simpleTypeData._id"
          v-on:delete-simple-type="deleteSimpleType"
          v-on:update-simple-type="updateSimpleType" >
        </simple-type-item>
        <simple-type-new
          v-bind:typeClassName="typeClassName"
          v-on:create-simple-type="createSimpleType" >
        </simple-type-new>
      </div>
    </div>
  </div>
</template>
<script>

import simpleTypeItem from './simple-type-item.vue';
import simpleTypeNew from './simple-type-new.vue';

export default {
  components: {
    simpleTypeItem,
    simpleTypeNew,
  },
  state: {
    typeClassName: '',
  },
  created: function() {

    this.typeClassName = this.$route.params.typeClass;
    this.loadClassTypes(this.typeClassName);
    console.log('Component Creation as %s',this.typeClassName);
  },
  computed: {
    classTypes: function(){
      console.log(this.$store.state);
      return this.$store.state[this.typeClassName];
    }
  },
  methods: {
    // classTypesx() {
    //   console.log('Recompute for: %s',this.typeClassName);
    //   return this.$store.state[this.typeClassName];
    // },
    loadClassTypes(typeClassName){
      console.log('Loading %s',typeClassName);
      this.$store.dispatch('loadClassTypes',{
        typeClassName: typeClassName
      });
      //this.classTypes();
      //this.classTypes = typeClassName; //this.$store.state[this.typeClassName];
      console.log('Loaded %s',typeClassName);
      console.log(this.classTypes);
    },
    // deleteComponentType(componentTypeId) {
    //   this.$store.dispatch('deleteComponentType',componentTypeId);
    // },
    createSimpleType(createProps) {
      this.$store.dispatch('createSimpleType',createProps);
    },
    updateSimpleType(updateProps) {
      this.$store.dispatch('updateSimpleType',updateProps);
    },
    deleteSimpleType(deleteProps) {
      this.$store.dispatch('deleteSimpleType',deleteProps);
    }
    // updateComponentType(componentType) {
    //   this.$store.dispatch('updateComponentType',componentType);
    // }
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      console.log(to.params);
      this.typeClassName = to.params.typeClass;
      this.loadClassTypes(this.typeClassName);

      //How to reload here??
    }
  },
  // afterRouteUpdate (to, from, next) {
  //   // react to route changes...
  //   // don't forget to call next()
  //   console.log('hello');
  //   console.log(this.$route.params);
  //   //Load the Arch component into the store
  //   //Axios.get('/archComponent')
  // }
}
</script>
