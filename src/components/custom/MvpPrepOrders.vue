<template>
  <q-page>
    <div class="row full-width flex flex-center column" v-if="orders">
      <div
        class="row col-xs-12 justify-between q-mt-sm q-pa-xl"
        style="min-height: 400px; padding-top: 130px"
      >
        <OrdersList :orders="ordersToDisplay" />
      </div>
    </div>
    <q-page-sticky expand position="top">
      <div class="row full-width flex bg-blue-grey-2 items-center">
        <div
          class="row col-xs-6 justify-center  text-h6 items-center "
          style="height: 50px"
        >
          {{ userName }}
        </div>
        <div class="row col-xs-6  justify-center text-h6 ">
          {{ ordersToDisplay.length }} commandes
          <div class="float-right">
            <ItemsFilter />
          </div>
        </div>
        <StickyBanner
          class="row items-center"
          style="height: 50px"
        ></StickyBanner>
      </div>
    </q-page-sticky>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-page>
</template>

<script>
import StickyBanner from './MvpPicking/StickyBanner'
import OrdersList from './mvpPrepOrders/OrdersList'
import ItemsFilter from './mvpPrepOrders/ItemsFilter'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'MvpPrepOrders',

  components: {
    OrdersList,
    StickyBanner,
    ItemsFilter
  },

  data() {
    return {
      products: [],
      //indiceOrders: 'dev_shopify_order',
      indiceOrders: 'mvp_app_order'
      //indiceProducts: 'dev_shopify_line_item'
    }
  },

  computed: {
    ...mapGetters(['creds']),
    ...mapState('mvpPrep', ['orders']),

    modeFilter: {
      get() {
        return this.$store.getters['mvpPrep/modeFilter']
      },
      set(newMode) {
        this.$store.commit('mvpPrep/mutate_modeFilter', newMode)
      }
    },
    userName() {
      return this.creds.user.firstname
    },
    targetDate: function() {
      return this.$store.getters['mvp/targetDate']
    },
    ordersToDisplay: function() {
      let orderList
      if (this.modeFilter === 'all') {
        this.$store.commit('mvpPrep/mutate_lockDry', false)
        this.$store.commit('mvpPrep/mutate_lockFresh', false)
        orderList = this.orders.filter(
          order => order._source.has_sec || order._source.has_frais
        )
      } else if (this.modeFilter === 'dry') {
        this.$store.commit('mvpPrep/mutate_lockDry', true)
        orderList = this.orders.filter(order => order._source.has_sec)
      } else if (this.modeFilter === 'fresh') {
        this.$store.commit('mvpPrep/mutate_lockFresh', true)
        orderList = this.orders.filter(order => order._source.has_frais)
      }
      return orderList
    }
  },

  watch: {
    targetDate: {
      handler: function() {
        this.$store.dispatch('mvpPrep/getOrders').then(() => {
          console.log(this.orders)
        })
      },
      deep: true
    }

    /*
    filterHasSec(newFilter) {
      localStorage.filterHasSec = newFilter
    },
    filterHasFrais: function(newFilter) {
      localStorage.filterHasFrais = newFilter
    }

     */
  },

  async created() {
    await this.$store.dispatch('mvpPrep/getOrders')
  },

  async mounted() {
    if (localStorage.filterHasSec) {
      this.filterHasSec = localStorage.filterHasSec
    }
    if (localStorage.filterHasFrais) {
      this.filterHasFrais = localStorage.filterHasFrais
    }

    if (localStorage.modeFilter) {
      this.modeFilter = localStorage.modeFilter
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
