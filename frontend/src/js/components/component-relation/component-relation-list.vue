<template>
  <div class="ui list">
    <component-relation-item
      v-for="componentRelation in componentRelations"
      v-bind:componentRelation="componentRelation" :key="componentRelation._id">
    </component-relation-item>
    <component-relation-new
      v-bind:componentId="componentId">
    </component-relation-new>
  </div>
</template>
<script>
import Axios from 'axios';
import componentRelationItem from './component-relation-item.vue';
import componentRelationNew from './component-relation-new.vue';

export default {
  props: ['componentRelations','componentId'],
  components: {
    componentRelationItem,
    componentRelationNew,
  },
  methods: {
    addComponentRelation() {

    },
  }
}


</script>
