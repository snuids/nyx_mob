<template>
  <router-link
    class="card"
    :to="
      order._source.lock
        ? ''
        : {
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
          }
    "
  >
    <q-card
      @click="cardClick"
      v-ripple
      :class="[
        order._source.status === 'started' ? 'started' : '',
        'my-card bg-blue-grey-2 cursor-pointer q-hoverable'
      ]"
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

export default {
  name: 'OrderCard',
  props: ['order', 'products'],
  methods: {
    cardClick() {
      this.$store.commit('mvpPrep/mutate_currentOrder', this.order)
      console.log('order from orderCard')
      console.log(this.order)
      this.sendOrderToServer()
    },
    sendOrderToServer() {
      this.$store.state.mvpPrep.currentOrder._source.status = 'started'
      this.$store.state.mvpPrep.currentOrder._source.lock = true
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
      /* UNCOMMENT TO COMMIT REAL UPDATE */
      // send the update request
      this.$store.commit({
        type: 'updateRecord',
        data: updatedOrder
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

.started {
  color: green;
}
</style>
