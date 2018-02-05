<template>
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
</template>
<script>

import simpleTypeItem from '../../components/simple-type/simple-type-item.vue';
import simpleTypeNew from '../../components/simple-type/simple-type-new.vue';


export default {
  props: ['typeClassName'],
  components: {
    simpleTypeItem,
    simpleTypeNew
  },
  created: function() {

  },
  computed: {
    classTypes: function(){
      return this.$store.state.simpleType[this.typeClassName];
    }
  },
  methods: {
    createSimpleType(createProps) {
      this.$store.dispatch('createSimpleType',createProps);
    },
    updateSimpleType(updateProps) {
      this.$store.dispatch('updateSimpleType',updateProps);
    },
    deleteSimpleType(deleteProps) {
      this.$store.dispatch('deleteSimpleType',deleteProps);
    }
  },
  watch: {
    '$route' (to, from) {
      console.log(this.typeClassName);
    }
  },
}
</script>
