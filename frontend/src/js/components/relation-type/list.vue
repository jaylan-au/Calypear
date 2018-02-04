<template>
  <div>
    <div class="ui section">
      <div class="ui middle aligned selection list ">
        <relation-type-item
          v-for="relationType in relationTypes"
          v-bind:relationType="relationType"
          :key="relationType._id"
          v-on:delete-relation-type="deleteRelationType"
          v-on:update-relation-type="updateRelationType" >
        </relation-type-item>
        <relation-type-new
          v-on:create-relation-type="createRelationType" >
        </relation-type-new>
      </div>
    </div>
  </div>
</template>
<script>

import relationTypeItem from './item.vue';
import relationTypeNew from './new.vue';

export default {
  components: {
    relationTypeItem,
    relationTypeNew,
  },
  state: {
  },
  created: function() {
  },
  computed: {
    relationTypes: function(){
      return this.$store.state.relationType.relationTypeCache;
    }
  },
  methods: {
    createRelationType(createProps) {
      this.$store.dispatch('relationType/createRelationType',createProps);
    },
    updateRelationType(updateProps) {
      this.$store.dispatch('relationType/updateRelationType',updateProps);
    },
    deleteRelationType(deleteProps) {
      this.$store.dispatch('relationType/deleteRelationType',deleteProps);
    }
  },
  watch: {
  },
}
</script>
