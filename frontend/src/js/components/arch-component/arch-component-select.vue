<template>
  <select class="ui dropdown" v-model="value" ref="selectedComponent" v-on:change="updateSelection">
    <option disabled value="">Please select one</option>
    <option v-for="archComponent in archComponents" v-bind:value="archComponent._id">
      {{ archComponent.componentName }}
    </option>
  </select>
</template>
<script>
import Axios from 'axios';

export default {
  //FIXME: having to allow mutation of the prop as the archcomponent isn't loaded when the prop is assigned so value is updated later
  props: {
    selected: String
  },
  data() {
    return {
      value: String,
    }
  },
  computed: {
    archComponents: function(){
      return this.$store.state.archComponent.archComponentCache;
    },
  },
  created: function(){
  },
  methods: {
    updateSelection() {
      //this.value = this.$refs.selectedComponent.value;
    }
  },
  watch: {
    selected: function(to, from) {
      this.value = to;
    }
  }
}


</script>
