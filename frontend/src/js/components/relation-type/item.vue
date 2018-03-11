<template>
  <div class="item">
  <i class="large github middle aligned icon" v-show="!isEditing"></i>
    <div class="content" v-show="!isEditing">
      <div class="header">{{ relationType.typeName }} / {{relationType.typeNameInverse}}</div>
      <div class="description">
        id: {{ relationType._id }} <a v-show="isUserLoggedIn" v-on:click="showForm">Edit</a> <a v-show="isUserLoggedIn" v-on:click="deleteRelationType(relationType._id)">Delete</a>
      </div>
    </div>
    <div class="content" v-show="isEditing">
      <form class="ui form">
        <input type="hidden" ref="_id" :value="relationType._id" />
        <div class="field">
          <input placeholder="Type name...." :value="relationType.typeName" ref="typeName"/>
        </div>
        <div class="field">
          <input placeholder="Type name...." :value="relationType.typeNameInverse" ref="typeNameInverse"/>
        </div>
        <button class="ui primary button" v-on:click="saveForm">Save</button>
        <button class="ui button" v-on:click="cancelForm">Cancel</button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: ['relationType'],
  data() {
    return {
      isEditing: false,
    };
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    }
  },
  methods: {
    showForm() {
      this.isEditing = true;
    },
    saveForm() {
      this.$emit('update-relation-type', {
        relationType: {
          _id: this.$refs._id.value,
          typeName: this.$refs.typeName.value,
          typeNameInverse: this.$refs.typeNameInverse.value
        }
      })
      this.isEditing = false;
    },
    cancelForm() {
      this.isEditing = false;
    },
    deleteRelationType(id) {
      this.$emit('delete-relation-type', {
        id: id
      });
    }
  },

}
</script>
