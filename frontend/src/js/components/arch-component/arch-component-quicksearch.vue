<template>
  <form v-on:submit="doSearch">
    <div class="ui icon input fluid">
      <input placeholder="Search..." type="text" ref="searchQuery" >
      <i class="search link icon" v-on:click="doSearch"></i>
    </div>
  </form>
</template>
<script>
export default {
  methods: {
    doSearch() {
      this.$router.push({ name: 'arch-component-search', query: { q:  this.$refs.searchQuery.value}})
    }
  }
}
</script>
