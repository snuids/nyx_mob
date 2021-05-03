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
  props: ['products', 'preparedProducts'],
  data() {
    return {
      status: null
    }
  },
  components: { OrderItem },
  methods: {
    rembourser(product) {
      status = 'remb'
      this.preparedProducts.push(product)
      //console.log(product)
    },
    manquant(product) {
      status = 'manq'
      product._source.prep_status = status
      this.preparedProducts.push(product)
      //console.log(product)
    },
    success(product) {
      status = 'success'
      product._source.prep_status = status
      this.preparedProducts.push(product)
      //console.log(product)
    }
  }
}
</script>

<style scoped></style>
