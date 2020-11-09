
<template>
  <div>
    <div v-if="activeApp.type=='form'">
      <Form :config="activeApp"></Form>
    </div>
    <div v-else>
      <!-- <component :config="currentApps.apps[0]" v-bind:is="currentApps.apps[0].config.controller" ></component> -->
      <component :config="activeApp" v-bind:is="activeApp.config.controller" ></component>
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import form from "src/components/Form";
import freetext from "src/components/FreeText";

Vue.component("Form", form);
Vue.component("FreeText", freetext);


const req = require.context('./custom/', true, /\.vue$/)

const dynamicComponents = {}
req.keys().forEach(filename => {
  const name = `${filename.split('.')[1].split('/')[filename.split('.')[1].split('/').length - 1]}`
  const component = req(filename).default
  console.log(name)
  dynamicComponents[name] = component

})



export default {
  data: () => ({ 
    selectedTab: "TAB-0",
    loading: false,
  }),
  components: {
    ...dynamicComponents
  },
  watch: {
    $route(to, from) {
      console.log('WATCHER ROUTE GENERIC COMPONENT')
      if(from.params.recid === to.params.recid) {
        console.log('Same recid, no need to change app')
        return
      }

      console.log('from')
      console.log(from)
      console.log('to')
      console.log(to)

      this.loading=true
      
//      this.selectedTab=this.$route.params.recid

      this.$store.commit({
        type: "changeApp",
        data: this.$route.params.recid
      });

      this.$nextTick(() => this.loading=false);
    }
  },
  computed: {
    activeApp() {
      return this.$store.getters.activeApp;
    },
    currentApps() {
      return this.$store.getters.currentApps;
    }
  },
  methods: {
    handleTabClick: function(tab) {
      
    }
  },
  mounted: function() {
    
  },
  destroyed: function() {

  },
  updated: function() {
    console.log("**********  Updated:");
  }
};
</script>

<style>

</style>
