<template>
  <q-list class="q-pa-none">
    <OrderItem
      v-for="(item, idx) in itemsDisplayed"
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
    ...mapState('mvpPrep', [
      'displayedItems',
      'currentOrderItems',
      'modeFilter'
    ]),
    itemsDisplayed() {
      return this.sortedItemsList()
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
    },

    sortedItemsList: function() {
      console.log('sortedList')
      console.log(this.currentOrderItems)

      let sortedList = this.currentOrderItems.sort((a, b) => {
        if (a._source.prep_status === '' || b._source.prep_status === '') {
          return b._source.prep_status !== '' ? -1 : 1
        } else if (
          a._source.prep_status === 'manq' ||
          b._source.prep_status === 'manq'
        ) {
          return b._source.prep_status !== 'manq' ? -1 : 1
        } else if (a._source.prep_status === 'remb') {
          return b._source.prep_status !== 'remb' ? -1 : 1
        }
      })
      let displayed = sortedList.filter(element => {
        if (this.modeFilter === 'fresh') {
          return element._source.fresh
        } else if (this.modeFilter === 'dry') {
          return !element._source.fresh
        } else {
          return true
        }
      })
      this.$store.commit('mvpPrep/mutate_displayedItems', displayed)
      return displayed
    }
  },
  watch: {
    modeFilter: {
      handler: function() {
        this.sortedItemsList()
      }
    }
  }
}
</script>

<style scoped></style>
