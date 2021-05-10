<template>
  <div v-if="itemsToDisplay">
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

    <div class="q-px-xl q-py-xl">
      <q-btn
        @click="unlock"
        color="green"
        text-color="black"
        :to="{ name: 'orders' }"
        label="valider"
        class="float-right "
      />
    </div>
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
      filterHasFrais: 'Frais',
      isEditing: false
    }
  },
  computed: {
    orderProducts() {
      return this.$store.state.mvpPrep.currentOrderItems
    },
    itemsToDisplay: function() {
      let itemList
      if (this.filterHasFrais === 'Pas de Frais') {
        itemList = this.orderProducts.filter(product => !this.isFrais(product))
        if (this.filterHasSec === 'Pas de Sec') {
          itemList = itemList.filter(product => this.isFrais(product))
        }
      } else if (this.filterHasSec === 'Pas de Sec') {
        itemList = this.orderProducts.filter(product => this.isFrais(product))
      } else {
        itemList = this.orderProducts
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
      this.$store.state.mvpPrep.currentOrder._source.prep_status = 'finished'
      this.$store.commit('mvpPrep/mutate_currentOrderStatus', 'finished')
      this.$store.state.mvpPrep.currentOrder._source.lock = false
      this.$store.state.mvpPrep.currentOrder._source.updatedAt = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )
      let newId = this.$store.state.mvpPrep.currentOrder._id.replace('#', '')
      // forge the query
      console.log('we are in sendunlockorder')
      console.log(this.$store.state.mvpPrep.currentOrder)
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
