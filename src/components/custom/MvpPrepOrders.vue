<template>
  <q-page>
    <div v-if="urlOrderId">
      <ShowOrder :orderId="urlOrderId"></ShowOrder>
    </div>
    <div v-else-if="urlOrderList">
      <div style="min-height: 400px; padding-top: 160px;">
        <OrdersList :ordersToShow="ordersToDisplay" />
      </div>
      <q-page-sticky expand position="top" class="bg-blue-grey-1 q-pt-md">
        <div class="row full-width flex items-center q-px-lg">
          <div class="col-4 justify-start items-center">
            <q-btn
              @click="goBackToDashboard"
              icon="arrow_back_ios"
              size="md"
              class="bg-dark text-white"
              unelevated
              round
            />
          </div>
          <div class="row col-8 justify-end items-center">
            <ItemsFilter />
          </div>
          <div
            class="row col-8 justify-start items-center q-mt-md text-h6 text-dark"
          >
            {{ ordersToDisplay.length }} commandes
          </div>
          <div class="row col-4 justify-end text-h6 text-dark q-mt-md">
            {{ userName }}
          </div>
        </div>
        <StickyBanner
          class="row full-width items-center q-pa-none"
          style="height: 50px"
        ></StickyBanner>
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
import mixin from './mvpPrepOrders/mixin'

export default {
  // TODO prendre en compte dans le listing la tournée des livreurs

  name: 'MvpPrepOrders',
  mixins: [mixin],
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
    ...mapState('mvpPrep', ['orders', 'openFinishedOrders']),
    urlOrderId() {
      // console.log(this.$route.fullPath)
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
      if (this.openFinishedOrders) {
        return orderList.filter(
          elt =>
            elt._source.prep_status === 'finished' ||
            elt._source.prep_status === 'finishedWithRemb' ||
            elt._source.prep_status === 'finishedWithReplaced'
        )
      }
      return orderList
    }
  },

  watch: {
    targetDate: {
      handler: function() {
        this.$store.dispatch('mvpPrep/getOrders').then(() => {
          // console.log(this.orders)
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
