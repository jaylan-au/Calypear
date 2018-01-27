<template>
  <div class="ui segement">
    <div class="header">Search Results</div>
    <arch-component-list v-bind:archComponents="searchResults"></arch-component-list>
  </div>
</template>
<script>
import Axios from 'axios';
import archComponentList from '../components/arch-component/arch-component-list.vue';

export default {
  components: {
    archComponentList
  },
  data(){
    return {
      searchResults: []
    }
  },
  created: function(){
    //just load the full list for now
    Axios.get('/arch-component').then((response) => {
      this.searchResults = response.data;
    }).catch((err) => {
      //FIXME: Handle this?
    })
  }
}
</script>
