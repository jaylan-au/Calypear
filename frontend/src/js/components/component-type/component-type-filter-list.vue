<template>
  <div class="ui item">
    <div class="header">Component Types</div>
    <div class="menu">
      <div class="ui item" v-for="componentType in componentTypes">
        <router-link :to="{ name: 'arch-component-search', query: {type: componentType._id} }">{{componentType.typeName}}</router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    componentTypes: function(){
      return this.$store.state.simpleType.componenttype;
    }
  },
  created (){
    console.log(this.$store.state.simpleType.componenttype);
  },
  methods: {

  }
}
</script>
