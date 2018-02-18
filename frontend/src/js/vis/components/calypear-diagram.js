//import d3 from 'd3';
import Axios from 'axios';

import DiagramComponent from './calypear-diagram-component.js';

export default class CalypearDiagram {
  constructor(options){
    this._svg = null;
    this._components = [];
  }

  set svg(svg) {
    this._svg = svgElement;
    return this;
  }

  get svg() {
    return this._svg;
  }

  async fetchComponentData(componentId) {
    let filledComponent = await Promise.all([
      Axios.get('/arch-component/'.concat(componentId)).then((response) => {
        return response.data;
      }),
      Axios.get('/component-relation/component/'.concat(componentId)).then((response) => {
        return response.data;
      }),
      Axios.get('/component-tag/component/'.concat(componentId)).then((response) => {
        return response.data;
      }),
    ]).then((responses) => {
      let componentData = responses[0];
      componentData.relations = responses[1];
      componentData.tags = responses[2];
      return componentData;
    }).catch((err) => {
      throw new Error(err);
    });
    return filledComponent;
  }

  addComponentById(componentId){
    //TODO: If it already exists - don't add it
    //TODO: Consider updating it if it already exists
    this.fetchComponentData(componentId).then((componentData) => {
      let addComponent = new DiagramComponent(componentData);
      this._components.push(addComponent);
    }).catch((err) => {
      throw new Error(err);
    });

    return this;
  }

  get nodes() {
    return Array.from(this._components);
  }

  get links() {
    //TODO: Filter out inverse relations that don't have a partner if a direct relation exists
    return this._components.reduce((accumulator, currentItem) => {
      return accumulator.concat(currentItem.relations);
    },[]);
  }
}
