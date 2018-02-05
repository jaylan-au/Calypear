<template>
  <div class="item" >
    <div class="content" v-show="!isCreating">
      <button class="ui primary button" v-on:click="showForm">Add</button>
    </div>
    <div class="content" v-show="isCreating">
      <div class="ui form">
        <div class="field">
          <input placeholder="Type name...." v-model="simpleTypeData.typeName"/>
        </div>
        <button class="ui primary button" v-on:click="createSimpleType">Save</button>
        <button class="ui button" v-on:click="cancelCreate">Cancel</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['typeClassName'],
  data() {
    return {
      isCreating: false,
      simpleTypeData: {
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
    createSimpleType() {
      const typeName = this.simpleTypeData.typeName;
      console.log('t:',typeName);
      this.$emit('create-simple-type',{
        typeClassName: this.typeClassName,
        typeName: typeName
      });
      this.simpleTypeData.typeName = '';
      this.isCreating = false;
    }
  },

}
</script>
