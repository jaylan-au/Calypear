<template>
  <div class="ui item component-relation">
    <div class="from ui input">
      <input type="text" v-model="componentRelation.from" placeholder=""/>
    </div>
    <div class="relation ui input">
      <simple-type-select
        v-bind:typeClassName="'relationtype'"
        v-bind:selected="componentRelation.relationType"
        ref="relationType" >
      </simple-type-select>
    </div>
    <div class="from ui input">
      <input type="text" class="input" v-model="componentRelation.to" placeholder="Related Component"/>
    </div>
    <button class="ui primary button" v-on:click="createRelation">Create</button>
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
      componentRelation: {
        from: this.componentId,
        relationType: '',
        to: '',
      }
    }
  },
  methods: {
    typeNameByTypeId(typeClassName,id) {
      let typeData = this.$store.getters.typeByID(typeClassName,id);
      if (typeData) {
        return typeData.typeName;
      }
      return '';
    },
    createRelation() {
      this.$emit('component-relation-new');
    }
  }
}
</script>
