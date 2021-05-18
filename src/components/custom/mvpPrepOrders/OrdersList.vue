<template>
  <div id="parent" class="row q-col-gutter-md">
    <div
      v-for="(order, idx) in orders.sort((a, b) => {
        return a._id - b._id
      })"
      :key="idx"
    >
      <OrderCard @card="orderClicked(order)" :order="order" />
    </div>
  </div>
</template>

<script>
import OrderCard from './OrderCard'
export default {
  name: 'OrdersList',
  components: { OrderCard },
  props: ['orders'],
  methods: {
    orderClicked(order) {
      console.log('this is the order from ordercard clicked')
      console.log(order)
    }
  }
}
</script>

<style scoped></style>
