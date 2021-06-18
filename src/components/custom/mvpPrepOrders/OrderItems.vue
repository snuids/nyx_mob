<template>
  <q-list class="q-pa-none" style="padding-bottom: 85px" separator>
    <OrderItem
      v-for="(item, idx) in sortedItemsList"
      :key="item._id + idx"
      :product="item"
      @prep="addProductToPreparedItems"
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
    ...mapState('mvpPrep', [
      'displayedItems',
      'currentOrderItems',
      'modeFilter'
    ]),

    sortedItemsList: function() {
      return this.currentOrderItems.filter(element => {
        if (this.modeFilter === 'fresh') {
          return element._source.fresh
        } else if (this.modeFilter === 'dry') {
          return !element._source.fresh
        } else {
          return true
        }
      })
    }
  },
  components: { OrderItem },
  methods: {
    addProductToPreparedItems(product) {
      console.log('prep')
      if (
        this.preparedProducts.filter(item => item._id === product._id).length >
        0
      ) {
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
    }
  },
  watch: {
    modeFilter: {
      handler: function() {
        // this.sortedItemsList()
      }
    }
  }
}
</script>

<style scoped></style>
