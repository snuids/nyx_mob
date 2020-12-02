<template>
  <q-card flat square bordered :class="bgColor">
    <div class="row q-py-sm">
      <div class="col-xs-12 col-sm-6 ite-nam q-pa-xs" :style="textColor">
        {{ item.full_title }}
      </div>
      <div class="col-xs-12 col-sm-6 ite-ico flex justify-end ">
        <q-btn
          disable
          flat
          square
          label="ajout"
          v-if="item.direct_product"
          :style="textColor"
        />
        <q-btn flat square label="DLC" :style="textColor" :disable="closed" />
        <div class="row full-height items-center">
          <q-chip
            :color="bgChip"
            text-color="white"
            class="quantity-chip"
            size="16px"
            :style="outlineRed"
            @click="quantityProblem"
            :clickable="!closed"
          >
            <div class="text-center full-width">
              <!-- {{ item.received }} / {{ item.quantity }} -->
              {{ chipText }}
            </div>
            <!-- 666 / 666 -->
            <!-- 85px -->
          </q-chip>
        </div>

        <!-- <q-btn
          flat
          square
          icon="priority_high"
          @click="quantityProblem"
          :style="textColor"
        /> -->
        <q-btn
          v-if="!item.direct_product"
          flat
          square
          :icon="checkIcon"
          @click="quantityIsFulfil"
          :style="textColor"
          :disable="isDisable"
        />
        <q-btn
          v-else
          flat
          square
          :icon="checkIcon"
          @click="deleteItem"
          :style="textColor"
          :disable="isDisable"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
import DialogBox from 'components/custom/MvpPicking/DialogBox.vue'

export default {
  name: 'CartItem',
  data() {
    return {
      chipText: null,
      bgColor: 'white',
      textColor: 'primary',
      bgChip: 'primary',
      outlineRed: 'border:none;',
      checkIcon: 'check',
      isDisable: false
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
    },
    closed: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    quantityIsFulfil() {
      // this.$parent.$parent.modifyQuantityReceived(
      //   this.item.full_title,
      //   this.item.quantity
      // )
      // console.log('tu peux pas test : ', this.item_index)
      var o = { new_received: this.item.quantity, index: this.item_index }
      this.$emit('modifyReceived', o)
    },
    quantityProblem() {
      var slug = 'qtyProblem'
      var titles = {
        qtyProblem: 'Modifier la quantité'
      }

      // received already set ?
      if (this.item.received !== '') var qty = this.item.received
      else var qty = this.item.quantity
      this.$q
        .dialog({
          component: DialogBox,
          parent: this,
          target: slug,
          title: titles[slug],
          quantity: qty
        })
        .onOk(event => {
          //console.log('Dialog() => OK ', event.data)
          if (slug === 'qtyProblem') {
            //console.log('retour de qty problem', event)
            var o = { new_received: event.data, index: this.item_index }
            this.$emit('modifyReceived', o)
          }
        })
        .onCancel(() => {
          //console.log('Dialog() => Cancel')
        })
        .onDismiss(() => {
          //console.log('Dialog() => I am triggered on both OK and Cancel')
        })
    },
    setChip() {
      if (this.item.received === '') {
        this.chipText = this.item.quantity
        this.bgColor = 'bg-white'
        this.textColor = 'color: #027be3;'
        this.bgChip = 'primary'
        this.outlineRed = 'border:none;'
        this.checkIcon = 'check'
        this.isDisable = false
      } else if (this.item.received === this.item.quantity) {
        // this.chipText = this.item.quantity
        this.chipText = this.item.received
        this.outlineRed = 'border:none;'
        if (this.item.direct_product === true) {
          this.bgColor = 'bg-white'
          this.textColor = 'color: #027be3;'
          this.bgChip = 'primary'
          this.checkIcon = 'backspace'
          if (this.closed) this.isDisable = true
          else this.isDisable = false
        } else {
          this.bgColor = 'bg-green'
          this.textColor = 'color: white;'
          this.bgChip = 'green-8'
          this.checkIcon = 'check_circle_outline'
          this.isDisable = true
        }
        // this.checkIcon = 'check_circle_outline'
        // this.isDisable = true
      } else if (this.item.received < this.item.quantity) {
        this.chipText = this.item.received + ' / ' + this.item.quantity
        this.bgColor = 'bg-red'
        this.textColor = 'color: white;'
        this.bgChip = 'red-9'
        this.outlineRed = 'border:none;'
        this.checkIcon = 'cancel'
        this.isDisable = true
      } else if (this.item.received > this.item.quantity) {
        this.chipText = this.item.received + ' / ' + this.item.quantity
        this.bgColor = 'bg-green'
        this.textColor = 'color: white;'
        this.bgChip = 'green-8'
        this.outlineRed = 'border:solid #f44336 2px;'
        if (this.item.direct_product === true) {
          this.checkIcon = 'backspace'
          if (this.closed) this.isDisable = true
          else this.isDisable = false
        } else {
          this.checkIcon = 'check_circle_outline'
          this.isDisable = true
        }
        // this.checkIcon = 'check_circle_outline'
        // this.isDisable = true
      }
    },
    deleteItem() {
      console.log('deleteeeeeeeeee')
      var o = { index: this.item_index }
      this.$emit('deleteItem', o)
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
