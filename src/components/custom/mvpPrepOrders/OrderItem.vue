<template>
  <transition appear leave-active-class="animated fadeOutDown" duration="250">
    <q-item
      clickable
      :class="[`bg-${bgColor}-2`, 'item']"
      v-if="prepStatus !== 'success' || !prepa"
    >
      <q-item-section style="max-width: 100px">
        <img src="https://via.placeholder.com/100" />
      </q-item-section>
      <q-item-section>
        <div class="flex row items-center" style="max-height: 50px">
          <div
            style="font-weight: bold; font-size: 16px"
            class="row col-xs-6 justify-start "
          >
            {{ product._source.name }}
          </div>
          <q-badge class="frais row col-xs-2 justify-center ">
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
      'displayedItems'
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
      this.incrementClick(product)
      this.addToHistory('remb')
      this.$set(this.product._source, 'prep_status', 'remb')
      this.$emit('remb', product)
    },
    manq(product) {
      this.decrementClick(product)
      this.addToHistory('manq')
      this.$set(this.product._source, 'prep_status', 'manq')
      this.$emit('manq', product)
    },
    success(product) {
      this.prepa = true
      this.incrementClick(product)
      this.addToHistory('success')
      this.$set(this.product._source, 'prep_status', 'success')

      // let tmpDisplayedItems = JSON.parse(JSON.stringify(this.displayedItems))

      // let elementPos = tmpDisplayedItems.map(function(x) {return x._id; }).indexOf(product._id);

      // console.log(elementPos)

      // console.log(tmpDisplayedItems.push(
      //   tmpDisplayedItems.splice(
      //     elementPos,
      //               1
      //             )[0]
      //           ))

      // console.log(tmpDisplayedItems)

      // tmpDisplayedItems.forEach(Element => {
      //   console.log(Element._source.name)
      // })

      // setTimeout(() => {
      //   this.$store.commit(
      //     'mvpPrep/mutate_displayedItems', tmpDisplayedItems

      //   )
      //   console.log('-------------------------', this.displayedItems)
      // }, 300)

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
  border-radius: 20px;
  box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.2);
  margin-bottom: 5px;
}
</style>
