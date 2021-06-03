<template>
  <div id="parent" class="row col-xs-12 q-col-gutter-md">
    <div
      v-for="(order, idx) in ordersToDisplay.sort((a, b) => {
        return a._id - b._id
      })"
      :key="idx"
    >
      <OrderCard :order="order" />
    </div>
  </div>
</template>

<script>
import OrderCard from './OrderCard'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'OrdersList',
  data() {
    return {
      interval: null
    }
  },
  computed: {
    ...mapState('mvpPrep', ['orders', 'modeFilter']),
    ordersToDisplay: function() {
      let orderList
      if (this.modeFilter === 'all') {
        // this.$store.commit('mvpPrep/mutate_lockDry', false)
        // this.$store.commit('mvpPrep/mutate_lockFresh', false)
        orderList = this.orders.filter(
          order => order._source.has_sec || order._source.has_frais
        )
      } else if (this.modeFilter === 'dry') {
        // this.$store.commit('mvpPrep/mutate_lockDry', true)
        orderList = this.orders.filter(order => order._source.has_sec)
      } else if (this.modeFilter === 'fresh') {
        // this.$store.commit('mvpPrep/mutate_lockFresh', true)
        orderList = this.orders.filter(order => order._source.has_frais)
      }
      return orderList
    }
  },
  components: { OrderCard },

  methods: {},
  mounted() {
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

<style scoped></style>
