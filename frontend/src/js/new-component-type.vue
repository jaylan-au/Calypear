<template>
  <div class="item" >
    <div class="content" v-show="!isCreating">
      <button class="ui primary button" v-on:click="showForm">Add</button>
    </div>
    <div class="content" v-show="isCreating">
      <div class="ui form">
        <div class="field">
          <input placeholder="Type name...." v-model="componentType.typeName"/>
        </div>
        <button class="ui primary button" v-on:click="createComponentType">Save</button>
        <button class="ui button" v-on:click="cancelCreate">Cancel</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCreating: false,
      componentType: {
        typeName: '',
      }
    };
  },
  methods: {
    showForm() {
      this.isCreating = true;
    },
    cancelCreate() {
      this.isCreating = false;
    },
    createComponentType() {
      const typeName = this.componentType.typeName;
      console.log('t:',typeName);
      this.$emit('create-component-type',{
        typeName
      });
      this.componentType.typeName = '';
      this.isCreating = false;
    }
  },

}
</script>
