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
          <li v-if="order._source.prep_status === 'started'">
            En cours de preparation
            {{
              order._source.lock_type === 'dry'
                ? 'Sec'
                : order._source.lock_type === 'fresh'
                ? 'Frais'
                : ''
            }}
          </li>
          <li>Client: {{ order._source.last_name }}</li>
          <li v-if="order._source.has_frais">Contient du frais</li>
          <li v-if="order._source.has_sec">Contient du sec</li>
          <li v-if="order._source.preparedDry">
            {{ order._source.preparedDry.length }}/{{
              order._source.dryItems.length
            }}
            produits secs préparés
          </li>
          <li v-if="order._source.preparedDry">
            {{ order._source.preparedFresh.length }}/{{
              order._source.freshItems.length
            }}
            produits frais préparés
          </li>
        </ul>
      </q-card-section>
      <q-card-section>
        <q-circular-progress
          v-if="order._source.preparedDry"
          show-value
          class="text-light-blue q-ma-md"
          :value="order._source.preparedDry.length"
          :max="order._source.dryItems.length"
          size="80px"
          color="green"
          >{{ order._source.preparedDry.length }}/{{
            order._source.dryItems.length
          }}
          <br />
          Sec</q-circular-progress
        >

        <q-circular-progress
          v-if="order._source.preparedFresh"
          show-value
          class="text-light-blue q-ma-md"
          :value="order._source.preparedFresh.length"
          :max="order._source.freshItems.length"
          size="80px"
          color="green"
          >{{ order._source.preparedFresh.length }}/{{
            order._source.freshItems.length
          }}<br />
          Frais</q-circular-progress
        >
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'OrderCard',
  props: ['order'],
  computed: {
    cardDisabled() {
      return this.order._source.lock
    },
    ...mapState('mvpPrep', ['lock_fresh', 'lock_dry'])
  },
  methods: {
    async cardClick() {
      console.log(this.cardDisabled)
      if (this.cardDisabled) return
      this.updateOrderStatus()
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
    updateOrderStatus() {
      this.order._source.prep_status = 'started'
      this.$store.commit('mvpPrep/mutate_currentOrderStatus', 'started')
      this.order._source.lock = true
      this.order._source.lock_type = this.lock_fresh
        ? 'fresh'
        : this.lock_dry
        ? 'dry'
        : 'none'
      this.order._source.updatedAt = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )
      console.log('lock type: ', this.order._source.lock_type)
      console.log('this is the current order on which ive clicked')
      console.log(this.$store.state.mvpPrep.currentOrder)
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
