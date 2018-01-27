<template>
  <div class="ui list">
    <div v-for="archComponent in archComponents" class="item">
      <div class="content">
        <div class="header">
          <router-link :to="{name: 'arch-component-view', params: {componentId: archComponent._id}}">
            {{archComponent.componentName}}
          </router-link>
        </div>
        <div class="description">
          {{archComponent.componentType}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from 'axios';

export default {
  props: ['archComponents'],
}
</script>
