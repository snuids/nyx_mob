<template>
  <transition leave-active-class="animated fadeOutDown" duration="250">
    <q-item
      clickable
      :class="[`bg-${bgColor}-2`, 'item']"
      v-if="!prepa"
      @click="changeStatus(product, 'success')"
      dense
    >
      <q-item-section
        v-if="product._source.smallImage !== undefined"
        style="max-width: 60px"
      >
        <img
          :src="product._source.smallImage"
          style="width: 50px; height: 50px"
        />
      </q-item-section>
      <q-item-section v-else style="max-width: 60px; ">
        <img
          src="https://via.placeholder.com/50"
          style="width: 50px; height: 50px"
        />
      </q-item-section>
      <div class="flex row col-xs-10">
        <div class="row col-xs-12 items-center">
          <div
            style="font-weight: bold; font-size: 15px; "
            class="row col-xs-10 justify-start "
          >
            {{ product._source.name }}
          </div>
          <div class="row col-xs-2 justify-end">
            <q-badge
              :class="[`${isFrais ? 'frais' : 'sec'}`, 'justify-center']"
              style="max-width: 40px"
            >
              {{ this.isFrais ? 'Frais' : 'Sec' }}
            </q-badge>
          </div>
        </div>
        <div class="row full-width items-center">
          <q-icon name="location_on" />
          <div class="row col-xs-6 col-md-9 justify-start">
            LOC {{ product._source.loc }} | {{ product._source.clean_vendor }}
          </div>
          <div class="row col-xs-5 col-md-2 justify-end">
            <q-btn
              @click.stop="changeStatus(product, 'remb')"
              icon="close"
              color="red-4"
              style="color: white; max-width: 40px"
              size="15px"
              unelevated
              rounded
            ></q-btn>
            &nbsp; &nbsp;
            <q-btn
              @click.stop="changeStatus(product, 'manq')"
              icon="hourglass_bottom"
              color="orange-4"
              style="color: white; max-width: 40px; margin-left: 20px"
              size="15px"
              unelevated
              rounded
            ></q-btn>
          </div>
        </div>
      </div>
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

    changeStatus(product, status) {
      console.log(status)

      this.prepa = true
      this.incrementClick(product)
      this.addToHistory(status)
      this.$set(this.product._source, 'prep_status', status)




      setTimeout(() => {
        this.putFirstItemLast(product)
        this.prepa = false
        this.$emit('prep', product)
      }, 300)

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
      console.log(tmpDisplayedItems.length-1)


      tmpDisplayedItems.push(tmpDisplayedItems.splice(elementPos, 1)[0])
        this.$store.commit(
          'mvpPrep/mutate_currentOrderItems',
          tmpDisplayedItems
        )
      
    },

    incrementClick(product) {
      if (
        product._source.prep_status === '' ||
        product._source.prep_status === 'manq'
      ) {
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
  background-color: deepskyblue;
}

.sec {
  background-color: mediumseagreen;
}

/*
.item {
  margin-bottom: 5px;
}

 */
</style>
