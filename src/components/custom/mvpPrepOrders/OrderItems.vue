<template>
  <q-list bordered separator>
    <OrderItem
      v-for="(produit, idx) in products"
      :key="idx"
      :product="produit"
      @remb="rembourser"
      @manq="manquant"
      @success="success"
      class="q-pa-md"
    >
    </OrderItem>
  </q-list>
</template>

<script>
import OrderItem from './OrderItem'

export default {
  name: 'OrderItems',
  props: ['products'],
  components: { OrderItem },
  methods: {
    rembourser(product) {
      console.log(product)
    },
    manquant(product) {
      console.log(product)
    },
    success(product) {
      console.log(product)
    }
  }
}
</script>

<style scoped></style>
