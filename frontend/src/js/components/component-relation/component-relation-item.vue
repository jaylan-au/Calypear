<template>
  <div class="ui item component-relation">
    <div class="from">
        {{componentRelation.from}}
    </div>
    <div class="relation">
        {{componentRelation.relation}}
    </div>
    <div class="from">
        {{componentRelation.to}}
    </div>
  </div>
</template>
<script>
import Axios from 'axios';

export default {
  props: ['componentRelation','componentId'],
  methods: {
    typeNameByTypeId(typeClassName,id) {
      let typeData = this.$store.getters.typeByID(typeClassName,id);
      if (typeData) {
        return typeData.typeName;
      }
      return '';
    },
  }
}


</script>
