<template>
  <div class="ui segments">
    <div class="ui segment">
      <h1 class="header">Component Title</h1>
      <div class="content">
        <div class="ui items">
          <div class="item">
            Alternative Names
          </div>
          <div class="item">
            Description
          </div>
          <div class="item">
            Alternative Names
          </div>
          <div class="item">
            Alternative Names
          </div>
        </div>
        <a>Edit</a>
      </div>
    </div>
    <div class="ui segment">
      <h2 class="header">Properties</h2>
      <div class="content">
        Component Properties
      </div>
    </div>
    <div class="ui segment">
      <h2 class="header">Relations</h2>
      <div class="content">
        Component Relations
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [],
  data() {
    return {
      archComponent: [],
      isEditing: false,
    };
  },
  methods: {
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
    }
  },
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
    console.log(this.$route.params);
    //Load the Arch component into the store
    //Axios.get('/archComponent')
  }
}
</script>
