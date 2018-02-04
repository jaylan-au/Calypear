<template>
  <div class="ui item component-relation three column row">
    <form class="ui form">
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
        <arch-component-select
          v-bind:selected="componentRelation.to"
          ref="toArchComponent" >
        </arch-component-select>
      </div>
      <button class="ui primary button" v-on:click="createRelation">Create</button>
    </form>
  </div>
</template>
<script>
import Axios from 'axios';
import simpleTypeSelect from '../simple-type/simple-type-select.vue';
import archComponentSelect from '../arch-component/arch-component-select.vue';

export default {
  props: ['componentId','archComponentNameResolver'],
  components: {
    simpleTypeSelect,
    archComponentSelect,
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
      this.componentRelation.to = this.$refs.toArchComponent.value;
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
