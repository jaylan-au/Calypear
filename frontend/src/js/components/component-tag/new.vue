<template>
  <div class="ui item component-tag three column row">
    <form class="ui form">
      <div class="relation ui input column">
        <simple-type-select
          v-bind:typeClassName="'tagtype'"
          v-bind:selected="componentTag.tagType"
          ref="tagType" >
        </simple-type-select>
      </div>
      <div class="from ui input column">
        <div class="field">
          <label>Value</label>
          <input placeholder="Tag value" type="text" v-model="componentTag.value">
        </div>
      </div>
      <div class="column">
        <button class="ui primary button" v-on:click="createComponentTag">Create</button>
      </div>
    </form>
  </div>
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
