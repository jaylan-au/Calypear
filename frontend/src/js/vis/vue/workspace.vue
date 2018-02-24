<template>
  <div>
    <div id="workbench-nav" class="">
      <div class="ui menu">
        <div class="ui item">
          <a href="/app"><i class="angle double left large icon"></i></a>
        </div>
        <div class="ui item">
          <!-- <form v-on:submit="componentSearch"> -->
            <div class="ui icon input">
              <input type="text" placeholder="Search...." v-model="componentSearchText"/>
              <i class="search link icon" v-on:click="componentSearch"></i>
            </div>
          <!-- </form> -->
        </div>
      </div>
      <component-list
        v-show="showComponentList"
        v-bind:components="componentsToDisplay"
        v-on:vis-add-component="addComponentToDiagram">
      </component-list>
    </div>
    <svg viewBox="0 0 600 600" id="workbench" v-on:click="workspaceClick">
    </svg>
    <div class="ui menu" id="workbench-tools">
      <div class="ui item">
        <i class="expand arrows alternate small link icon" v-on:click="expandNodes"></i>
      </div>
      <div class="ui item">
        <i class="trash small link icon" v-on:click="deleteNodes"></i>
      </div>
      <div class="ui item">
        <i class="map pin small link icon" v-on:click="pinNodes"></i>
      </div>
      <div class="ui item">
        <i class="cubes small link icon" v-on:click="expandAllNodes"></i>
      </div>
      <div class="ui item">
        <i class="cogs small link icon"></i>
      </div>

    </div>
  </div>
</template>
<script>
import CalypearDiagram from '../components/calypear-diagram.js';
import VisWorkspace from '../components/vis-workspace.js';
import Axios from 'axios';
import * as d3 from 'd3';

import componentList from './component-list.vue';

export default {
  components: {
    componentList
  },
  data() {
    return {
      showComponentList: false,
      componentSearchText: '',
      searchResults: [],
      visWorkbench: {},
      diagram: {},
    }
  },
  computed: {
    componentsToDisplay() {
      return this.searchResults;
    },
    selectedComponentIds() {
      return this.visWorkbench.selectedNodes;
    }
  },
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
    expandNodes(){
      let selectedItems = this.visWorkbench.selectedNodes;
      this.diagram.addRelatedComponents(selectedItems).then((d) => {
        this.visWorkbench.update(this.diagram.nodes,this.diagram.links);
        this.visWorkbench.clearSelectedNodes();
      });
    },
    expandAllNodes(){

      this.diagram.addAllRelatedComponents().then((d) => {
        this.visWorkbench.update(this.diagram.nodes,this.diagram.links);
        this.visWorkbench.clearSelectedNodes();
      });
    },
    deleteNodes(){
      let selectedItems = this.visWorkbench.selectedNodes;
      this.diagram.removeComponentsById(selectedItems).then((d) => {
        this.visWorkbench.update(this.diagram.nodes,this.diagram.links);
        this.visWorkbench.clearSelectedNodes();
      });
    },
    pinNodes(){
      let selectedItems = this.visWorkbench.selectedNodes;
      this.diagram.pinNodesById(selectedItems);
      this.visWorkbench.update(this.diagram.nodes,this.diagram.links);
    },
    workspaceClick(){
      console.log('workspace click');
      //Clear Selected Nodes
      this.visWorkbench.clearSelectedNodes();
      console.log(this.visWorkbench.selectedNodes);
    },
    addComponentToDiagram(value){
      this.diagram.addComponentsById(value).then((d) => {
        this.visWorkbench.update(this.diagram.nodes,this.diagram.links);
      });
    },
    componentSearch(){
      //PiT Copy
      const searchText = this.componentSearchText;
      console.log('Search for %s start',searchText);
      Axios.get('/arch-component/?componentName='.concat(searchText)).then((response) => {
        this.searchResults = response.data;
        this.showComponentList = true;
      });
    }
  },
  watch: {
    'selectedComponentIds': function(to,from) {
      if (to.length > 0) {
        this.searchResults = this.diagram.components.filter((currItem) => {
          return (to.includes(currItem._id));
        })
        // Axios.get('/arch-component/'.concat(to[0])).then((response) => {
        //   this.searchResults = [response.data];
           this.showComponentList = true;
        // });
      } else {
        this.searchResults = []
        this.showComponentList = false;
      }

      //TODO: handle multiple items
    }
  }
}
</script>
