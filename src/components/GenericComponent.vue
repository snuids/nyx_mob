
<template>

<div>
  WELCOME

  <!--<component v-bind:is="app.config.controller"></component>-->
</div>
</template>


<script>
import Vue from "vue";


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
