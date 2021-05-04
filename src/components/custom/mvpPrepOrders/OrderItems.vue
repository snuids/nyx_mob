<template>
  <q-list bordered separator>
    <OrderItem
      v-for="(produit, idx) in products"
      :key="componentKey + idx"
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
      status: null,
      componentKey: 0
    }
  },
  components: { OrderItem },
  methods: {
    rembourser(product) {
      this.componentKey += 1
      if (this.included(this.preparedProducts, product)) {
        this.update(this.preparedProducts, product)
      } else {
        this.preparedProducts.push(product)
      }
    },
    manquant(product) {
      this.componentKey += 1
      if (this.included(this.preparedProducts, product)) {
        this.update(this.preparedProducts, product)
      } else {
        this.preparedProducts.push(product)
      }
    },
    success(product) {
      this.componentKey += 1
      if (this.included(this.preparedProducts, product)) {
        this.update(this.preparedProducts, product)
      } else {
        this.preparedProducts.push(product)
      }
    },
    update(products, product) {
      const eltIdx = products.findIndex(elt => elt._id === product._id)
      let newProductsArray = [...products]
      newProductsArray[eltIdx] = {
        ...product
      }
      this.$store.commit('mvpPrep/mutate_preparedItems', newProductsArray)
    },
    included: function(products, product) {
      for (let p in products) {
        if (products[p]._id === product._id) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style scoped></style>
