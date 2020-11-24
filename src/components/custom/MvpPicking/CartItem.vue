<template>
  <div class="">
    <q-card flat bordered class="bg-white">
      <div class="row">
        <div class="col-xs-12 col-sm-7 ite-nam q-pa-xs">
          {{ item.full_title }}
        </div>
        <div class="col-xs-12 col-sm-5 ite-ico flex justify-end ">
          <q-btn flat square color="primary" label="DLC" />
          <!-- <QuantityItem :quantity="item.quantity" :received="item.received" /> -->
          <div class="row full-height items-center">
            <q-chip
              color="primary"
              text-color="white"
              class="quantity-chip"
              size="16px"
            >
              <div class="text-center full-width">
                <!-- {{ displayReceivedQuantity(item.received, item.quantity) }} -->
                {{ item.received }} / {{ item.quantity }}
              </div>
              <!-- 666 / 666 -->
              <!-- 85px -->
            </q-chip>
          </div>

          <q-btn flat square color="primary" icon="priority_high" />
          <q-btn
            flat
            square
            color="primary"
            icon="check"
            @click="quantityIsFulfil"
          />
        </div>
      </div>
      <!-- {{ item.full_title }} - {{ item.quantity }} -
      {{ item.received }} -->
    </q-card>
  </div>
</template>

<script>
import Vue from 'vue'
import QuantityItem from 'components/custom/MvpPicking/QuantityItem.vue'

Vue.component('QuantityItem', QuantityItem)

export default {
  name: 'CartItem',
  data() {
    return {}
  },
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    checkForFields() {
      if (!this.item.hasOwnProperty('received')) {
        console.log('own property == false')
        this.item.received = null
      }
    },
    displayReceivedQuantity(ir, iq) {
      if (ir == null) {
        return '. / ' + iq
      } else if (ir == iq) {
        return iq
      } else {
        return ir + ' / ' + iq
      }
    },
    quantityIsFulfil() {
      this.$parent.$parent.modifyQuantityReceived(
        this.item.full_title,
        this.item.quantity
      )
    }
  },
  created() {},
  mounted() {
    this.checkForFields()
  },
  computed: {}
}
</script>

<style>
.ite-nam {
  font-size: 1.3em;
}
.ite-ico {
  font-size: 1.3em;
}
.tst {
  top: 50%;
  position: relative;
  margin-top: -20px;
}
</style>
