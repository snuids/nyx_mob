<template>
  <div>
    <q-card
      square
      flat
      bordered
      v-if="order"
      :disabled="cardDisabled"
      v-ripple
      :class="[status, 'cursor-pointer q-hoverable myCard']"
      @click="cardClick"
    >
      <span class="q-focus-helper"></span>
      <q-card-section class="text-subtitle1">
        <div style="font-weight: bold"># {{ order._source.order_number }}</div>
        <ul>
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
          <li v-else>
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
        </ul>
      </q-card-section>
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
  border-left: 40px solid cornflowerblue;
  color: green;
}

.finished {
  border-left: 40px solid green;
}

.unfinished {
  border-left: 40px solid orange;
}

.finishedWithRemb {
  border-left: 40px solid #ff8a80;
}

.myCard {
  background-color: #e8e8e8;
}
</style>
