<template>
  <div>
    <component-list-item v-for="component in components"
    :key="component._id"
    v-bind:component="component"
    v-on:vis-add-component="addComponentToDiagram">
    </component-list-item>
  </div>
</template>
<script>
import componentListItem from './component-list-item.vue';
export default {
  props: ['components'],
  components: {
    componentListItem
  },
  methods: {
    addComponentToDiagram(payload) {
      //Propagate the event up
      this.$emit('vis-add-component',payload);
    }
  }
}
</script>
