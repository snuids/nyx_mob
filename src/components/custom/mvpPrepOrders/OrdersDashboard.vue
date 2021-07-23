<template>
  <div>
    <div
      class="row justify-center"
      style="font-size: 20px; font-weight: bold; padding-bottom: 50px"
    >
      DASHBOARD
    </div>
    <q-list class=" row flex justify-center fullwidth">
      <q-item
        clickable
        @click="goToOrdersList('all')"
        class="row col-xs-10 justify-center text-white"
        style="background-color: #EABD5A; padding-bottom: 30px; margin-bottom: 30px; border-radius: 20px"
      >
        <div
          class="row col-xs-10 justify-center text-h6"
          style="text-align: center"
        >
          Commandes du jour
          <div
            class="row col-xs-10 justify-center text-h4"
            style="font-weight: bold"
          >
            {{ orders.length }}
          </div>
        </div>
      </q-item>
      <q-item
        class="row col-xs-10 justify-center text-white"
        style="background-color: seagreen; padding-bottom: 30px; border-radius: 20px"
        clickable
        @click="goToOrdersList('finished')"
      >
        <div
          class="row col-xs-10 justify-center text-h6"
          style="text-align: center"
        >
          Commandes prêtes à expédier
          <div
            class="row col-xs-10 justify-center text-h4"
            style="font-weight: bold"
          >
            {{
              orders.filter(elt => {
                if (elt._source.prep_status !== undefined) {
                  return (
                    elt._source.prep_status === 'finished' ||
                    elt._source.prep_status === 'finishedWithRemb' ||
                    elt._source.prep_status === 'finishedWithReplaced'
                  )
                }
                return false
              }).length
            }}
          </div>
        </div>
      </q-item>
    </q-list>
    <q-page-sticky expand position="top">
      <StickyBanner
        class="row items-center"
        style="height: 50px"
      ></StickyBanner>
    </q-page-sticky>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import mixin from './mixin'

export default {
  name: 'OrdersDashboard',

  mixins: ['mixin'],
  computed: {
    ...mapState('mvpPrep', ['orders'])
  },
  methods: {
    goToOrdersList(statut) {
      if (statut === 'finished') {
        this.$store.commit('mvpPrep/mutate_openFinishedOrders', true)
        // console.log('print finished orders')
      }
      // console.log('go to orders list')
      this.$router.push({
        query: { path: 'ordersList' }
      })
    }
  },
  created() {
    this.$store.commit('mvpPrep/mutate_openFinishedOrders', false)
  }
}
</script>

<style scoped></style>
