<template>
  <q-page>
    <div class="flex flex-center column" v-if="orders">
      <div class="text-h6 q-pa-xl">
        {{ ordersToDisplay.length }} commandes
        <div class="float-right">
          <q-toggle
            :label="filterHasFrais"
            color="green"
            false-value="Pas de Frais"
            true-value="Frais"
            v-model="filterHasFrais"
            toggle-order="tf"
            @click="ordersToDisplay"
          ></q-toggle>
          <q-toggle
            :label="filterHasSec"
            color="green"
            false-value="Pas de Sec"
            true-value="Sec"
            v-model="filterHasSec"
            toggle-order="tf"
            @click="ordersToDisplay"
          ></q-toggle>
        </div>
      </div>
      <div
        class="row justify-between q-mt-sm"
        style="min-height: 400px; width: 80%; padding: 24px;"
      >
        <OrdersList :orders="ordersToDisplay" />
      </div>
    </div>
    <q-page-sticky expand position="top">
      <StickyBanner></StickyBanner>
    </q-page-sticky>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-page>
</template>

<script>
import StickyBanner from './MvpPicking/StickyBanner'
import OrdersList from './mvpPrepOrders/OrdersList'
import { mapState } from 'vuex'

export default {
  components: {
    OrdersList,
    StickyBanner
  },

  name: 'MvpPrepOrders',

  data() {
    return {
      products: [],
      filterHasSec: 'Sec',
      filterHasFrais: 'Frais',
      //indiceOrders: 'dev_shopify_order',
      indiceOrders: 'mvp_app_order'
      //indiceProducts: 'dev_shopify_line_item'
    }
  },

  computed: {
    ...mapState('mvpPrep', ['orders']),
    targetDate: function() {
      return this.$store.getters['mvp/targetDate']
    },
    ordersToDisplay: function() {
      let orderList
      if (
        this.filterHasSec === 'Pas de Sec' &&
        this.filterHasFrais === 'Pas de Frais'
      ) {
        this.$store.commit('mvpPrep/mutate_lockDry', false)
        this.$store.commit('mvpPrep/mutate_lockFresh', false)
        orderList = this.orders.filter(
          order => !order._source.has_sec && !order._source.has_frais
        )
      } else if (
        this.filterHasFrais === 'Frais' &&
        this.filterHasSec === 'Sec'
      ) {
        this.$store.commit('mvpPrep/mutate_lockDry', false)
        this.$store.commit('mvpPrep/mutate_lockFresh', false)
        orderList = this.orders.filter(
          order => order._source.has_sec || order._source.has_frais
        )
      } else if (
        this.filterHasSec === 'Sec' &&
        this.filterHasFrais === 'Pas de Frais'
      ) {
        this.$store.commit('mvpPrep/mutate_lockDry', true)
        orderList = this.orders.filter(order => order._source.has_sec)
      } else if (
        this.filterHasFrais === 'Frais' &&
        this.filterHasSec === 'Pas de Sec'
      ) {
        this.$store.commit('mvpPrep/mutate_lockFresh', true)
        orderList = this.orders.filter(order => order._source.has_frais)
      }
      return orderList
    }
  },

  watch: {
    targetDate: {
      handler: async function() {
        await this.$store.dispatch('mvpPrep/getOrders')
      },
      deep: true
    },
    filterHasSec(newFilter) {
      localStorage.filterHasSec = newFilter
    },
    filterHasFrais: function(newFilter) {
      localStorage.filterHasFrais = newFilter
    }
  },

  async created() {
    await this.$store.dispatch('mvpPrep/getOrders')
  },

  mounted() {
    if (localStorage.filterHasSec) {
      this.filterHasSec = localStorage.filterHasSec
    }
    if (localStorage.filterHasFrais) {
      this.filterHasFrais = localStorage.filterHasFrais
    }
    const timer = this.$store.getters['mvp/timer'] * 1000
    this.interval = setInterval(
      async function() {
        await this.$store.dispatch('mvpPrep/getOrders')
      }.bind(this),
      timer
    )
  },

  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style>
li {
  list-style-type: none;
}

ul {
  padding-left: 0;
}
</style>
