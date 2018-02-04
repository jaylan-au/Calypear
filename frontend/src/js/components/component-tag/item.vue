<template>
  <div class="ui item component-tag three column row">
    <div class="tagType column">
        {{typeNameResolver('tagtype',componentTag.tagType)}}
    </div>
    <div class="tagValue column">
        {{componentTag.value}}
    </div>
    <div class="actions column">
      <a v-on:click="deleteComponentTag">
        <i class="trash icon"></i>
        Delete
      </a>
    </div>
  </div>
</template>
<script>
import Axios from 'axios';

export default {
  props: ['componentTag','componentId','archComponentNameResolver','typeNameResolver'],
  methods: {
    deleteComponentTag(){
      this.$emit('component-tag-delete',this.componentTag._id);
    }
  }
}


</script>
