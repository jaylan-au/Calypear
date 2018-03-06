<template>
  <div>
    <h1 class="header">New Component</h1>
    <arch-component-new
      v-on:arch-component-created="createdArchComponent">
    </arch-component-new>
  </div>
</template>
<script>
import archComponentNew from '../components/arch-component/new.vue';

export default {
  components: {
    archComponentNew
  },
  methods:{
    createdArchComponent(createProps) {
      this.$store.dispatch('archComponent/createdArchComponent',createProps);
    },
  }
}
</script>
