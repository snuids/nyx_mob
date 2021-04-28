<template>
  <div>
    <div class="q-pa-xl">
      <q-btn
        @click="unlock"
        color="white"
        text-color="black"
        label="retour"
        :to="{ name: 'orders' }"
        class="float-right "
      />
    </div>
    <OrderItems :products="this.products" />
    <q-page-sticky expand position="top">
      <StickyBanner></StickyBanner>
    </q-page-sticky>
    <!--<router-view></router-view> -->
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
      item: null,
      btn_value: null
    }
  },
  computed: {
    //products: this.$store.getters['mvpPrep/orderItems'](this.orderId)
  },
  props: ['orderId', 'status', 'hasSec', 'hasFrais', 'products'],
  methods: {
    itemClick() {
      console.log(self.label)
    },
    unlock() {
      this.sendUnlockOrderToServer()
    },
    sendUnlockOrderToServer() {
      this.$store.state.mvpPrep.currentOrder._source.status = 'finished'
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
    }
  }
}
</script>

<style scoped></style>
