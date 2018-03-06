<template>
  <tr>
    <td>
        {{typeNameResolver('tagtype',componentTag.tagType)}}
    </td>
    <td>
        {{componentTag.value}}
    </td>
    <td>
      <a href="#" v-on:click="deleteComponentTag">
        <i class="trash link icon"></i>
        Delete
      </a>
    </td>
  </tr>
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
