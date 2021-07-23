<template>
  <div>
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
          <q-btn
            v-if="item.has_dlc"
            flat
            square
            :label="dlcLabel"
            @click="dlcDate = true"
            :style="textColor"
            :disable="closed"
          />
          <div class="row full-height items-center">
            <q-chip
              :color="bgChip"
              text-color="white"
              class="quantity-chip"
              size="16px"
              :style="outlineRed"
              @click="quantityProblem = true"
              :clickable="!closed"
            >
              <div class="text-center full-width">
                {{ chipText }}
              </div>
            </q-chip>
          </div>

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

    <!--  DIALOG BOX [ dlcDate ]  -->
    <q-dialog v-model="dlcDate" full-width>
      <q-card class="q-pa-xs">
        <q-card-section class="row items-center">
          <div class="dialog-box-title">
            Choisir une date limite
          </div>
        </q-card-section>
        <q-card-section class="row flex-center">
          <q-date v-model="dlcDateSelection" :locale="myLocale" />
        </q-card-section>
        <q-card-section class="row flex-center">
          <q-btn
            flat
            label="Retirer DLC"
            @click="onDlcDelete"
            color="primary"
            v-close-popup
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn
            flat
            label="Valider"
            @click="onDlcDate"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--  DIALOG BOX [ modifyQuantity ]  -->
    <q-dialog v-model="quantityProblem" full-width>
      <QuantityAdjust
        :quantity="qty"
        :ordered="item.quantity"
        @quantityModified="onQuantityModified"
        @closeWindow="onCloseWindow"
      />
    </q-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import QuantityAdjust from 'components/custom/MvpPicking/QuantityAdjust.vue'

Vue.component('QuantityAdjust', QuantityAdjust)

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
      isDisable: false,
      dlcDate: false,
      dlcDateSelection: '',
      myLocale: {
        /* starting with Sunday */
        days: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
        daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
        months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split(
          '_'
        ),
        monthsShort: 'Jan_Fév_Mar_Avr_Mai_Jui_Jui_Aoû_Sep_Oct_Nov_Déc'.split(
          '_'
        )
      },
      dlcLabel: 'DLC',
      quantityProblem: false
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
      var o = { new_received: this.item.quantity, index: this.item_index }
      this.$emit('modifyReceived', o)
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
      }
    },
    setDlcLabel() {
      if (this.item.has_dlc) {
        this.dlcLabel = moment(this.item.dlc_date).format('DD/MM/YY')
      } else {
        this.dlcLabel = 'DLC'
      }
    },
    deleteItem() {
      var o = { index: this.item_index }
      this.$emit('deleteItem', o)
    },
    onDlcDate() {
      var o = {
        new_dlcDate: moment(this.dlcDateSelection, 'YYYY/MM/DD'),
        index: this.item_index
      }
      this.$emit('modifyDlc', o)
    },
    onDlcDelete() {
      var o = { index: this.item_index }
      this.$emit('deleteDlc', o)
    },
    onQuantityModified(event) {
      var o = { new_received: event.data, index: this.item_index }
      this.$emit('modifyReceived', o)
    },
    onCloseWindow() {
      this.quantityProblem = false
    }
  },
  created() {},
  mounted() {
    this.setChip()
    this.setDlcLabel()
  },
  updated() {
    this.setChip()
    this.setDlcLabel()
  },
  computed: {
    qty: function() {
      if (this.item.received !== '') return this.item.received
      else return this.item.quantity
    }
  }
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
