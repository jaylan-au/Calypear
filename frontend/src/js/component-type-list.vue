<template>
  <div>
    <div class="ui section">
      <div class="ui middle aligned selection list ">
        <component-type-item
          v-for="componentType in componentTypes"
          v-bind:componentType="componentType"
          :key="componentType._id"
          v-on:delete-component-type="deleteComponentType"
          v-on:update-component-type="updateComponentType" >
        </component-type-item>
        <new-component-type
          v-on:create-component-type="createComponentType" >
        </new-component-type>
      </div>
    </div>
  </div>
</template>
<script>

import componentTypeItem from './component-type-item.vue';
import newComponentType from './new-component-type.vue';

export default {
  components: {
    componentTypeItem,
    newComponentType,
  },
  created: function() {
    this.loadComponentTypes();
  },
  computed: {
    componentTypes() {
      return this.$store.state.componentTypes;
    }
  },
  methods: {
    loadComponentTypes(){
      this.$store.dispatch('loadComponentTypes');
    },
    deleteComponentType(componentTypeId) {
      this.$store.dispatch('deleteComponentType',componentTypeId);
    },
    createComponentType(componentType) {
      this.$store.dispatch('createComponentType',componentType);
    },
    updateComponentType(componentType) {
      this.$store.dispatch('updateComponentType',componentType);
    }
  }
}
</script>
