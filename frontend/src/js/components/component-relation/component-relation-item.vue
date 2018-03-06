<template>
  <tr class="">
    <td>
        {{archComponentNameResolver(componentRelation.from)}}
    </td>
    <td>
        {{typeNameResolver('relationtype',componentRelation.relationType,componentRelation.inverse)}}
    </td>
    <td>
      <router-link :to="{name: 'arch-component-view', params: {componentId: componentRelation.to}}">
        {{archComponentNameResolver(componentRelation.to)}}
      </router-link>
    </td>
    <td>
      <a href="#" v-on:click="deleteComponentRelation">
        <i class="trash link icon"></i>
        Delete
      </a>
    </td>
  </tr>
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
