<template>
  <div class="ui items">
    <div class="header">
      {{component.componentName}}
    </div>
    <div class="meta">
      {{component.componentType}} <i class="add link icon" v-on:click="addComponentToDiagram"></i>
    </div>
    <div class="content">
      {{component.description}}
    </div>
    <div class="extra">
      <a href="#">View Details</a>
    </div>
  </div>
</template>
<script>
export default {
  props: ['component'],
  methods: {
    addComponentToDiagram() {
      this.$emit('vis-add-component',this.component._id);
    }
  }
}
</script>
