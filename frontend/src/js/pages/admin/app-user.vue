<template>
  <div class="ui segement">
    <h1 class="header">Users</h1>
    <div class="ui relaxed list">
      <app-user-item
        v-for="appUser in appUsers"
        v-bind:key="appUser._id"
        v-bind:appUser="appUser"
        v-on:app-user-delete="appUserDelete"
        v-on:app-user-update="appUserUpdate">
      </app-user-item>
    </div>
    <app-user-new
      v-on:app-user-create="appUserCreate">
    </app-user-new>
  </div>
</template>
<script>
import appUserItem from '../../components/app-user/item.vue';
import appUserNew from '../../components/app-user/new.vue';

import Axios from 'axios';

export default {
  components: {
    appUserItem,
    appUserNew
  },
  data() {
    return {
      appUsers: [],
    };
  },
  mounted() {
    this.reloadAppUsers();
  },
  methods: {
    reloadAppUsers(){
      Axios.get('/admin/app-user').then((dbresponse) => {
        this.appUsers = dbresponse.data;
      });
    },
    appUserCreate(payload) {
      const newUser = Object.assign({},payload);
      console.log(newUser);
      Axios.post('/admin/app-user',newUser).then((dbresponse) => {
        // this.appUsers.push(dbresponse.data);
        // console.log(dbresponse.data);
        this.reloadAppUsers();
      }).catch((err) => {
        console.log(err);
      })
    },
    appUserDelete(payload) {
      Axios.delete('/admin/app-user/'.concat(payload)).then((dbresponse)=> {
        this.reloadAppUsers();
      }).catch((err)=> {
        console.log(err);
      });
    },
    appUserUpdate(payload) {

    }
  }
}
</script>
