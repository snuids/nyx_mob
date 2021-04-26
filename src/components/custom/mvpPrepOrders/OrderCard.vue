<template>
  <router-link
    class="card"
    :to="{
      name: 'order-display',
      params: {
        orderId: order.orderNumber.substr(1),
        status: order.status,
        hasSec: order.has_sec,
        hasFrais: order.has_frais,
        products: products.filter(
          product => product.orderNumber === order.orderNumber
        )
      }
    }"
  >
    <q-card
      @click="cardClick"
      v-ripple
      class="my-card bg-blue-grey-2 cursor-pointer q-hoverable"
    >
      <span class="q-focus-helper"></span>
      <q-card-section class="text-h6"> {{ order.orderNumber }}</q-card-section>
      <q-separator />
      <q-card-section>
        <ul>
          <li>status : {{ order.status }}</li>
          <li>Client: {{ order.last_name }}</li>
          <li v-if="order.has_frais">
            Contient du frais
          </li>
          <li v-if="order.has_sec">
            Contient du sec
          </li>
        </ul>

        <span>Contient {{ order.product_items.length }} produits</span>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script>
import moment from 'moment'
import axios from 'axios'

export default {
  name: 'OrderCard',
  props: ['order', 'products'],
  methods: {
    cardClick() {
      console.log(this.order)
      this.$store.commit('mvpPrep/mutate_currentOrder', this.order)
      this.sendOrderToServer()
    },
    sendOrderToServer() {
      // Change order status ?
      //this.checkOrderStatus()
      this.order.status = 'started'

      // Update "updated_at" field (2020-10-21T01:00:01.408567+02:00)
      this.order.updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ')

      // prepare currentOrder
      /*
      this.currentOrder.line_items = JSON.stringify(this.allItems)
      this.currentOrder.comments = JSON.stringify(this.allComments)
      */
      // forge the query
      const updatedPurchaseOrder = {
        _index: this.$store.state.mvpPrep.currentOrder._index,
        _source: this.$store.state.mvpPrep.currentOrder._source,
        _id: this.$store.state.mvpPrep.currentOrder._id
      }

      console.log(updatedPurchaseOrder)

      /* UNCOMMENT TO COMMIT REAL UPDATE */
      // send the update request
      this.$store.commit({
        type: 'updateRecord',
        data: updatedPurchaseOrder
      })
    }
  }
}
</script>

<style scoped>
.card {
  text-decoration: none;
  color: inherit;
}
</style>
