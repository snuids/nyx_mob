<template>
  <q-page class="flex bg-grey-5 row">
   Prep Orders again
  </q-page>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'MvpPrepOrders',
  components: {
  },
  data() {
    return {
      orders: []
    }
  },
  methods: {
    getOrders() {
      this.orders = [
        {
          'orderNumber': 12863,
          'status': 'jhesgfjhd'
        },
        {
          'orderNumber': 12863,
          'status': 'jhesgfjhd'
        },
        {
          'orderNumber': 12863,
          'status': 'jhesgfjhd'
        },
        {
          'orderNumber': 12863,
          'status': 'jhesgfjhd'
        },
        {
          'orderNumber': 12863,
          'status': 'jhesgfjhd'
        },
        {
          'orderNumber': 12863,
          'status': 'jhesgfjhd'
        },
      ]
    },



    createCustomStore() {
      this.$store.registerModule('prepOrdersModule', {
        state: {

        },
        getters: {

        },
        mutations: {

        },
        actions: {

        }
      })
    },

  },
  beforeCreate() {

  },
  created() {

  },
  beforeMount() {},
  mounted() {
    console.log('mounted MvpPrepOrders')
  },
  beforeDestroy() {

  },
  destroyed() {

  },
  computed: {}
}
</script>

<style></style>
