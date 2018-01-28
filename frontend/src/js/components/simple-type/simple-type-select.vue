<template>
  <select class="ui dropdown" v-bind:value="selected" ref="selectedType" v-on:change="updateSelectedType">
    <option disabled value="">Please select one</option>
    <option v-for="classType in classTypes" v-bind:value="classType._id">
      {{ classType.typeName }}
    </option>
  </select>
</template>
<script>
import Axios from 'axios';

export default {
  //FIXME: having to allow mutation of the prop as the archcomponent isn't loaded when the prop is assigned so value is updated later
  props: ['typeClassName','selected'],
  data() {


    return {
      selectedType: '',
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
    // this.selectedType = this.selected;
    // console.log('G %s',this.typeClassName);
    // console.log('G %s',this.selected);
  },
  methods: {
    updateSelectedType(){
      this.selectedType = this.$refs.selectedType.value;
    }
  }
}


</script>
