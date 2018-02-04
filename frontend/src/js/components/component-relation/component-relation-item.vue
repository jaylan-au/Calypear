<template>
  <div class="ui item component-relation ui three column row">
    <div class="from column">
        {{archComponentNameResolver(componentRelation.from)}}
    </div>
    <div class="relation column">
        {{typeNameResolver('relationtype',componentRelation.relationType)}}
    </div>
    <div class="from four column">
        {{archComponentNameResolver(componentRelation.to)}}
    </div>
  </div>
</template>
<script>
import Axios from 'axios';

export default {
  props: ['componentRelation','componentId','archComponentNameResolver','typeNameResolver'],
  methods: {
  }
}


</script>
