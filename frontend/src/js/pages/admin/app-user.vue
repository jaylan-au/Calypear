<template>
  <div class="ui segement">
    <h1 class="header">Users</h1>
    <app-user-list
     :appUsers="appUsers">
    </app-user-list>
    <app-user-new
      v-on:app-user-create="createUser">
    </app-user-new>
  </div>
</template>
<script>
import appUserList from '../../components/app-user/list.vue';
import appUserNew from '../../components/app-user/new.vue';

import Axios from 'axios';

export default {
  components: {
    appUserList,
    appUserNew
  },
  data() {
    return {
      appUsers: [],
    };
  },
  created() {
    Axios.get('/admin/app-user').then((dbresponse) => {
      this.appUsers = dbresponse.data;
    });
  },
  methods: {
    createUser(payload) {
      const newUser = Object.assign({},payload);
      console.log(newUser);
      Axios.post('/admin/app-user',newUser).then((dbresponse) => {
        this.appUsers.push(dbresponse.data);
        console.log(dbresponse.data);
      }).catch((err) => {
        console.log(err);
      })

    }
  }
}
</script>
