<template>
  <div class="item" >
    <div class="content" v-show="!isCreating">
      <button class="ui primary button" v-on:click="showForm">Add</button>
    </div>
    <div class="content" v-show="isCreating">
      <div class="ui form">
        <div class="field">
          <input placeholder="Type name...." v-model="relationType.typeName"/>
        </div>
        <div class="field">
          <input placeholder="Type name Inverse...." v-model="relationType.typeNameInverse"/>
        </div>
        <button class="ui primary button" v-on:click="createRelationType">Save</button>
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
      relationType: {
        typeName: '',
        typeNameInverse: '',
      }
    };
  },
  methods: {
    showForm() {
      this.isCreating = true;
    },
    cancelCreate() {
      this.isCreating = false;
      this.relationType.typeName = '';
      this.relationType.typeNameInverse = '';
    },
    createRelationType() {
      //Shallow copy
      let createdRelationType = Object.assign({},this.relationType);
      this.$emit('create-relation-type',{
        relationType: createdRelationType,
      });
      this.relationType.typeName = '';
      this.relationType.typeNameInverse = '';
      this.isCreating = false;
    }
  },

}
</script>
