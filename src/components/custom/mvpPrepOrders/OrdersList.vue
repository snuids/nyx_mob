<template>
  <q-pull-to-refresh @refresh="refresh">
    <q-list class="flex row">
      <OrderCard
        v-for="(order, idx) in ordersToShow.sort((a, b) => {
          return a._id - b._id
        })"
        :order="order"
        :key="idx"
      />
    </q-list>
  </q-pull-to-refresh>
</template>

<script>
import OrderCard from './OrderCard'
import { mapState } from 'vuex'
export default {
  name: 'OrdersList',
  props: ['ordersToShow'],
  data() {
    return {
      interval: null
    }
  },
  computed: {
    ...mapState('mvpPrep', ['modeFilter', 'openFinishedOrders'])
  },
  components: { OrderCard },
  methods: {
    refresh(done) {
      console.log('starting getting orders')
      this.$store.dispatch('mvpPrep/getOrders')
      done()
      console.log('finishing getting orders')
    }
  },
  mounted() {
    const timer = this.$store.getters['mvp/timer'] * 1000
    setTimeout(() => {
      this.$store.dispatch('mvpPrep/getOrders')
      this.interval = setInterval(
        async function() {
          await this.$store.dispatch('mvpPrep/getOrders')
        }.bind(this),
        timer
      )
    }, 500)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped></style>
