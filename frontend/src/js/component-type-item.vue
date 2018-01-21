<template>
  <div class="item">
  <i class="large github middle aligned icon" v-show="!isEditing"></i>
    <div class="content" v-show="!isEditing">
      <div class="header">{{ componentType.typeName }}</div>
      <div class="description">
        id: {{ componentType._id }} <a href="#" v-on:click="showForm">Edit</a> <a href="#" v-on:click="deleteComponentType(componentType._id)">Delete</a>
      </div>
    </div>
    <div class="content" v-show="isEditing">
      <form class="ui form">
        <input type="hidden" ref="_id" :value="componentType._id" />
        <div class="field">
          <input placeholder="Type name...." :value="componentType.typeName" ref="typeName"/>
        </div>
        <button class="ui primary button" v-on:click="saveForm">Save</button>
        <button class="ui button" v-on:click="cancelForm">Cancel</button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: ['componentType'],
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
      this.$emit('update-component-type', {
        _id: this.$refs._id.value,
        typeName: this.$refs.typeName.value,
      })
      this.isEditing = false;
    },
    cancelForm() {
      this.isEditing = false;
    },
    deleteComponentType(componentTypeId) {
      this.$emit('delete-component-type', componentTypeId);
    }
  },

}
</script>
