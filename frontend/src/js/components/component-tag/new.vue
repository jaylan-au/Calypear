<template>
  <tr>
      <td>
        <simple-type-select
          v-bind:typeClassName="'tagtype'"
          v-bind:selected="componentTag.tagType"
          ref="tagType" >
        </simple-type-select>
      </td>
      <td>
        <div class="ui input field">
          <label>Value</label>
          <input placeholder="Tag value" type="text" v-model="componentTag.value">
        </div>
      </td>
      <td>
        <button class="ui primary button" v-on:click="createComponentTag">Create</button>
      </td>
  </tr>
</template>
<script>
import Axios from 'axios';
import simpleTypeSelect from '../simple-type/simple-type-select.vue';

export default {
  props: ['componentId'],
  components: {
    simpleTypeSelect,
  },
  data() {
    return {
      componentTag: {
        component: this.componentId,
        tagType: '',
        value: '',
      }
    }
  },
  methods: {
    createComponentTag() {
      this.componentTag.tagType = this.$refs.tagType.value;
      this.$emit('component-tag-new',{
        componentTag: this.componentTag
      });
    },
  },
  watch: {
    componentId: function(to, from) {
      this.componentTag.component = to;
    }
  }
}
</script>
