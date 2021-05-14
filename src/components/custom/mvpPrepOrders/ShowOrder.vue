<template>
  <q-page v-if="itemsToDisplay">
    <div class="text-h6 q-pa-xl">
      Commande #{{ orderId }} <br />
      {{ itemsToDisplay.length }} produits
      <div class="float-right">
        <q-toggle
          :label="filterHasFrais"
          color="green"
          false-value="Pas de Frais"
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
    </div>
    <OrderItems
      :products="itemsToDisplay"
      :preparedProducts="preparedProducts"
    />

    <div class="q-pa-xl">
      <q-btn
        :padding="'35px 40px'"
        :rounded="true"
        icon-right="save"
        @click="unlock"
        color="green"
        text-color="black"
        :to="{ name: 'orders' }"
        label="valider"
        class="float-right "
      />

      <q-btn
        :padding="'35px 40px'"
        :rounded="true"
        color="green"
        text-color="black"
        :to="{ name: 'orders' }"
        label="Retour"
        class="float-left "
      />
    </div>
  </q-page>
</template>

<script>
import OrderItems from './OrderItems'
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ShowOrder',
  components: { OrderItems },
  data() {
    return {
      preparedProducts: [],
      filterHasSec: 'Sec',
      filterHasFrais: 'Frais',
      isEditing: false
    }
  },
  computed: {
    ...mapState('mvpPrep', ['currentOrder', 'currentOrderItems']),
    ...mapGetters('mvpPrep', [
      'freshItems',
      'dryItems',
      'preparedFresh',
      'preparedDry',
      'missingDry',
      'missingFresh',
      'rembDry',
      'rembFresh'
    ]),
    itemsToDisplay: function() {
      let itemList
      if (this.filterHasFrais === 'Pas de Frais') {
        itemList = this.currentOrderItems.filter(
          product => !this.isFrais(product)
        )
        if (this.filterHasSec === 'Pas de Sec') {
          itemList = itemList.filter(product => this.isFrais(product))
        }
      } else if (this.filterHasSec === 'Pas de Sec') {
        itemList = this.currentOrderItems.filter(product =>
          this.isFrais(product)
        )
      } else {
        itemList = this.currentOrderItems
      }
      return itemList
    }
  },
  props: ['orderId'],
  methods: {
    isFrais(item) {
      return item._source.fresh
    },
    async unlock() {
      console.table(this.preparedProducts)
      let fresh = this.preparedProducts.filter(
        product =>
          product._source.fresh && product._source.prep_status === 'success'
      )
      let dry = this.preparedProducts.filter(
        product =>
          !product._source.fresh && product._source.prep_status === 'success'
      )
      let manqFresh = this.preparedProducts.filter(
        product =>
          product._source.fresh && product._source.prep_status === 'manq'
      )
      let manqDry = this.preparedProducts.filter(
        product =>
          !product._source.fresh && product._source.prep_status === 'manq'
      )
      let rembFresh = this.preparedProducts.filter(
        product =>
          product._source.fresh && product._source.prep_status === 'remb'
      )

      let rembDry = this.preparedProducts.filter(
        product =>
          !product._source.fresh && product._source.prep_status === 'remb'
      )

      this.currentOrder._source.freshItems = this.freshItems
      this.currentOrder._source.dryItems = this.dryItems

      if (this.preparedFresh.length === 0) {
        this.currentOrder._source.preparedFresh = []
        this.updateArrayPreparedItems(
          fresh,
          this.currentOrder._source.preparedFresh
        )
      } else {
        this.updateArrayPreparedItems(
          fresh,
          this.currentOrder._source.preparedFresh
        )
      }

      if (this.preparedDry.length === 0) {
        this.currentOrder._source.preparedDry = []

        this.updateArrayPreparedItems(
          dry,
          this.currentOrder._source.preparedDry
        )
      } else {
        this.updateArrayPreparedItems(
          dry,
          this.currentOrder._source.preparedDry
        )
      }

      if (this.missingFresh.length === 0) {
        this.currentOrder._source.missingFresh = []
        this.updateArrayPreparedItems(
          manqFresh,
          this.currentOrder._source.missingFresh
        )
      } else {
        this.updateArrayPreparedItems(
          manqFresh,
          this.currentOrder._source.missingFresh
        )
      }

      if (this.missingDry.length === 0) {
        this.currentOrder._source.missingDry = []
        this.updateArrayPreparedItems(
          manqDry,
          this.currentOrder._source.missingDry
        )
      } else {
        this.updateArrayPreparedItems(
          manqDry,
          this.currentOrder._source.missingDry
        )
      }

      if (this.rembFresh.length === 0) {
        this.currentOrder._source.rembFresh = []
        this.updateArrayPreparedItems(
          rembFresh,
          this.currentOrder._source.rembFresh
        )
      } else {
        this.updateArrayPreparedItems(
          rembFresh,
          this.currentOrder._source.rembFresh
        )
      }

      if (this.rembDry.length === 0) {
        this.currentOrder._source.rembDry = []
        this.updateArrayPreparedItems(
          rembDry,
          this.currentOrder._source.rembDry
        )
      } else {
        this.updateArrayPreparedItems(
          rembDry,
          this.currentOrder._source.rembDry
        )
      }

      this.$store.commit('mvpPrep/mutate_preparedItems', this.preparedProducts)
      if (this.preparedProducts.length > 0) {
        await this.$store.dispatch('mvpPrep/updateOrderItems', {
          line_items: this.preparedProducts
        })
      }
      await this.sendUnlockOrder()
      await this.$store.dispatch('mvpPrep/getOrders')
      console.log(this.$store.state.mvpPrep.updated_items)
      console.log(this.$store.getters['mvpPrep/preparedItems'])
    },
    async sendUnlockOrder() {
      if (
        this.currentOrder._source.rembDry +
          this.currentOrder._source.rembFresh +
          this.currentOrder._source.missingFresh +
          this.currentOrder._source.missingDry +
          this.currentOrder._source.preparedFresh +
          this.currentOrder._source.preparedDry ===
        this.currentOrder._source.freshItems +
          this.currentOrder._source.dryItems
      ) {
        this.currentOrder._source.prep_status = 'finished'
        this.$store.commit('mvpPrep/mutate_currentOrderStatus', 'finished')
      } else {
        this.currentOrder._source.prep_status = 'unfinished'
      }
      this.currentOrder._source.lock = false
      this.currentOrder._source.updatedAt = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )
      let newId = this.currentOrder._id.replace('#', '')
      // forge the query
      console.log('we are in sendunlockorder')
      console.log(this.currentOrder)
      /*
      const updatedOrder = {
        _index: this.$store.state.mvpPrep.currentOrder._index,
        _source: this.$store.state.mvpPrep.currentOrder._source,
        _id: newId
      }
      */
      console.log('bouton retour cliqué')
      //console.log(updatedOrder)
      /* UNCOMMENT TO COMMIT REAL UPDATE */
      // send the update request
      await this.$store.dispatch({
        type: 'mvpPrep/updateOrder',
        data: this.$store.state.mvpPrep.currentOrder
      })
      console.log('sendunlockorder terminé')
    },

    updateArrayPreparedItems(preparedArray, arrayToInsertIn) {
      preparedArray.map(item =>
        this.addProductToPrepared(
          [
            this.currentOrder._source.preparedDry,
            this.currentOrder._source.missingDry,
            this.currentOrder._source.rembDry,
            this.currentOrder._source.preparedFresh,
            this.currentOrder._source.missingFresh,
            this.currentOrder._source.rembFresh
          ],
          arrayToInsertIn,
          item
        )
      )
    },

    addProductToPrepared(productsArray, arrayToInsertIn, product) {
      productsArray.forEach(products => {
        if (products === arrayToInsertIn) {
          if (!this.included(products, product)) {
            arrayToInsertIn.push(product)
          }
        } else {
          if (this.included(products, product)) {
            this.update(products, product)
            console.log('element removed from ', products)
          }
        }
      })
    },

    update(products, product) {
      const eltIdx = products.findIndex(elt => elt._id === product._id)
      products.splice(eltIdx, 1)
    },
    included: function(products, product) {
      for (let p in products) {
        if (products[p]._id === product._id) {
          return true
        }
      }
      return false
    },

    preventNav(event) {
      console.log('ENNNNNNNNNNDDDDDDDDD:::::::::::::::::::::::::')
      event.preventDefault()
      this.sendUnlockOrder()
      event.returnValue = ''
    }
  },

  created() {
    this.$store.dispatch('mvpPrep/getOrderItems')
  },

  beforeMount() {
    window.addEventListener('beforeunload', this.preventNav)
  },

  async beforeRouteLeave(to, from, next) {
    await this.sendUnlockOrder()
    next()
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.preventNav)
  }
}
</script>

<style scoped></style>
