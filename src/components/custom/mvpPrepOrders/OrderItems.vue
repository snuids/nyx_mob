<template>
  <q-list class="q-pa-none">
    <OrderItem
      v-for="(item, idx) in this.displayedItems"
      :key="item._id + idx"
      :product="item"
      @remb="addProductToPreparedItems"
      @manq="addProductToPreparedItems"
      @success="addProductToPreparedItems"
    >
    </OrderItem>
  </q-list>
</template>

<script>
import OrderItem from './OrderItem'
import { mapState } from 'vuex'

export default {
  name: 'OrderItems',
  props: ['preparedProducts'],
  data() {
    return {
      componentKey: 0
    }
  },
  computed: {
    ...mapState('mvpPrep', ['displayedItems'])
  },
  components: { OrderItem },
  methods: {
    addProductToPreparedItems(product) {
      if (this.included(this.preparedProducts, product)) {
        this.update(this.preparedProducts, product)
      } else {
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
