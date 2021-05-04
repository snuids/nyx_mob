<template>
  <div>
    <div class="text-h6 q-pa-xl">Commande #{{ orderId }}</div>

    <div class="q-pa-md q-gutter-y-sm">
      <q-toggle
        :label="filterHasFrais"
        color="green"
        false-value="Pas de frais"
        true-value="Frais"
        v-model="filterHasFrais"
        toggle-order="tf"
        @click="itemsToDisplay"
      ></q-toggle>
      <q-toggle
        :label="filterHasSec"
        color="green"
        false-value="Pas de Sec"
        true-value="Sec"
        v-model="filterHasSec"
        toggle-order="tf"
        @click="itemsToDisplay"
      ></q-toggle>
    </div>

    <OrderItems
      v-if="orderProducts"
      :products="itemsToDisplay"
      :preparedProducts="preparedProducts"
    />

    <div class="q-px-xl q-py-xl">
      <q-btn
        @click="unlock"
        color="green"
        text-color="black"
        label="valider"
        :to="{ name: 'orders' }"
        class="float-right "
      />
    </div>
    <!--<q-page-sticky expand position="top">
      <StickyBanner></StickyBanner>
    </q-page-sticky>
    <router-view></router-view> -->
  </div>
</template>

<script>
import OrderItems from './OrderItems'
import moment from 'moment'

export default {
  name: 'ShowOrder',
  components: { OrderItems },
  data() {
    return {
      preparedProducts: [],
      filterHasSec: 'Sec',
      filterHasFrais: 'Frais'
    }
  },
  computed: {
    orderProducts() {
      return this.$store.state.mvpPrep.currentOrderItems
    },
    itemsToDisplay: function() {
      let itemList
      if (this.filterHasFrais !== 'Frais') {
        itemList = this.orderProducts.filter(product => !this.isFrais(product))
      } else if (this.filterHasSec !== 'Sec') {
        itemList = this.orderProducts.filter(product => this.isFrais(product))
      } else {
        itemList = this.orderProducts
      }

      return itemList
    }
  },
  props: ['orderId'],
  methods: {
    isFrais(product) {
      product._source.product.tags.map(x => x.toLowerCase()).includes('frais')
    },

    unlock() {
      this.sendUnlockOrderToServer()
      console.table(this.preparedProducts)
      this.$store.commit('mvpPrep/mutate_preparedItems', this.preparedProducts)
      console.log(this.$store.getters['mvpPrep/preparedItems'])
    },
    sendUnlockOrderToServer() {
      this.$store.state.mvpPrep.currentOrder._source.prep_status = 'finished'
      this.$store.state.mvpPrep.currentOrder._source.lock = false
      this.$store.state.mvpPrep.currentOrder._source.updatedAt = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )
      let newId = this.$store.state.mvpPrep.currentOrder._id.replace('#', '')
      // forge the query
      const updatedOrder = {
        _index: this.$store.state.mvpPrep.currentOrder._index,
        _source: this.$store.state.mvpPrep.currentOrder._source,
        _id: newId
      }

      console.log('bouton retour cliqué')
      console.log(updatedOrder)
      /* UNCOMMENT TO COMMIT REAL UPDATE */
      // send the update request
      this.$store.commit({
        type: 'updateRecord',
        data: updatedOrder
      })
    },
    preventNav(event) {
      console.log('ENNNNNNNNNNDDDDDDDDD:::::::::::::::::::::::::')
      event.preventDefault()
      this.sendUnlockOrderToServer()
      event.returnValue = ''
    }
  },
  created() {
    window.addEventListener('beforeunload', this.preventNav)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.preventNav)
  }
}
</script>

<style scoped></style>
