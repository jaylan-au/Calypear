<template>
  <div class="ui list">
    <div v-for="archComponent in archComponents" class="item">
      <div class="content">
        <div class="header">
          <router-link :to="{name: 'arch-component-view', params: {componentId: archComponent._id}}">
            {{archComponent.componentName}}
          </router-link>
        </div>
        <div class="meta">
          {{typeNameByTypeId('componenttype',archComponent.componentType)}}
        </div>
        <div class="description">
          {{archComponent.description}}
        </div>
        <div class="extra">
          <a v-on:click="deleteArchComponent(archComponent._id)">Delete</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from 'axios';

export default {
  props: ['archComponents'],
  methods: {
    typeNameByTypeId(typeClassName,id) {
      let typeData = this.$store.getters.typeByID(typeClassName,id);
      if (typeData) {
        return typeData.typeName;
      }
      return '';
    },
    deleteArchComponent(id) {
      this.$emit('arch-component-delete',{id:id});
    }

  }
}
</script>
