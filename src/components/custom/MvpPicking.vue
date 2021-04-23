<template>
  <q-page class="flex bg-grey-5 row">
    <q-resize-observer @resize="onResize" debounce="500" />
    <div v-if="!isPurchaseOrderDisplayed" class="bg-grey-2 full-width">
      <PurchaseOrdersList />
    </div>
    <div v-else class="bg-grey-2  full-width">
      <PurchaseOrderDisplay />
    </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import PurchaseOrdersList from 'components/custom/MvpPicking/PurchaseOrdersList.vue'
import PurchaseOrderDisplay from 'components/custom/MvpPicking/PurchaseOrderDisplay.vue'

Vue.component('PurchaseOrdersList', PurchaseOrdersList)
Vue.component('PurchaseOrderDisplay', PurchaseOrderDisplay)

export default {
  name: 'MvpPicking',
  components: {
    PurchaseOrdersList,
    PurchaseOrderDisplay
  },
  data() {
    return {
      leftDrawerOpen: false,
      isPurchaseOrderDisplayed: false,
      marker: false
    }
  },
  methods: {
    addEventListener() {
      this.$root.$on('displayOrderEvent', event => {
        this.displayOrderEvent(event)
      })
      this.$root.$on('displayListEvent', event => {
        this.displayListEvent(event)
      })
    },
    removeEventListener() {
      this.$root.$off('displayOrderEvent')
      this.$root.$off('displayListEvent')
    },
    displayOrderEvent(event) {
      this.$store.commit('mvp/mutate_currentOrder', {
        order: {
          meta: {
            id: event.id,
            index: event.index
          }
        }
      })
      this.isPurchaseOrderDisplayed = true
    },
    displayListEvent(event) {
      this.$store.commit('mvp/mutate_currentOrder', {
        order: {
          meta: {
            id: '',
            index: ''
          }
        }
      })
      this.isPurchaseOrderDisplayed = false
    },
    onResize(size) {
      var o = {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        appHeight: size.height,
        appWidth: size.width
      }
      this.$store.commit('mvp/mutate_screenSize', {
        data: o
      })
    }
  },
  beforeCreate() {
    if (this.$q.platform.is.mobile) {
      this.$q.fullscreen
        .request()
        .then(() => {})
        .catch(err => {})
    }
  },
  created() {
    this.addEventListener()
  },
  beforeMount() {},
  mounted() {},
  beforeDestroy() {
    this.removeEventListener()
    // this.$store.unregisterModule('pickingModule')
  },
  destroyed() {
    if (this.$q.platform.is.mobile) {
      this.$q.fullscreen
        .exit()
        .then(() => {})
        .catch(err => {})
    }
  },
  computed: {}
}
</script>

<style></style>
