<template>
  <div class="ui segement">
    <h1 class="header">Login</h1>
    <div class="ui form">
      <div class="field">
        <label>Username</label>
        <input type="text" name="username" v-model="username"/>
      </div>
      <div class="field">
        <label>Password</label>
        <input type="password" name="password" v-model="password"/>
      </div>
      <button class="ui button" type="submit" v-on:click="login">Login</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    login() {
      let userAuth = {
        username : this.username,
        password: this.password
      }
      axios.post('/login/local',userAuth).then((response) => {
        //Response was ok forward back to the requestor
        // if (this.$route.query.forwardTo) {
        //   window.location = this.$route.query.forwardTo;
        // }
        // else {
        //this.$store.user
        //FIXME: this needs to be pulled from the server
        this.$store.commit('setCurrentUser',response.data)

        window.location = '/app';
        // }
      }).catch((err) => {
        console.log('Error',err);
      })
    }
  }
}
</script>
