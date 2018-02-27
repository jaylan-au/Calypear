<template>
  <div class="ui item">
    <i class="large user middle aligned icon"></i>
    <div class="content">
      {{appUser.username}}
      <div class="extra">
        id: {{appUser._id}}
        <a class="item" v-on:click="deleteUser"><i class="trash link icon"></i> Delete</a>
        <a class="item" v-on:click="changePasswordAppUser">Change Password</a>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props: ['appUser'],
  methods: {
    deleteUser() {
      this.$emit('app-user-delete',this.appUser._id);
    },
    changePasswordAppUser() {
      this.$emit('app-user-update',this.appUser);
    }
  }
}
</script>
