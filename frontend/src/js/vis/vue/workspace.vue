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
    <svg viewBox="0 0 500 500" id="workbench" >
    </svg>
  </div>
</template>
<script>
import CalypearDiagram from '../components/calypear-diagram.js';
import VisWorkspace from '../components/vis-workspace.js';
import * as d3 from 'd3';

export default {

  // data() {
  //   return {
  //     calypearDiagram: new CalypearDiagram()
  //   }
  // },
  mounted(){
    this.visWorkbench = new VisWorkspace(),
    this.diagram = new CalypearDiagram(),
    this.visWorkbench.svg = d3.select('#workbench');
    console.log(this.visWorkbench.svg);
    this.diagram.addComponentsById([
      '0c731fbe-c83d-422a-93cd-25d7823e51db',
      '7359539a-e204-4529-9f75-394fdd40026f'
    ]).then((d) => {
        this.visWorkbench.init(this.diagram.nodes,this.diagram.links);
    });
    //this.visWorkbench.init(this.diagram.nodes,this.diagram.links);
    window.diagram = this.diagram;
    window.workbench = this.visWorkbench;
    //console.log(this.diagram.nodes,this.diagram.links)
    //console.log(d3);
  },
  methods: {

  }
}
</script>
