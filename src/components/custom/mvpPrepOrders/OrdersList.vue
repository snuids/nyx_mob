<template>
  <div
    id="parent"
    class="fit row wrap justify-start items-start content-start"
    style="overflow: hidden;"
  >
    <p v-if="orders.length === 0">
      Pas de commandes ce jour ci
    </p>

    <div
      v-for="(order, idx) in orders"
      :key="idx"
      class="q-ma-md      bg-blue-grey-2"
      style="overflow: auto;"
    >
      <OrderCard :order="order" :products="products" />
    </div>
  </div>
</template>

<script>
import OrderCard from './OrderCard'
export default {
  name: 'OrdersList',
  components: { OrderCard },
  props: ['orders', 'products']
}
</script>

<style scoped></style>
