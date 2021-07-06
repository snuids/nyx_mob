<template>
  <q-item
    flat
    clickable
    v-if="order"
    v-ripple
    :class="[status, 'bg-grey-11 row flex full-width ']"
    @click="cardClick"
    style=" padding: 0; margin: 0 0 2px 0 "
  >
    <q-item-section
      class="row flex col-xs-2 items-center"
      style="max-width: 60px; "
    >
      <q-icon
        left
        v-if="order._source.prep_status === 'finished'"
        name="done"
        style="background-color: green; font-size: 2.5rem; color: white; border-radius: 40px; padding: 2px"
      />
      <q-icon
        left
        v-if="order._source.prep_status === 'started'"
        name="pending"
        style="background-color: deepskyblue; font-size: 2.5rem; color: white; border-radius: 40px; padding: 2px"
      />
      <q-icon
        left
        v-if="order._source.prep_status === 'finishedWithRemb'"
        name="close"
        style="background-color:red; color: white; border-radius: 40px; font-size: 2.5rem; padding: 2px"
      />
      <q-icon
        left
        v-if="order._source.prep_status === 'unfinished'"
        name="hourglass_bottom"
        style="background-color:orange ; font-size: 2.5rem; color: white; border-radius: 40px; padding: 2px"
      />
      <q-icon
        left
        v-if="order._source.prep_status === 'finishedWithReplaced'"
        name="published_with_changes"
        style="background-color:dodgerblue ; font-size: 2.5rem; color: white; border-radius: 40px; padding: 2px"
      />
    </q-item-section>
    <q-item-section
      class="text-subtitle1 row col-xs-10 justify-center"
      style="margin: 0"
    >
      <div class="full-width">
        <b># {{ order._source.order_number }}</b>

        <q-chip text-color="black" class="float-right">
          {{
            order._source.tags.split(',').filter(elt => elt.includes('-'))[0]
          }}
        </q-chip>
        <q-chip
          class="float-right"
          v-if="order._source.tags.split(',').includes(' express')"
          color="blue"
          text-color="white"
        >
          {{ 'express' }}
        </q-chip>
      </div>
      <div>
        <q-chip
          v-if="
            order._source.intermediaryStatus &&
              order._source.prep_status === 'unfinished'
          "
          :color="orderColor"
          text-color="white"
        >
          Préparation {{ order._source.intermediaryStatus }} terminée
        </q-chip>

        <q-chip
          v-if="order._source.prep_status === 'started'"
          :color="orderColor"
          text-color="white"
        >
          En cours de preparation
          {{
            order._source.lock_type === 'dry'
              ? 'Sec'
              : order._source.lock_type === 'fresh'
              ? 'Frais'
              : ''
          }}
        </q-chip>

        <q-chip v-else :color="orderColor" text-color="white">
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
                : order._source.prep_status === 'finishedWithReplaced'
                ? 'Finie avec produits remplacés'
                : ''
              : 'Non préparé'
          }}
        </q-chip>
      </div>
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
      'currentOrder',
      'itemsClicked'
    ]),
    status() {
      return this.order._source.prep_status
    },
    userName: function() {
      return this.creds.user.firstname
    },
    blocker() {
      return this.order._source.blocker
    }
  },

  methods: {
    async cardClick() {
      console.log('is the card disabled ', this.cardDisabled)
      console.log('this is the lock ', this.order._source.lock)

      console.log('this is the order ', this.order)

      if (this.cardDisabled) {
        console.log(this.order)
        this.$q
          .dialog({
            title: 'Lock',
            message: `Commande bloquée par ${this.blocker}, voulez-vous continuer`,
            cancel: true
          })
          .onOk(() => {
            this.$store
              .dispatch('mvpPrep/requestOrder', this.order._id)
              .then(() => {
                this.$router.push({
                  query: { showOrder: this.order._id }
                })
              })
          })
          .onCancel(() => {})
      } else {
        await this.$store.dispatch('mvpPrep/requestOrder', this.order._id)

        if (this.currentOrder._source.prep_status === 'started') {
          alert('cette commande est en cours de préparation')
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
  color: mediumseagreen;
}

.myCard {
  background-color: #e8e8e8;
}
</style>
