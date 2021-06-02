<template>
  <q-page>
    <div v-if="urlOrderId">
      <ShowOrder :orderId="urlOrderId"></ShowOrder>
    </div>
    <div v-else>
      <div class="row full-width flex flex-center column">
        <div
          class="row col-xs-12 justify-between q-mt-sm q-pa-xl"
          style="min-height: 400px; padding-top: 130px"
        >
          <OrdersList />
        </div>
      </div>
      <q-page-sticky expand position="top">
        <div class="row full-width flex items-center bg-blue-grey-1" style="">
          <div
            class="row col-md-4 col-xs-12 justify-center text-h6  items-center "
            style="height: 50px"
          >
            {{ userName }}
          </div>
          <div
            class="row col-md-4 col-xs-6 justify-center text-h6"
            style="height: 50px"
          >
            {{ ordersToDisplay.length }} commandes
          </div>
          <div
            class="row col-md-4 col-xs-6 justify-center"
            style="margin-bottom: 15px"
          >
            <ItemsFilter />
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
    </div>
  </q-page>
</template>

<script>
import StickyBanner from './MvpPicking/StickyBanner'
import ShowOrder from './mvpPrepOrders/ShowOrder'
import OrdersList from './mvpPrepOrders/OrdersList'
import ItemsFilter from './mvpPrepOrders/ItemsFilter'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'MvpPrepOrders',

  components: {
    OrdersList,
    StickyBanner,
    ItemsFilter,
    ShowOrder
  },

  data() {
    return {
      products: [],
      indiceOrders: 'mvp_app_order'
    }
  },

  computed: {
    ...mapGetters(['creds']),
    ...mapState('mvpPrep', ['orders']),
    urlOrderId() {
      console.log(this.$route.fullPath)
      let url = this.$route.fullPath
      if (url.indexOf('showOrder=') > -1) {
        return url.split('showOrder=')[1]
      }
      return null
    },
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
  },

  async created() {
    await this.$store.dispatch('mvpPrep/getOrders')
  },

  async mounted() {
    if (localStorage.modeFilter) {
      this.modeFilter = localStorage.modeFilter
    }
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
