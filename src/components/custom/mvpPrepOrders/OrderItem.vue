<template>
  <transition appear leave-active-class="animated fadeOutDown" duration="250">
    <q-item clickable :class="[`bg-${bgColor}-2`, 'item']" v-if="!prepa">
      <q-item-section
        v-if="product._source.smallImage !== undefined"
        style="max-width: 50px; "
      >
        <img
          :src="product._source.smallImage"
          style="width: 50px; height: 50px"
        />
      </q-item-section>
      <q-item-section v-else style="max-width: 50px; ">
        <img
          src="https://via.placeholder.com/50"
          style="width: 50px; height: 50px"
        />
      </q-item-section>
      <q-item-section>
        <div class="flex row items-center" style="max-height: 50px">
          <div
            style="font-weight: bold; font-size: 16px"
            class="row col-xs-6 justify-start "
          >
            {{ product._source.name }}
          </div>
          <q-badge class="frais row col-xs-2 justify-start ">
            {{ this.isFrais ? 'Frais' : 'Sec' }}
          </q-badge>
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
    ...mapState('mvpPrep', [
      'currentOrderStatus',
      'itemsClicked',
      'displayedItems',
      'currentOrderItems'
    ]),
    prepStatus() {
      return this.product._source.prep_status
    },

    isFrais() {
      return this.product._source.fresh
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
      this.prepa = true
      this.incrementClick(product)
      this.addToHistory('remb')
      this.$set(this.product._source, 'prep_status', 'remb')
      this.putFirstItemLast(product)
      this.$emit('remb', product)
    },

    manq(product) {
      this.prepa = true
      this.decrementClick(product)
      this.addToHistory('manq')
      this.$set(this.product._source, 'prep_status', 'manq')
      this.putFirstItemLast(product)
      this.$emit('manq', product)
    },

    success(product) {
      this.prepa = true
      this.incrementClick(product)
      this.addToHistory('success')
      this.$set(this.product._source, 'prep_status', 'success')
      this.putFirstItemLast(product)
      this.$emit('success', product)
    },

    putFirstItemLast(product) {
      let tmpDisplayedItems = JSON.parse(JSON.stringify(this.currentOrderItems))
      let elementPos = tmpDisplayedItems.map(x => x._id).indexOf(product._id)
      console.log(elementPos)
      tmpDisplayedItems.push(tmpDisplayedItems.splice(elementPos, 1)[0])

      console.log(tmpDisplayedItems)

      setTimeout(() => {
        this.$store.commit(
          'mvpPrep/mutate_currentOrderItems',
          tmpDisplayedItems
        )
        console.log('-------------------------', this.currentOrderItems)
      }, 300)
    },

    incrementClick(product) {
      if (
        product._source.prep_status === '' ||
        product._source.prep_status === 'manq'
      ) {
        console.log('ok')
        this.$store.commit('mvpPrep/mutate_itemsClicked', this.itemsClicked + 1)
      }
    },
    decrementClick(product) {
      if (
        product._source.prep_status === 'remb' ||
        product._source.prep_status === 'success'
      ) {
        this.$store.commit('mvpPrep/mutate_itemsClicked', this.itemsClicked - 1)
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

.item {
  box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.2);
  margin-bottom: 5px;
}
</style>
