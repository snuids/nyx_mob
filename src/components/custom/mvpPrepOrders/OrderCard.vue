<template>
  <div v-if="order">
    <q-card
      :disabled="cardDisabled"
      v-ripple
      :class="[status, 'fit cursor-pointer q-hoverable myCard']"
    >
      <span class="q-focus-helper"></span>
      <q-card-section class="text-h6">{{
        order._source.order_number
      }}</q-card-section>
      <q-card-section @click="cardClick">
        <ul>
          <li>
            Status :
            {{
              order._source.prep_status
                ? order._source.prep_status === 'finished'
                  ? 'Finie'
                  : order._source.prep_status === 'unfinished'
                  ? 'Non finie'
                  : order._source.prep_status === 'started'
                  ? 'Commencé'
                  : ''
                : 'Non préparé'
            }}
          </li>
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
          <li v-if="order._source.preparedFresh">
            Nombre de produits préparés:
            {{
              order._source.preparedDry.length +
                order._source.preparedFresh.length +
                order._source.missingDry.length +
                order._source.missingFresh.length +
                order._source.rembDry.length +
                order._source.rembFresh.length
            }}/{{
              order._source.freshItems.length + order._source.dryItems.length
            }}
          </li>
        </ul>
      </q-card-section>
      <q-separator />
      <CollapsibleSection>
        <q-card-section
          v-if="order._source.preparedDry && order._source.preparedFresh"
        >
          <p>
            Produits ajoutés avec succès:
            {{
              order._source.preparedDry.length +
                order._source.preparedFresh.length
            }}
          </p>

          <q-circular-progress
            v-show="order._source.dryItems.length > 0"
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
            v-show="order._source.freshItems.length > 0"
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
        <q-separator />
        <q-card-section
          v-if="order._source.missingDry && order._source.missingFresh"
        >
          <p>
            Produits en attente producteur:
            {{
              order._source.missingDry.length +
                order._source.missingFresh.length
            }}
          </p>
          <q-circular-progress
            v-show="order._source.dryItems.length > 0"
            show-value
            class="text-light-blue q-ma-md"
            :value="order._source.missingDry.length"
            :max="order._source.dryItems.length"
            size="80px"
            color="orange"
            >{{ order._source.missingDry.length }}/{{
              order._source.dryItems.length
            }}
            <br />
            Sec</q-circular-progress
          >

          <q-circular-progress
            v-show="order._source.freshItems.length > 0"
            show-value
            class="text-light-blue q-ma-md"
            :value="order._source.missingFresh.length"
            :max="order._source.freshItems.length"
            size="80px"
            color="orange"
            >{{ order._source.missingFresh.length }}/{{
              order._source.freshItems.length
            }}<br />
            Frais</q-circular-progress
          >
        </q-card-section>
        <q-separator />
        <q-card-section v-if="order._source.rembDry && order._source.rembFresh">
          <p>
            Produits à rembourser:
            {{ order._source.rembDry.length + order._source.rembFresh.length }}
          </p>
          <q-circular-progress
            v-if="order._source.rembDry"
            v-show="order._source.dryItems.length > 0"
            show-value
            class="text-light-blue q-ma-md"
            :value="order._source.rembDry.length"
            :max="order._source.dryItems.length"
            size="80px"
            color="red"
            >{{ order._source.rembDry.length }}/{{
              order._source.dryItems.length
            }}
            <br />
            Sec</q-circular-progress
          >

          <q-circular-progress
            v-if="order._source.rembFresh"
            v-show="order._source.freshItems.length > 0"
            show-value
            class="text-light-blue q-ma-md"
            :value="order._source.rembFresh.length"
            :max="order._source.freshItems.length"
            size="80px"
            color="red"
            >{{ order._source.rembFresh.length }}/{{
              order._source.freshItems.length
            }}<br />
            Frais</q-circular-progress
          >
        </q-card-section>
      </CollapsibleSection>
    </q-card>
  </div>
</template>

<script>
import moment from 'moment'
import CollapsibleSection from './CollapsibleSection'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'OrderCard',
  props: ['order'],
  components: { CollapsibleSection },
  computed: {
    cardDisabled() {
      return this.order._source.lock
    },
    ...mapState('mvpPrep', ['lock_fresh', 'lock_dry']),
    status() {
      return this.order._source.prep_status
    }
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
  border-top: 20px solid cornflowerblue;
}

.finished {
  border-top: 20px solid green;
}

.unfinished {
  border-top: 20px solid red;
}

.myCard {
  background-color: #e8e8e8;
}
</style>
