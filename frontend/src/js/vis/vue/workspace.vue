<template>
  <div>
    <div id="workbench-nav" class="">
      <div class="ui menu">
        <div class="ui item">
          <i class="sidebar large icon"></i>
        </div>
        <div class="ui item">
          <div class="ui icon input">
            <input type="text" placeholder="Search...."/>
            <i class="search icon"></i>
          </div>
        </div>
      </div>
    </div>
    <svg viewBox="0 0 1000 1000" id="workbench" >
      <g class="nodes"></g>
      <g class="links"></g>
    </svg>
  </div>
</template>
<script>
import CalypearDiagram from '../components/calypear-diagram.js';

export default {
  data() {
    return {
      calypearDiagram: new CalypearDiagram()
    }
  },
  computed: {
    nodes() {
      return calypearDiagram.nodes;
    },
    links() {
      return calypearDiagram.links;
    }
  },
  methods: {

  }
}
</script>
