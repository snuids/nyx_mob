<template>
  <div>
    <q-card
      v-if="order"
      :disabled="cardDisabled"
      v-ripple
      :class="[status, 'cursor-pointer q-hoverable myCard']"
      @click="cardClick"
    >
      <span class="q-focus-helper"></span>
      <q-card-section class="text-h6">{{
        order._source.order_number
      }}</q-card-section>
      <q-card-section>
        <ul>
          <li>
            Préparation:
            {{
              order._source.prep_status
                ? order._source.prep_status === 'finished'
                  ? 'Finie'
                  : order._source.prep_status === 'unfinished'
                  ? 'Non finie'
                  : order._source.prep_status === 'started'
                  ? 'Commencé'
                  : order._source.prep_status === 'finishedWithRemb'
                  ? 'Finie avec produits à rembourser'
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
        <q-card-section>
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
        <q-card-section>
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
        <q-card-section>
          <p>
            Produits à rembourser:
            {{ order._source.rembDry.length + order._source.rembFresh.length }}
          </p>
          <q-circular-progress
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
    ...mapState('mvpPrep', ['lock_fresh', 'lock_dry', 'currentOrderItems']),
    status() {
      return this.order._source.prep_status
    }
  },
  methods: {
    cardClick() {
      console.log(this.cardDisabled)
      if (this.cardDisabled) return

      this.$router.push({
        query: { showOrder: this.order._id }
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
  color: green;
}

.finished {
  border-top: 20px solid green;
}

.unfinished {
  border-top: 20px solid orange;
}

.finishedWithRemb {
  border-top: 20px solid #ff8a80;
}

.myCard {
  background-color: #e8e8e8;
}
</style>
