<template>
  <select class="ui dropdown" :value="selected" ref="selectedType" v-on:change="updateSelection">
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
  props: {
    typeClassName: String,
    selected: String
  },
  data() {
    return {
      value: String,
    }
  },
  computed: {
    classTypes: function(){
      return this.$store.state.simpleType[this.typeClassName];
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
    updateSelection() {
      this.value = this.$refs.selectedType.value;
    }
  },
  watch: {
    selected: function(to, from) {
      console.log(to);
      this.value = to;
    }
  }
}


</script>
