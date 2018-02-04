<template>
  <div class="ui segement">
    <div class="header">Search Results</div>
    <arch-component-list
      v-bind:archComponents="searchResults"
      v-on:arch-component-delete="deleteArchComponent">
    </arch-component-list>
    <arch-component-new
      v-on:arch-component-create="createArchComponent">
    </arch-component-new>
  </div>
</template>
<script>
import Axios from 'axios';
import archComponentList from '../components/arch-component/arch-component-list.vue';
import archComponentNew from '../components/arch-component/new.vue';

export default {
  components: {
    archComponentList,
    archComponentNew,
  },
  computed: {
    searchResults: function(){
      return this.$store.state.archComponent.archComponentCache;
    }
  },
  methods: {
    createArchComponent(createProps) {
      this.$store.dispatch('archComponent/createArchComponent',createProps);
    },
    updateArchComponent(updateProps) {
      this.$store.dispatch('archComponent/updateArchComponent',updateProps);
    },
    deleteArchComponent(deleteProps) {
      this.$store.dispatch('archComponent/deleteArchComponent',deleteProps);
    }
  }
}
</script>
