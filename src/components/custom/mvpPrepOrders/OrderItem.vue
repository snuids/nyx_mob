<template>
  <q-item :class="[status, 'q-pa-md']">
    <q-item-section>
      <q-badge class="frais" align="top">{{
        this.isFrais ? 'Frais' : 'Sec'
      }}</q-badge>
      <div>1 &nbsp; {{ product._source.name }}</div>
      &nbsp; &nbsp;
    </q-item-section>
    <q-btn-group class="float-right" rounded>
      <q-btn
        @click="remb(product)"
        color="yellow"
        text-color="black"
        push
        label="REMB"
        unelevated
      ></q-btn>
      <q-btn
        @click="manq(product)"
        color="amber"
        text-color="black"
        push
        label="MANQ"
        unelevated
      ></q-btn>
      <q-btn
        @click="success(product)"
        color="green"
        text-color="black"
        push
        label="ok"
        unelevated
      ></q-btn>
    </q-btn-group>
  </q-item>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'OrderItem',
  props: ['product'],

  computed: {
    ...mapState('mvpPrep', ['currentOrderStatus']),
    isFrais() {
      return this.product._source.fresh
    },
    status() {
      return this.product._source.prep_status
    },
    history() {
      return this.product._source.history
    }
  },
  methods: {
    addToHistory(itemStatus) {
      if (this.history) {
        this.product._source.history.push({
          status: itemStatus,
          date: moment().format('DD/MM/YYYY HH:mm:ss'),
          user: this.$store.getters.creds.user.firstname
        })
      } else {
        this.product._source.history = [
          {
            status: itemStatus,
            date: moment().format('DD/MM/YYYY HH:mm:ss'),
            user: this.$store.getters.creds.user.firstname
          }
        ]
      }
    },
    remb(product) {
      this.product._source.prep_status = 'remb'
      this.addToHistory('remb')
      this.$emit('remb', product)
    },
    manq(product) {
      this.addToHistory('manq')
      this.product._source.prep_status = 'manq'
      this.$emit('manq', product)
    },
    success(product) {
      this.addToHistory('success')
      this.product._source.prep_status = 'success'
      this.$emit('success', product)
    }
  }
}
</script>

<style scoped>
.remb {
  border-left: 5px solid red;
}

.manq {
  border-left: 5px solid #f2c037;
}

.success {
  border-left: 5px solid green;
}

.frais {
  max-width: 40px;
}
</style>
