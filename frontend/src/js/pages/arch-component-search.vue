<template>
  <div class="ui segement">
    <h1 class="header">Search Results</h1>
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
  data() {
    return {
      searchResults: []
    };
  },
  mounted: function(){
    this.getSearchResults(this.$route.query.q);
  },
  methods: {
    getSearchResults(queryText) {

      let queryParams = '';
      if (queryText) {
        queryParams += '/?name=' + queryText;
      }
      Axios.get('/arch-component/'.concat(queryParams)).then((response) => {
        console.log(response.data);
        this.searchResults = response.data;
      });
      ///?name=mantra
      //return this.$store.state.archComponent.archComponentCache;
    },
    createArchComponent(createProps) {
      this.$store.dispatch('archComponent/createArchComponent',createProps);
    },
    updateArchComponent(updateProps) {
      this.$store.dispatch('archComponent/updateArchComponent',updateProps);
    },
    deleteArchComponent(deleteProps) {
      this.$store.dispatch('archComponent/deleteArchComponent',deleteProps);
    }
  },
  watch: {
    '$route': function (to, from) {
      this.getSearchResults(to.query.q);
    }
  }
}
</script>
