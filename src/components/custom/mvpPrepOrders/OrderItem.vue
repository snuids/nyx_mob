<template>
  <transition
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOutDown"
    duration="100"
  >
    <q-item
      clickable
      :class="[`bg-${bgColor}-2`, 'item q-pa-none']"
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
          style="width: 60px; height: 60px"
        />
      </q-item-section>
      <q-item-section v-else style="max-width: 60px; ">
        <img
          src="https://via.placeholder.com/50"
          style="width: 60px; height: 60px"
        />
      </q-item-section>
      <div class="flex row col-xs-10">
        <div class="row col-xs-12 items-center">
          <div
            style="font-weight: bold; font-size: 15px; "
            class="row col-xs-10 justify-start q-px-xs"
          >
            <span class="overflow-ellipsis text-dark">{{
              product._source.name
            }}</span>
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
        <div class="row full-width items-center text-grey-6">
          <q-icon name="location_on" />
          <div class="row col-xs-6 col-md-9 justify-start">
            <span class="overflow-ellipsis">
              LOC {{ product._source.loc }} | {{ product._source.clean_vendor }}
            </span>
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

// TODO gérer latence

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
      'itemsClickedFresh',
      'itemsClickedDry',
      'modeFilter',
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
      this.prepa = true
      this.incrementClick(product)
      this.addToHistory(status)
      this.$set(this.product._source, 'prep_status', status)

      setTimeout(() => {
        this.prepa = false
        this.putFirstItemLast(product)
        this.$emit('prep', product)
      }, 300)
    },

    putFirstItemLast(product) {
      let tmpDisplayedItems = JSON.parse(JSON.stringify(this.currentOrderItems))
      let elementPos = tmpDisplayedItems.map(x => x._id).indexOf(product._id)

      // console.log(elementPos)
      // console.log(tmpDisplayedItems.length - 1)

      tmpDisplayedItems.push(tmpDisplayedItems.splice(elementPos, 1)[0])
      this.$store.commit('mvpPrep/mutate_currentOrderItems', tmpDisplayedItems)
    },

    incrementClick(product) {
      if (product._source.prep_status === '') {
        if (this.modeFilter === 'all') {
          this.$store.commit(
            'mvpPrep/mutate_itemsClicked',
            this.itemsClicked + 1
          )
        } else if (this.modeFilter === 'fresh') {
          this.$store.commit(
            'mvpPrep/mutate_itemsClickedFresh',
            this.itemsClickedFresh + 1
          )
          this.$store.commit(
            'mvpPrep/mutate_itemsClicked',
            this.itemsClicked + 1
          )
        } else if (this.modeFilter === 'dry') {
          this.$store.commit(
            'mvpPrep/mutate_itemsClickedDry',
            this.itemsClickedDry + 1
          )
          this.$store.commit(
            'mvpPrep/mutate_itemsClicked',
            this.itemsClicked + 1
          )
        }
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

.overflow-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/*
.item {
  margin-bottom: 5px;
}

 */
</style>
