<template>
  <div v-if="order">
    <q-card
      :disabled="cardDisabled"
      @click="cardClick"
      v-ripple
      :class="[
        order._source.prep_status === 'started' ? 'started' : '',
        'fit cursor-pointer q-hoverable bg-blue-grey-2'
      ]"
    >
      <span class="q-focus-helper"></span>
      <q-card-section class="text-h6">{{
        order._source.order_number
      }}</q-card-section>
      <q-separator />
      <q-card-section>
        <ul>
          <li>Préparation : {{ order._source.prep_status }}</li>
          <li>Client: {{ order._source.last_name }}</li>
          <li v-if="order._source.has_frais">Contient du frais</li>
          <li v-if="order._source.has_sec">Contient du sec</li>
        </ul>
      </q-card-section>
    </q-card>
  </div>
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
    async cardClick() {
      console.log(this.cardDisabled)
      if (this.cardDisabled) return
      this.updateOrderOnServer()
      this.$store.commit('mvpPrep/mutate_currentOrder', this.order)
      this.$q.loading.show()
      await this.$store.dispatch('mvpPrep/getOrderItems')
      this.$q.loading.hide()
      console.log('these are the items sent when the card was cliked')
      console.log(this.$store.getters['mvpPrep/orderItems'])
      let orderId = this.order._source.order_number.replace('#', '')
      await this.$router.push({
        name: 'order-display',
        params: { orderId: orderId }
      })
    },
    updateOrderOnServer() {
      this.order._source.prep_status = 'started'
      this.order._source.lock = true
      this.order._source.updatedAt = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )
      console.log('this is the current order on which ive clicked')
      console.log(this.order)
      let newId = this.order._id.replace('#', '')
      // forge the query
      /*
      const updatedOrder = {
        _index: this.order._index,
        _source: this.order._source,
        _id: newId
      }
      */
      /* UNCOMMENT TO COMMIT REAL UPDATE */
      // send the update request
      this.$store.dispatch({
        type: 'mvpPrep/updateOrder',
        data: this.order
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
