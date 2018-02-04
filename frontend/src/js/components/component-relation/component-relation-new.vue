<template>
  <div class="ui item component-relation three column row">
    <div class="from ui input column">
      {{archComponentNameResolver(componentRelation.from)}}
    </div>
    <div class="relation ui input column">
      <simple-type-select
        v-bind:typeClassName="'relationtype'"
        v-bind:selected="componentRelation.relationType"
        ref="relationType" >
      </simple-type-select>
    </div>
    <div class="from ui input column">
      <input type="text" class="input" v-model="componentRelation.to" placeholder="Related Component"/>
    </div>
    <button class="ui primary button" v-on:click="createRelation">Create</button>
  </div>
</template>
<script>
import Axios from 'axios';
import simpleTypeSelect from '../simple-type/simple-type-select.vue';

export default {
  props: ['componentId','archComponentNameResolver'],
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
    createRelation() {
      this.componentRelation.relationType = this.$refs.relationType.value;
      this.$emit('component-relation-new',{
        relationData: this.componentRelation
      });
    },
  },
  watch: {
    componentId: function(to, from) {
      this.componentRelation.from = to;
    }
  }
}
</script>
