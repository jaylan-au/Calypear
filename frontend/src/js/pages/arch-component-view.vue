<template>
  <div class="ui segment">
    <div class="ui segment">
      <div class="content">
        <h1 class="header" v-show="!isEditing">
          {{archComponent.componentName}}
        </h1>
        <h1 class="header" v-show="isEditing">
          <input v-bind:value="archComponent.componentName" placeholder="Component Name..." ref="componentName"/>
        </h1>
        <div class="ui items">
          <div class="item">
            <div class="content" v-show="!isEditing">
              {{ typeNameByTypeId('componenttype',archComponent.componentType) }}
            </div>
            <div class="content" v-show="isEditing">
              <simple-type-select
                v-bind:typeClassName="'componenttype'"
                :selected="archComponent.componentType"
                ref="componentType" >
              </simple-type-select>
            </div>
          </div>
          <div class="item">
            <div class="content" v-show="!isEditing">
              {{ archComponent.description }}
            </div>
          </div>
          <div class="item">
            <div class="content" v-show="isEditing">
                <textarea
                  placeholder="Component Description"
                  :value="archComponent.description"
                  ref="description" >
                </textarea>
              </div>
          </div>
        </div>
        <button class="ui primary button" v-show="!isEditing" v-on:click="showEditForm">Edit</button>
        <button class="ui primary button" v-show="isEditing" v-on:click="saveEditForm">Save</button>
      </div>
    </div>
    <div class="ui segment">
      <div class="content">
        <h1 class="header" >
          Relations
        </h1>
        <component-relation-list
          v-bind:componentRelations="archComponent.relations"
          v-bind:componentId="archComponent._id" >
        </component-relation-list>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from 'axios';
import simpleTypeSelect  from '../components/simple-type/simple-type-select.vue';
import componentRelationList from '../components/component-relation/component-relation-list.vue';

export default {
  props: ['componentId'],
  components: {
    simpleTypeSelect,
    componentRelationList,
  },
  data(){
    return {
      archComponent: {},
      componentRelations: [],
      componentTags: [],
      isEditing: false,
    }
  },
  created: function(){
    this.fetchArchComponent(this.componentId)
  },
  methods: {
    fetchArchComponent(componentId) {
      //Get the component's base details
      Axios.get('/arch-component/'.concat(componentId)).then((response) => {
        this.archComponent = response.data;
      }).catch((err) => {
        //FIXME: Handle this?
      })

      //TODO: lift this up into the API to get everything at once
      Axios.get('/component-relation/component/'.concat(componentId)).then((response) => {
        this.componentRelations = response.data;
      });

    },
    typeNameByTypeId(typeClassName,id) {
      let typeData = this.$store.getters.typeByID(typeClassName,id);
      if (typeData) {
        return typeData.typeName;
      }
      return '';
    },
    archComponentNameById(id) {
      let archComponentName = this.$store.getters.archComponentNameById(id);
      if (archComponentName) {
        return archComponentName;
      }
      return '';
    },
    showEditForm() {
      this.isEditing = true;
    },
    saveEditForm() {
      this.isEditing = false;

      let updateData = {
        componentName: this.$refs.componentName.value,
        componentType: this.$refs.componentType.value,
        description: this.$refs.description.value,
      };

      Axios.put('/arch-component/'.concat(this.archComponent._id),updateData).then((response) => {
        this.archComponent = response.data;
      }).catch((err) => {
        //FIXME: handle this
        console.log(err);
      })

      //console.log(this.$refs);
    },
    cancelEditForm() {
      this.isEditing = false;
    }
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      //this.componentId = componentId;
      this.fetchArchComponent(to.param.componentId)
    }
  },
}
</script>
