<template>
  <select class="ui dropdown" v-model="selectedType">
    <option disabled value="">Please select one</option>
    <option v-for="classType in classTypes" v-bind:value="classType._id">
      {{ classType.typeName }}
    </option>
  </select>
</template>
<script>
import Axios from 'axios';

export default {
  props: ['typeClassName','selected'],
  data() {
    return {
      selectedType: this.selected,
    }
  },
  computed: {
    classTypes: function(){
      return this.$store.state[this.typeClassName];
    },
  },
  created: function(){
    this.$store.dispatch('loadClassTypes',{
      typeClassName: this.typeClassName
    });
  },
}


</script>
