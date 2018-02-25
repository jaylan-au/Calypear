<template>
  <div class="ui segement">
    <h1 class="header">Users</h1>
    <div class="ui relaxed divided list">
      <div class="ui item" v-for="appUser in appUsers">
        <i class="large user middle aligned icon"></i>
        <div class="content">
          <div class="header">{{appUser.username}}</div>
        </div>

      </div>
      <div class="ui item">
        <form class="ui form">
          <div class="ui input fluid">
            <input type="text"/>
          </div>
          <div class="ui input fluid">
            <input type="password"/>
          </div>
            <input type="submit" class="ui submit primary button" value="Create"/>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from 'axios';
export default {
  components: {

  },
  data() {
    return {
      appUsers: []
    };
  },
  created() {
    Axios.get('/admin/app-user').then((dbresponse) => {
      this.appUsers = dbresponse.data;
    });
  },
  methods: {

  }
}
</script>
