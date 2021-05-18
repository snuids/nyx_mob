<template>
  <q-list separator class="q-pa-none">
    <OrderItem
      v-for="(item, idx) in products"
      :key="componentKey + idx"
      :product="item"
      :value="value"
      @remb="addProductToPreparedItems"
      @manq="addProductToPreparedItems"
      @success="addProductToPreparedItems"
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
      componentKey: 0,
      value: 0
    }
  },
  components: { OrderItem },
  methods: {
    addProductToPreparedItems(product) {
      this.componentKey += 1
      if (this.included(this.preparedProducts, product)) {
        this.update(this.preparedProducts, product)
      } else {
        this.value += 1
        this.preparedProducts.push(product)
        this.$store.commit(
          'mvpPrep/mutate_preparedItems',
          this.preparedProducts
        )
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
