<template>
  <form class="form">
    <div class="field">
      <label>Component Name</label>
      <input name="component-name" placeholder="Component Name" type="text" v-model="archComponent.componentName">
    </div>
    <div class="field">
      <label>Component Type</label>
      <select v-model="archComponent.componentType">
        <option disabled value="">Please select one</option>
        <option v-for="option in options" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
    <button class="ui primary button" type="submit">Create</button>
    <button class="ui button" type="submit">Cancel</button>
  </form>
</template>
<script>
import Axios from 'axios';

export default {
  data(){
    return {
      archComponent: {
        componentName: '',
        componentType: '',
      },
      isEditing: false,
    }
  },
  created: function(){
    this.fetchArchComponent();
  },
  methods: {
    fetchArchComponent() {
      //FIXME: Fetch this from the store - to centralize the logic
      Axios.get('/arch-component/'.concat(this.componentId)).then((response) => {
        this.archComponent = response.data;
      }).catch((err) => {
        //FIXME: HAndle this somehow
      });
    }
  },
  watch: {
    '$route' (to, from) {
      // this.componentId will have been reset by the route
      //Fetch the new arch component
      this.fetchArchComponent();
    }
  },
}
</script>
