<template>
  <div class="ui item" >
    <div class="content" >
      <form class="ui form">
        <div class="field">
          <label>Component Name</label>
          <input name="component-name" placeholder="Component Name" type="text" v-model="archComponent.componentName">
        </div>
        <div class="field">
          <label>Component Type</label>
          <simple-type-select
            v-bind:typeClassName="'componenttype'"
            :selected="archComponent.componentType"
            ref="componentType" >
          </simple-type-select>
        </div>
        <button class="ui primary button" type="submit" v-on:click="createArchComponent">Create</button>
      </form>
    </div>
  </div>
</template>
<script>
import Axios from 'axios';
import simpleTypeSelect  from '../simple-type/simple-type-select.vue';

export default {
  components: {
    simpleTypeSelect
  },
  data(){
    return {
      archComponent: {
        componentName: '',
        componentType: '',
      },
    }
  },
  methods: {
    createArchComponent(){
      let createProps = Object.assign({},this.archComponent);
      createProps.componentType = this.$refs.componentType.value;
      this.$emit('arch-component-create',createProps);
    },
  },
}
</script>
