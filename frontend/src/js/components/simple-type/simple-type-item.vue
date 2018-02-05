<template>
  <div class="item">
  <i class="large github middle aligned icon" v-show="!isEditing"></i>
    <div class="content" v-show="!isEditing">
      <div class="header">{{ simpleTypeData.typeName }}</div>
      <div class="description">
        id: {{ simpleTypeData._id }} <a v-on:click="showForm">Edit</a> <a v-on:click="deleteSimpleType(simpleTypeData._id)">Delete</a>
      </div>
    </div>
    <div class="content" v-show="isEditing">
      <form class="ui form">
        <input type="hidden" ref="_id" :value="simpleTypeData._id" />
        <div class="field">
          <input placeholder="Type name...." :value="simpleTypeData.typeName" ref="typeName"/>
        </div>
        <button class="ui primary button" v-on:click="saveForm">Save</button>
        <button class="ui button" v-on:click="cancelForm">Cancel</button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: ['typeClassName','simpleTypeData'],
  data() {
    return {
      isEditing: false,
    };
  },
  methods: {
    showForm() {
      this.isEditing = true;
    },
    saveForm() {
      this.$emit('update-simple-type', {
        typeClassName: this.typeClassName,
        data: {
          _id: this.$refs._id.value,
          typeName: this.$refs.typeName.value,
        }
      })
      this.isEditing = false;
    },
    cancelForm() {
      this.isEditing = false;
    },
    deleteSimpleType(simpleTypeId) {
      this.$emit('delete-simple-type', {
        typeClassName: this.typeClassName,
        id: simpleTypeId
      });
    }
  },

}
</script>
