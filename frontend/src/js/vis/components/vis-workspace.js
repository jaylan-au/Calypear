import * as d3 from 'd3';

import CalypearDiagram from './calypear-diagram.js';

export default class VisWorkspace {
  constructor(options) {
    this._svg = null;
    this._diagram = new CalypearDiagram();
    this._width = 1000;
    this._height = 1000;
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

  init(graphNodes,graphEdges) {
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

    this.update(graphNodes,graphEdges);

  }

  update(graphNodes, graphEdges) {
    let simulation = this._simulation;
    let svgWorkspace = this._svg;
    let nodeElementsDataMerge = this._nodeGroup.selectAll(".diagram-node")
      .data(graphNodes,function(d) {return d._id;});


    //nodeElements.exit().remove();

    let nodeEnter = nodeElementsDataMerge.enter()
      .append("g")
      .attr("class","diagram-node")

      // .on("click",function(d){
      //   nodeClicked(d);
      //   d3.event.stopPropagation();
      // })
      .attr("id",function(d) {return "node"+d._id;})
      .append("circle")
        .attr("cx",0)
        .attr("cy",0)
        .attr("r",function(d) {
          console.log('rendered');
          return 5;
        });
      // .call(d3.drag()
      //     .on("start", dragstarted)
      //     .on("drag", dragged)
      //     .on("end", dragended));
      console.log(graphNodes);
    simulation.nodes(graphNodes);

    simulation.force("link")
       .links(graphEdges)
       .distance(function(link){return 200});

    simulation.alpha(1).restart();
    //setTimeout(function(){ simulation.stop(); }, 3000);
    this._nodeElements = this._nodeGroup.selectAll(".diagram-node");
  }

  simulationTick(){
    // linkElements
    //   .attr("d",function(d) {
    //     var offsetSource = calculateNodeBlockSize(d.source);
    //     var offsetTarget = calculateNodeBlockSize(d.target)
    //     var points = [
    //       [d.source.x,d.source.y-(offsetSource.y/2)],
    //       [d.target.x,d.target.y-(offsetTarget.y/2)]
    //     ];
    //     return connectorGenerator(points);
    //   });

    //console.log(this._nodeElements);
    this._nodeElements.attr("transform", function(d) {
        return "translate(" + (d.x) + "," + (d.y) + ")";
      });
  }
}
