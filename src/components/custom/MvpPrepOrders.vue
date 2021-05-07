<template>
  <q-page>
    <div class="flex flex-center column" v-if="orders">
      <div
        class="row justify-between q-mt-sm"
        style="min-height: 400px; width: 80%; padding: 24px;"
      >
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
        <OrdersList :orders="ordersToDisplay" />
      </div>
    </div>
    <q-page-sticky expand position="top">
      <StickyBanner></StickyBanner>
    </q-page-sticky>
    <router-view></router-view>
  </q-page>
</template>

<script>
import StickyBanner from './MvpPicking/StickyBanner'
import OrdersList from './mvpPrepOrders/OrdersList'

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
    orders() {
      return this.$store.state.mvpPrep.orders
    },
    targetDate: function() {
      return this.$store.getters['mvp/targetDate']
    },
    ordersToDisplay: function() {
      let orderList
      if (this.filterHasFrais === 'Pas de Frais') {
        orderList = this.orders.filter(order => !order._source.has_frais)
        if (this.filterHasSec === 'Pas de Sec') {
          orderList = orderList.filter(order => !order._source.has_sec)
        }
      } else if (this.filterHasSec === 'Pas de Sec') {
        orderList = this.orders.filter(order => !order._source.has_sec)
      } else if (
        this.filterHasFrais === 'Frais' &&
        this.filterHasSec === 'Sec'
      ) {
        orderList = this.orders.filter(
          order => order._source.has_sec || order._source.has_frais
        )
      }
      return orderList
    }
  },

  watch: {
    targetDate: {
      handler: async function() {
        this.$q.loading.show()
        await this.$store.dispatch('mvpPrep/getOrders')
        this.$q.loading.hide()
      },
      deep: true
    }
  },

  async created() {
    this.$q.loading.show()
    await this.$store.dispatch('mvpPrep/getOrders')
    this.$q.loading.hide()
  },

  mounted() {
    const timer = this.$store.getters['mvp/timer'] * 1000
    this.interval = setInterval(
      async function() {
        this.$q.loading.show()
        await this.$store.dispatch('mvpPrep/getOrders')
        this.$q.loading.hide()
        //this.getOrders()
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
