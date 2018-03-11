<template>
  <table class="ui table">
    <tbody>
      <component-tag-item
        v-for="componentTag in componentTags"
        v-bind:componentTag="componentTag" :key="componentTag._id"
        :typeNameResolver="typeNameByTypeId"
        v-on:component-tag-delete="deleteComponentTag">
      </component-tag-item>
      <component-tag-new
        v-show="isUserLoggedIn"
        v-bind:componentId="componentId"
        v-on:component-tag-new="createComponentTag"
        :typeNameResolver="typeNameByTypeId">
      </component-tag-new>
    </tbody>
  </table>
</template>
<script>
import Axios from 'axios';
import componentTagItem from './item.vue';
import componentTagNew from './new.vue';

export default {
  props: ['componentId'],
  components: {
    componentTagItem,
    componentTagNew,
  },
  data() {
    return {
      componentTags: [],
    }
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    }
  },
  mounted() {
    this.fetchComponentTags(this.componentId);
  },
  methods: {
    createComponentTag(payload) {
      //console.log(payload);
      Axios.post('/component-tag/',payload.componentTag).then((results) => {
        this.fetchComponentTags(this.componentId);
      }).catch((err) => {
        //FIXME: handle this proeprly
        console.log(err);
      });
    },
    deleteComponentTag(componentTagId) {
      Axios.delete('/component-tag/'.concat(componentTagId)).then((results) => {
        this.fetchComponentTags(this.componentId);
      }).catch((err) => {
        //FIXME: handle this proeprly
        console.log(err);
      });
    },
    fetchComponentTags(componentId) {
      Axios.get('/component-tag/component/'.concat(componentId)).then((results) => {
        this.componentTags = results.data;
      }).catch((err) => {
        //FIXME: handle this
        console.log(err);
      })
    },
    typeNameByTypeId(typeClassName,id,isInverse = false) {
      let typeData = this.$store.getters.typeByID(typeClassName,id);
      if (typeData) {
        //Handle the special case for relation types
        return typeData.typeName;
      }
      return 'Unknown type:'+id;
    },
  },
  watch: {
    componentId: function(to, from) {
      this.fetchComponentTags(to);
    }
  }
}


</script>
