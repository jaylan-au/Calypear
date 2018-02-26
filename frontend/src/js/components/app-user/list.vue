<template>
  <div class="ui relaxed divided list">
    <app-user-item v-for="appUser in appUsers" v-bind:key="appUser._id" v-bind:appUser="appUser">
    </app-user-item>
  </div>
</template>
<script>
import appUserItem from './item.vue';
import appUserNew from './new.vue';

export default {
  props: ['appUsers'],
  components: {
    appUserItem
  }
}
</script>
