<template>
  <q-card flat square bordered :class="bgColor">
    <div class="row">
      <div class="col-xs-12 col-sm-7 ite-nam q-pa-xs" :style="textColor">
        {{ item.full_title }}
      </div>
      <div class="col-xs-12 col-sm-5 ite-ico flex justify-end ">
        <q-btn flat square label="DLC" :style="textColor" />
        <div class="row full-height items-center">
          <q-chip
            :color="bgChip"
            text-color="white"
            class="quantity-chip"
            size="16px"
            :style="outlineRed"
            @click="quantityProblem"
            clickable
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
          flat
          square
          :icon="checkIcon"
          @click="quantityIsFulfil"
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
      oulinedRed: '',
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

      this.$q
        .dialog({
          component: DialogBox,
          parent: this,
          target: slug,
          title: titles[slug],
          quantity: this.item.quantity
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
        this.outlineRed = ''
        this.checkIcon = 'check'
        this.isDisable = false
      } else if (this.item.received === this.item.quantity) {
        // this.chipText = this.item.quantity
        this.chipText = this.item.received
        this.bgColor = 'bg-green'
        this.textColor = 'color: white;'
        this.bgChip = 'green-8'
        this.outlineRed = ''
        this.checkIcon = 'check_circle_outline'
        this.isDisable = true
      } else if (this.item.received < this.item.quantity) {
        this.chipText = this.item.received + ' / ' + this.item.quantity
        this.bgColor = 'bg-red'
        this.textColor = 'color: white;'
        this.bgChip = 'red-9'
        this.outlineRed = ''
        this.checkIcon = 'cancel'
        this.isDisable = true
      } else if (this.item.received > this.item.quantity) {
        this.chipText = this.item.received + ' / ' + this.item.quantity
        this.bgColor = 'bg-green'
        this.textColor = 'color: white;'
        this.bgChip = 'green-8'
        this.outlineRed = 'border:solid #f44336 2px;'
        this.checkIcon = 'check_circle_outline'
        this.isDisable = true
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
