<template>
  <q-card
    :disabled="cardDisabled"
    @click="cardClick"
    v-ripple
    :class="[
      order._source.prep_status === 'started' ? 'started' : '',
      'my-card bg-blue-grey-2 cursor-pointer q-hoverable'
    ]"
  >
    <span class="q-focus-helper"></span>
    <q-card-section class="text-h6">{{ order._source.order_number }}</q-card-section>
    <q-separator />
    <q-card-section>
      <ul>
        <li>Préparation : {{ order._source.prep_status }}</li>
        <li>Client: {{ order._source.last_name }}</li>
        <li v-if="order._source.has_frais">Contient du frais</li>
        <li v-if="order._source.has_sec">Contient du sec</li>
      </ul>

      <span>Contient {{ order._source.product_list.length }} produits</span>
    </q-card-section>
  </q-card>
</template>

<script>
import moment from 'moment'

export default {
  name: 'OrderCard',
  props: ['order'],
  computed: {
    cardDisabled() {
      return this.order._source.lock
    }
  },
  methods: {
    cardClick() {

      console.log(this.cardDisabled)
      if (this.cardDisabled)
        return 

      this.sendOrderToServer()

      this.$store.commit('mvpPrep/mutate_currentOrder', this.order)

      this.$store.dispatch('mvpPrep/getOrderItems')

      let orderId = this.order._source.order_number.replace('#', '')

      this.$router.push({ name: 'order-display', params: { orderId: orderId } });
    },
    sendOrderToServer() {
      this.order._source.prep_status = 'started'
      this.order._source.lock = true
      this.order._source.updatedAt = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )
      console.log('this is the current order on which ive clicked')
      console.log(this.order)
      let newId = this.order._id.replace('#', '')
      // forge the query
      const updatedOrder = {
        _index: this.order._index,
        _source: this.order._source,
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
