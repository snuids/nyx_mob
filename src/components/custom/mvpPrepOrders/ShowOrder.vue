<template>
  <div>
    <div class="text-h6 q-pa-xl">Commande #{{ orderId }}</div>
    <OrderItems
      v-if="orderProducts"
      :products="orderProducts"
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
      preparedProducts: []
    }
  },
  computed: {
    orderProducts() {
      // console.log(this.$store.state.orderItems)
      return this.$store.state.mvpPrep.currentOrderItems
    }
  },
  props: ['orderId'],
  methods: {
    unlock() {
      this.sendUnlockOrderToServer()
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
