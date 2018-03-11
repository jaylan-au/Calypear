<template>
  <div>
    <h1 class="header">Search Results</h1>
    <div v-show="(searchResults.length < 1)">
      No results found
    </div>
    <arch-component-list
      v-bind:archComponents="searchResults"
      v-on:arch-component-delete="deleteArchComponent">
    </arch-component-list>
  </div>
</template>
<script>
import Axios from 'axios';
import archComponentList from '../components/arch-component/arch-component-list.vue';

export default {
  components: {
    archComponentList,
  },
  data() {
    return {
      searchResults: []
    };
  },
  mounted: function(){
    this.getSearchResults(this.$route.query.q,this.$route.query.type);
  },
  methods: {
    getSearchResults(queryText,typeFilter) {

      let queryParams = '';
      if (queryText) {
        queryParams += '/?componentName=' + queryText;
      }

      if (typeFilter) {
        queryParams = '/?componentType=' + typeFilter;
      }


      Axios.get('/arch-component/'.concat(queryParams)).then((response) => {
        console.log(response.data);
        this.searchResults = response.data;
      });
      ///?name=mantra
      //return this.$store.state.archComponent.archComponentCache;
    },
    createdArchComponent(createProps) {
      this.$store.dispatch('archComponent/createdArchComponent',createProps);
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
      this.getSearchResults(to.query.q,to.query.type);
    }
  }
}
</script>
