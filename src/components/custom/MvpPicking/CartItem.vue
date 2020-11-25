<template>
  <q-card flat bordered :class="bgColor">
    <div class="row">
      <div class="col-xs-12 col-sm-7 ite-nam q-pa-xs" :style="textColor">
        {{ item.full_title }}
      </div>
      <div class="col-xs-12 col-sm-5 ite-ico flex justify-end ">
        <q-btn flat square color="primary" label="DLC" />
        <div class="row full-height items-center">
          <q-chip
            color="primary"
            text-color="white"
            class="quantity-chip"
            size="16px"
          >
            <div class="text-center full-width">
              <!-- {{ item.received }} / {{ item.quantity }} -->
              {{ chipText }}
            </div>
            <!-- 666 / 666 -->
            <!-- 85px -->
          </q-chip>
        </div>

        <q-btn
          flat
          square
          color="primary"
          icon="priority_high"
          @click="quantityProblem"
        />
        <q-btn
          flat
          square
          color="primary"
          icon="check"
          @click="quantityIsFulfil"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'CartItem',
  data() {
    return {
      chipText: null,
      bgColor: 'white',
      textColor: 'primary'
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    item_index: {
      type: Number,
      required: true
    }
  },
  methods: {
    quantityIsFulfil() {
      // this.$parent.$parent.modifyQuantityReceived(
      //   this.item.full_title,
      //   this.item.quantity
      // )
      console.log('tu peux pas test : ', this.item_index)
      var o = { new_received: this.item.quantity, index: this.item_index }
      this.$emit('modifyReceived', o)
    },
    quantityProblem() {
      console.log('we need a box  for the quantity problem')
    },
    setChip() {
      if (this.item.received === '') {
        this.chipText = this.item.quantity
        this.bgColor = 'bg-white'
        this.textColor = 'color: #33F;'
      } else if (this.item.received === this.item.quantity) {
        // this.chipText = this.item.quantity
        this.chipText = this.item.received + '=' + this.item.quantity
        this.bgColor = 'bg-green'
        this.textColor = 'color: white;'
      } else {
        this.chipText = this.item.received + ' / ' + this.item.quantity
        this.bgColor = 'bg-orange'
        this.textColor = 'color: white;'
      }
    }
  },
  created() {},
  mounted() {
    this.setChip()
  },
  updated() {
    this.setChip()
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
.quantity-chip {
  min-width: 75px;
  width: 75px;
}
</style>
