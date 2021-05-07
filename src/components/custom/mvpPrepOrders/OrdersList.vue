<template>
  <div id="parent" class="row q-col-gutter-md">
    <p v-if="orders.length === 0">
      Pas de commandes ce jour ci
    </p>

    <div v-for="(order, idx) in orders" :key="idx">
      <OrderCard
        @card="orderClicked(order)"
        :order="order"
        class="col-xs-12 col-md-6 flex"
      />
    </div>
  </div>
</template>

<script>
import OrderCard from './OrderCard'
export default {
  name: 'OrdersList',
  components: { OrderCard },
  computed: {
    orders() {
      return this.$store.state.mvpPrep.orders
    }
  },
  methods: {
    orderClicked(order) {
      console.log('this is the order from ordercard clicked')
      console.log(order)
    }
  }
}
</script>

<style scoped></style>
