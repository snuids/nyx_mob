<template>
  <q-item class="q-pa-none">
    <q-card square flat bordered :class="cardConfig()">
      <div class="row full-height" clickable @click="onCardClick" v-ripple>
        <div class="col-xs-2 col-sm-1 text-center date q-pa-sm">
          {{ expected_date | dateShort }}
        </div>
        <div class="col">
          <div class="row full-heigth justify-between">
            <div class="col-xs-12 col-sm-9 name q-pa-sm full-heigth">
              {{ supplier | uppercaseFirst }}
            </div>
            <div class="col-xs-12 col-sm-3 meta q-pa-sm full-heigth">
              <!-- {{ status }} -->
              <OrderTags
                :closed="closed"
                :cart_complete="cart_complete"
                :has_dlc="has_dlc"
                :picking_state="picking_state"
                :comments="anyComments"
                :has_direct="has_direct_product"
              />
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-item>
</template>

<script>
import Vue from 'vue'
import OrderTags from 'components/custom/MvpPicking/OrderTags.vue'

Vue.component('OrderTags', OrderTags)

export default {
  name: 'SupplierCard',
  props: {
    expected_date: {
      type: String,
      required: true
    },
    supplier: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    index: {
      type: String,
      required: true
    },
    closed: {
      type: Boolean,
      required: true
    },
    cart_complete: {
      type: Number,
      required: true
    },
    has_dlc: {
      type: Boolean,
      required: true
    },
    picking_state: {
      type: Number,
      required: true
    },
    comments: {
      type: String,
      required: true
    },
    has_direct_product: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      anyComments: false
    }
  },
  methods: {
    onCardClick() {
      var o = { id: this.id, index: this.index }
      // this.$root.$emit('toggleDisplayEvent', o)
      this.$root.$emit('displayOrderEvent', o)
    },
    cardConfig() {
      if (this.cart_complete === 0) {
        // cart_complete = 0 >>> missing item(s) in order or too much items
        return 'full-width q-py-sm bg-orange text-white'
      } else if (this.cart_complete === 1) {
        // cart_complete = 1 >>> order is fulfil
        return 'full-width q-py-sm bg-green text-white'
      } else if (this.cart_complete === 2) {
        // cart_complete = 2 >>> no information about order
        return 'full-width q-py-sm bg-white text-primary'
      }
    }
  },
  mounted() {
    var coms = Array.from(JSON.parse(this.comments))
    if (coms.length > 0) {
      this.anyComments = true
    }
  }
}
</script>

<style lang="css">
.meta {
  text-align: right;
  font-size: 1.2em;
}
.date {
  font-size: 1.2em;
}
.name {
  font-size: 1.2em;
}
</style>
