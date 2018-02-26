<template>
  <div class="ui item">
    <div class="ui form" >
      <div class="field fluid">
        <label>Username</label>
        <input name="username" placeholder="Username..." type="text" v-model="newUser.username">
      </div>
      <div class="field fluid">
        <label>Password</label>
        <input name="username" placeholder="Password..." type="password" v-model="newUser.authentication">
      </div>
        <input type="submit" class="ui submit primary button" value="Create" v-on:click="createUser"/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      newUser: {
        username: '',
        authentication: ''
      }
    }
  },
  methods: {
    createUser() {
      this.$emit('app-user-create',this.newUser);
    }
  }
}
</script>
