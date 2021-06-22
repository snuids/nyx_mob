<template>
  <q-item
    flat
    clickable
    v-if="order"
    v-ripple
    :class="[status, 'bg-grey-11 row flex col-12 q-pl-sm']"
    @click="cardClick"
    style="margin-bottom: 2px"
  >
    <q-item-section
      class="row flex col-2"
      style="max-width: 60px"
      v-if="order._source.prep_status !== undefined"
    >
      <q-icon
        left
        v-if="order._source.prep_status === 'finished'"
        name="done"
        style="background-color: green; font-size: 3rem; color: white; border-radius: 40px"
      />
      <q-icon
        left
        size="3rem"
        v-if="order._source.prep_status === 'finishedWithRemb'"
        name="close"
        style="background-color:red; color: white; border-radius: 40px"
      />
      <q-icon
        left
        v-if="order._source.prep_status === 'unfinished'"
        name="hourglass_bottom"
        style="background-color:coral ; font-size: 3rem; color: white; border-radius: 40px"
      />
    </q-item-section>
    <q-item-section class="text-subtitle1">
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
          <q-chip :color="orderColor" text-color="white">
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
          </q-chip>
        </li>
      </ul>
    </q-item-section>
  </q-item>
</template>

<script>
import CollapsibleSection from './CollapsibleSection'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'OrderCard',
  props: ['order'],
  components: { CollapsibleSection },

  computed: {
    orderColor() {
      return this.order._source.prep_status === 'finishedWithRemb'
        ? 'red'
        : this.order._source.prep_status === 'unfinished'
        ? 'orange'
        : this.order._source.prep_status === 'finished'
        ? 'green'
        : 'blue'
    },
    cardDisabled() {
      return this.order._source.lock
    },
    ...mapGetters(['creds']),
    ...mapState('mvpPrep', [
      'lock_fresh',
      'lock_dry',
      'currentOrderItems',
      'currentOrder'
    ]),
    status() {
      return this.order._source.prep_status
    },
    userName: function() {
      return this.creds.user.firstname
    }
  },

  methods: {
    async cardClick() {
      if (this.cardDisabled) {
        this.$q
          .dialog({
            title: 'Lock',
            message: `Commande bloquée par ${this.userName}, voulez-vous continuer`,
            cancel: true
          })
          .onOk(() => {
            console.log('OK')
            this.$router.push({
              query: { showOrder: this.order._id }
            })
          })
          .onCancel(() => {
            return
          })
      } else {
        console.log(this.cardDisabled)
        await this.$store.dispatch('mvpPrep/requestOrder', this.order._id)
        if (this.currentOrder._source.prep_status === 'started') {
          return
        }
        await this.$router.push({
          query: { showOrder: this.order._id }
        })
      }
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

.myCard {
  background-color: #e8e8e8;
}
</style>
