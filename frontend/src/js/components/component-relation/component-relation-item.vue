<template>
  <div class="ui item component-relation ui four column row">
    <div class="from column">
        {{archComponentNameResolver(componentRelation.from)}}
    </div>
    <div class="relation column">
        {{typeNameResolver('relationtype',componentRelation.relationType,componentRelation.inverse)}}
    </div>
    <div class="from column">
        {{archComponentNameResolver(componentRelation.to)}}
    </div>
    <div class="actions column">
      <a v-on:click="deleteComponentRelation">
        <span class="trash icon"></span>
        Delete
      </a>
    </div>
  </div>
</template>
<script>
import Axios from 'axios';

export default {
  props: ['componentRelation','componentId','archComponentNameResolver','typeNameResolver'],
  methods: {
    deleteComponentRelation(){
      this.$emit('component-relation-delete',this.componentRelation.transaction);
    }
  }
}


</script>
