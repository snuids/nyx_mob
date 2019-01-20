
<template>
  <div>
    <div v-if="currentApps.apps[0].type=='form'">
      <Form :config="currentApps.apps[0]"></Form>
    </div>
    <div v-else>
      <component :config="currentApps.apps[0]" v-bind:is="currentApps.apps[0].config.controller" ></component>
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import form from "src/components/Form";
import freetext from "src/components/FreeText";

Vue.component("Form", form);
Vue.component("FreeText", freetext);


export default {
  data: () => ({ selectedTab: "TAB-0" }),
  computed: {
    currentApps() {
      return this.$store.getters.currentApps;
    }
  },
  methods: {
    handleTabClick: function(tab) {
      
    }
  },
  mounted: function() {
    console.log("===============  REGISTERING APP CHANGED:");
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
