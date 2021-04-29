<template>
  <router-link
    class="card"
    :to="
      order._source.lock
        ? ''
        : {
            name: 'order-display',
            params: {
              orderId: order._source.order_number.replace('#', '')
            }
          }
    "
  >
    <q-card
      @click="cardClick"
      v-ripple
      :class="[
        order._source.prep_status === 'started' ? 'started' : '',
        'my-card bg-blue-grey-2 cursor-pointer q-hoverable'
      ]"
    >
      <span class="q-focus-helper"></span>
      <q-card-section class="text-h6">
        {{ order._source.order_number }}</q-card-section
      >
      <q-separator />
      <q-card-section>
        <ul>
          <li>Préparation : {{ order._source.prep_status }}</li>
          <li>Client: {{ order._source.last_name }}</li>
          <li v-if="order._source.has_frais">
            Contient du frais
          </li>
          <li v-if="order._source.has_sec">
            Contient du sec
          </li>
        </ul>

        <span>Contient {{ order._source.product_list.length }} produits</span>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script>
import moment from 'moment'

export default {
  name: 'OrderCard',
  props: ['order'],
  methods: {
    cardClick() {
      console.log(this.order)
      this.$store.commit('mvpPrep/mutate_currentOrder', this.order)
      this.sendOrderToServer()

      this.$store.commit('mvpPrep/mutate_currentOrder', this.order)

      console.log('toto')
      this.$store.dispatch('mvpPrep/getOrderItems')
      console.log('tata')
    },
    sendOrderToServer() {
      this.$store.state.mvpPrep.currentOrder._source.prep_status = 'started'
      this.$store.state.mvpPrep.currentOrder._source.lock = true
      this.$store.state.mvpPrep.currentOrder._source.updatedAt = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )
      console.log('this is the current order on which ive clicked')
      console.log(this.$store.state.mvpPrep.currentOrder)
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
