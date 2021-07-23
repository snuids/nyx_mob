<template>
  <q-list class="q-pa-none q-ma-none" style="padding-bottom: 85px" separator>
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
import { mapState, mapGetters } from 'vuex'

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

    ...mapGetters('mvpPrep', ['freshItems', 'dryItems']),

    sortedItemsList: function() {
      if (this.modeFilter === 'fresh') {
        return this.freshItems
      }
      if (this.modeFilter === 'dry') {
        return this.dryItems
      }
      return this.currentOrderItems
    }
  },
  components: { OrderItem },
  methods: {
    addProductToPreparedItems(product) {
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
  },
  async beforeCreate() {
    await this.$store.dispatch('mvpPrep/getOrderItems')
  }
}
</script>

<style scoped></style>
