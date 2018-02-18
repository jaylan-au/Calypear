import Vue from 'vue';

//import CalypearDiagram from './components/calypear-diagram.js';

//var calypearDiagram = new CalypearDiagram();
//Expose the object
//window.calypearDiagram = calypearDiagram;
import visWorkspace from './vue/workspace.vue';

const app = new Vue({
  el: '#vueapp',
  components: {
    visWorkspace
  },
  created: function() {

  }
});
