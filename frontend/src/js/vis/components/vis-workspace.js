import * as d3 from 'd3';

import CalypearDiagram from './calypear-diagram.js';

export default class VisWorkspace {
  constructor(options) {
    this._svg = null;
    this._diagram = new CalypearDiagram();
    this._width = 600;
    this._height = 600;
    this._selectedNodes = [];
  }

  set diagram(diagram) {
    this._diagram = diagram;
  }

  get diagram() {
    return this._diagram;
  }

  set svg(svg) {
    this._svg = svg;
    return this;
  }

  get svg() {
    return this._svg;
  }

  set width(width) {
    this._width = width;
  }

  get width() {
    return this._width;
  }

  set height(height) {
    this._height = height;
  }

  get height() {
    return this._height;
  }

  get connectorPathGenerator() {
    return d3.line().curve(d3.curveBasis);
  }

  set selectedNodes(selectedNodes){
    this._selectedNodes = selectedNodes;
  }

  get selectedNodes() {
    return this._selectedNodes;
  }

  nodeIsSelected(id) {
    return (this._selectedNodes.indexOf(id) > -1);
  }

  clearSelectedNodes(){
    this.selectedNodes = [];
    d3.selectAll(".diagram-node").classed('selected',false);
  }

  toggleNodeSelected(id) {
    if (this.nodeIsSelected(id)) {
      this.deselectNode(id)
    } else {
      this.selectNode(id);
    }

    console.log(this._selectedNodes);
  }

  selectNode(id) {
    if (!this.nodeIsSelected()) {
      this._selectedNodes.push(id);
    }
    d3.selectAll("#node"+id).classed('selected',true);
  }

  deselectNode(id) {
    let elementId = this._selectedNodes.indexOf(id);
    if (elementId > -1 ) {
      console.log('Deleting index %s',elementId);
      this._selectedNodes.splice(elementId,1);
      d3.selectAll("#node"+id).classed('selected',false);
    }

  }

  init(graphNodes,graphLinks) {
    let svgWorkspace = this._svg;

    this._linkGroup = svgWorkspace.append("g")
        .attr("class", "link-group");
    this._linkElements = this._linkGroup.selectAll(".diagram-link");

    this._nodeGroup = svgWorkspace.append("g")
        .attr("class", "node-group");
    this._nodeElements = this._nodeGroup.selectAll(".diagram-node");

    this._simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d._id; }))
      .force("charge", d3.forceManyBody().strength( function(){ return -60;}))
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .force("collide", d3.forceCollide(10).radius(function(d){
          return 5;
          //return calculateNodeCollideRadius(d)*1.2; //Add a bit for padding
      }).strength(0.5))
      .on("tick",function(){
        this.simulationTick();
      }.bind(this));
      // .on("tick",function(){
      //   //console.log(this);
      //   //workspace.simulationTick(workspace, this);
      // }.bind({workspace: this}));

    this.update(graphNodes,graphLinks);

  }

  update(graphNodes, graphLinks) {
    let simulation = this._simulation;
    let svgWorkspace = this._svg;
    let nodeElementsDataMerge = this._nodeGroup.selectAll(".diagram-node")
      .data(graphNodes,function(d) {return d._id;});

    let linkElementsDataMerge = this._linkGroup.selectAll(".diagram-link")
      .data(graphLinks,function(d) {return d._id;});

    nodeElementsDataMerge.exit().remove();

    let nodeEnter = nodeElementsDataMerge.enter()
      .append("g")
      .attr("class","diagram-node")
      .on("click",function(d){
        this.nodeClicked(d);
        d3.event.stopPropagation();
      }.bind(this))
      .attr("id",function(d) {return "node"+d._id;})
      .call(d3.drag()
          .on("start", function(d) {
            this.nodeDragStarted(d);
          }.bind(this))
          .on("drag", function(d) {
            this.nodeDragged(d);
          }.bind(this))
          .on("end", function(d) {
            this.nodeDragEnded(d);
          }.bind(this))
        )
      .append("circle")
        .attr("cx",0)
        .attr("cy",0)
        .attr("r",function(d) {
          console.log('rendered');
          return 5;
        });

    linkElementsDataMerge.exit().remove();

    let linkEnter = linkElementsDataMerge.enter()
      .append("path")
      .attr("class","diagram-link")
      .attr("stroke-width", 1)
      .attr("id",function(d) {return "link"+d._id;});

    simulation.nodes(graphNodes);

    simulation.force("link")
       .links(graphLinks)
       .distance(function(link){return 200});

    this._nodeElements = this._nodeGroup.selectAll(".diagram-node");
    this._linkElements = this._linkGroup.selectAll(".diagram-link");

    simulation.alpha(1).restart();
    //setTimeout(function(){ simulation.stop(); }, 3000);

  }

  nodeDragStarted(d) {
    if (!d3.event.active) this._simulation.alphaTarget(0.3).restart();
    d.putAt(d.x,d.y);
    // d.fx = d.x;
    // d.fy = d.y;
  }

  nodeDragged(d) {
    var grid = 10;
    // Don't lock to the grid until we actually start dragging a bit
    if ((Math.abs(d.x-d3.event.x) > 5) || (Math.abs(d.y-d3.event.y) > 5)) {
      //Force items to land on a squared off grid - to avoid finicky positioning
      d.putAt(Math.round(d3.event.x/grid)*grid,Math.round(d3.event.y/grid)*grid);
      // d.fx = ;
      // d.fy = ;
    }

  }

  nodeDragEnded(d) {
    if (!d3.event.active) {
      this._simulation.alphaTarget(0)
      //If the Shift key is held down then lock the node in position
      //Touching the node again will free it
      //Need to resolve this.
      if (!d.isPinned) {
        d.putRelease();
        // d.fx = null;
        // d.fy = null
      }
    };

  }

  nodeClicked(d) {

    this.toggleNodeSelected(d._id);
  }


  simulationTick(){
    let connectorGenerator = this.connectorPathGenerator;
    this._linkElements.attr("d",function(d) {
        var offsetSource = 0; //calculateNodeBlockSize(d.source);
        var offsetTarget = 0; //calculateNodeBlockSize(d.target)
        var points = [
          [d.source.x,d.source.y],
          [d.target.x,d.target.y]
        ];
        return connectorGenerator(points);
      });

    //console.log(this._nodeElements);
    this._nodeElements.attr("transform", function(d) {
        return "translate(" + (d.x) + "," + (d.y) + ")";
      });
  }
}
