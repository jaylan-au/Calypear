<template>
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
        console.log(response);
      }).catch((err) => {
        console.log('Error',err);
      })
    }
  }
}
</script>
