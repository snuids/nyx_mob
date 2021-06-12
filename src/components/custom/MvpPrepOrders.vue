<template>
  <q-page>
    <div v-if="urlOrderId">
      <ShowOrder :orderId="urlOrderId"></ShowOrder>
    </div>
    <div v-else-if="urlOrderList">
      <div
        class=" flex flex-center"
        style="min-height: 400px; padding-top: 185px;"
      >
        <OrdersList />
      </div>
      <q-page-sticky expand position="top">
        <div class="row full-width flex items-center bg-blue-grey-1" style="">
          <div class="row col-xs-5 col-md-3 justify-center">
            <q-btn
              @click="goBackToDashboard"
              icon="arrow_back_ios"
              style="margin-right: 60px; background-color: dimgrey; color: white"
              size="15px"
              unelevated
              round
            />
          </div>
          <div
            class="row col-md-3 col-xs-6 justify-center text-h6"
            style="height: 50px"
          >
            {{ userName }}
          </div>
          <div
            class="row col-md-3 col-xs-6 justify-center text-h6"
            style="height: 50px"
          >
            {{ ordersToDisplay.length }} commandes
          </div>
          <div
            class="row col-md-3 col-xs-6 justify-center"
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
    <div v-else style="padding-top: 100px">
      <OrdersDashboard />
    </div>
  </q-page>
</template>

<script>
import StickyBanner from './MvpPicking/StickyBanner'
import ShowOrder from './mvpPrepOrders/ShowOrder'
import OrdersList from './mvpPrepOrders/OrdersList'
import ItemsFilter from './mvpPrepOrders/ItemsFilter'
import { mapState, mapGetters } from 'vuex'
import OrdersDashboard from './mvpPrepOrders/OrdersDashboard'

export default {
  name: 'MvpPrepOrders',

  components: {
    OrdersDashboard,
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

    urlOrderList() {
      let url = this.$route.fullPath
      if (url.indexOf('ordersList') > -1) {
        return true
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
  methods: {
    goBackToDashboard() {
      let query = Object.assign({}, this.$route.query)
      delete query.path
      this.$router.replace({ query })
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
