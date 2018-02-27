<template>
  <div class="ui item">
    <i class="large user middle aligned icon"></i>
    <div class="content" v-show="!isEditing">
      {{appUser.username}}
      <div class="extra">
        id: {{appUser._id}}
        <a class="item" v-on:click="deleteUser"><i class="trash link icon"></i> Delete</a>
        <a class="item" v-on:click="changePasswordAppUser">Change Password</a>
      </div>
    </div>
    <div class="content" v-show="isEditing">
      {{appUser.username}}
      <div class="ui form">
        <div class="field">
          <label>New Password</label>
          <input class="input" type="password" ref="newAuthentication" placeholder="New Password"/>
        </div>
      </div>
      <div class="extra">
        <a class="button" v-on:click="savePasswordChange">Save</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['appUser'],
  data(){
    return {
      isEditing: false,
    }
  },
  methods: {
    deleteUser() {
      this.$emit('app-user-delete',this.appUser._id);
    },
    changePasswordAppUser() {
      this.isEditing  = true;
    },
    savePasswordChange() {
      this.isEditing = false;
      console.log('t');
      this.$emit('app-user-update',this.appUser);
    }
  }
}
</script>
