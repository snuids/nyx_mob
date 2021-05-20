<template>
  <transition appear leave-active-class="animated fadeOutDown" :duration="300">
    <q-item
      :class="[`bg-${bgColor}-2`]"
      v-if="prepStatus !== 'success' || !prepa"
    >
      <q-item-section style="max-width: 100px">
        <img src="https://via.placeholder.com/100" />
      </q-item-section>
      <q-item-section>
        <q-badge class="frais" align="top">{{
          this.isFrais ? 'Frais' : 'Sec'
        }}</q-badge>
        <div style="font-weight: bold; font-size: 16px">
          1 &nbsp; {{ product._source.name }}
        </div>
        <div>
          <q-icon name="location_on"></q-icon>
          LOC {{ product._source.loc }} | {{ product._source.vendor }}
        </div>
      </q-item-section>
      <q-btn-group class="float-right" rounded>
        <q-btn
          @click="remb(product)"
          color="red-4"
          text-color="black"
          push
          label="REMB"
          unelevated
        ></q-btn>
        <q-btn
          @click="manq(product)"
          color="orange-4"
          text-color="black"
          push
          label="MANQ"
          unelevated
        ></q-btn>
        <q-btn
          @click="success(product)"
          color="green-4"
          text-color="black"
          push
          label="ok"
          unelevated
        ></q-btn>
      </q-btn-group>
    </q-item>
  </transition>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'OrderItem',
  props: ['product'],
  data() {
    return {
      prepa: false
    }
  },
  computed: {
    ...mapState('mvpPrep', ['currentOrderStatus', 'itemsClicked']),
    prepStatus() {
      return this.product._source.prep_status
    },
    isFrais() {
      return this.product._source.fresh
    },
    status() {
      return this.product._source.prep_status
    },
    bgColor() {
      if (this.product._source.prep_status === 'remb') {
        return 'red'
      } else if (this.product._source.prep_status === 'manq') {
        return 'orange'
      } else if (this.product._source.prep_status === 'success') {
        return 'green'
      }
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
      this.incrementClick(product)
      this.addToHistory('remb')
      this.$set(this.product._source, 'prep_status', 'remb')
      this.$emit('remb', product)
    },
    manq(product) {
      //this.incrementClick(product)
      this.addToHistory('manq')
      this.$set(this.product._source, 'prep_status', 'manq')
      this.$emit('manq', product)
    },
    success(product) {
      this.prepa = true
      this.incrementClick(product)
      this.addToHistory('success')
      this.$set(this.product._source, 'prep_status', 'success')
      this.$emit('success', product)
    },
    incrementClick(product) {
      if (
        product._source.prep_status === '' ||
        product._source.prep_status === 'manq'
      ) {
        console.log('ok')
        this.$store.commit('mvpPrep/mutate_itemsClicked', this.itemsClicked + 1)
      }
    }
  }
}
</script>

<style scoped>
.remb {
  border-left: 8px solid red;
}

.manq {
  border-left: 8px solid #f2c037;
}

.success {
  border-left: 8px solid green;
}

.frais {
  max-width: 40px;
}
</style>
