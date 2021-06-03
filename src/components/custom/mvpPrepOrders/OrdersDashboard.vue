<template>
  <q-list class=" row flex fullwidth">
    <q-item
      clickable
      @click="goToOrdersList"
      class="row col-xs-12 justify-center"
      style="background-color: lawngreen;"
    >
      <q-item-section>
        Commandes du jour
      </q-item-section>
      <q-item-section>
        {{ orders.length }}
      </q-item-section>
    </q-item>
    <q-item
      class="row col-xs-12 justify-center"
      style="background-color: greenyellow"
    >
      <q-item-section>
        Commandes prêtes à expédier
      </q-item-section>
      <q-item-section>
        {{
          orders.filter(elt => {
            if (elt._source.prep_status !== undefined) {
              return elt._source.prep_status === 'finished'
            }
            return false
          }).length
        }}
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'OrdersDashboard',

  computed: {
    ...mapState('mvpPrep', ['orders'])
  },
  methods: {
    goToOrdersList() {
      console.log('go to orders list')
      this.$router.push({
        query: { path: 'ordersList' }
      })
    }
  }
}

/* TODO: - commandes à préparer
       - commandes terminés à être expédier

 */
</script>

<style scoped></style>
