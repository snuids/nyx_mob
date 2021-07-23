<template>
  <q-pull-to-refresh @refresh="refresh">
    <q-list class="flex row">
      <OrderCard
        v-for="(order, idx) in ordersSorted"
        :order="order"
        :key="idx"
        :id="order._id"
      />
    </q-list>
  </q-pull-to-refresh>
</template>

<script>
import OrderCard from './OrderCard'
import { mapState } from 'vuex'

// TODO trier order list by delivery hour

export default {
  name: 'OrdersList',

  props: ['ordersToShow'],

  data() {
    return {
      interval: null
    }
  },

  computed: {
    ...mapState('mvpPrep', [
      'modeFilter',
      'openFinishedOrders',
      'currentOrder',
      'scrollView'
    ]),
    ordersSorted() {
      let sortedOrders = this.ordersToShow
        .sort((a, b) => {
          return a._id - b._id
        })
        .sort((a, b) =>
          a._source.tags.split(',').includes(' express') &&
          !b._source.tags.split(',').includes(' express')
            ? -1
            : 1
        )
      if (this.modeFilter === 'fresh') {
        return sortedOrders.sort(
          (a, b) => a._source.courier_index - b._source.courier_index
        )
      }
      return sortedOrders
    }
  },

  components: { OrderCard },

  methods: {
    refresh(done) {
      this.$store.dispatch('mvpPrep/getOrders')
      done()
    },

    nextOrder(order) {
      let orderIndex = this.ordersSorted.findIndex(elt => elt._id === order._id)
      if (orderIndex < this.ordersSorted.length - 1) {
        return this.ordersSorted[orderIndex + 1]
      } else {
        return this.ordersSorted[0]
      }
    }
  },

  updated() {
    if (this.currentOrder !== null && this.scrollView) {
      let nextItem = this.nextOrder(this.currentOrder)
      let element = document.getElementById(`${nextItem._id}`)
      element.classList.add('highlight')
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      this.$store.commit('mvpPrep/mutate_scrollView', false)
      setTimeout(() => element.classList.remove('highlight'), 3000)
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

<style scoped>
.highlight {
  color: deepskyblue;
}
</style>
