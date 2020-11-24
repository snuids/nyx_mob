<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    :maximized="$q.platform.is.mobile ? maximizedToggle : false"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-dialog-plugin my-card">
      <q-card-section class="q-pt-xs">
        <div class="text-h6">{{ title }}</div>
      </q-card-section>
      <q-card-section class="q-pt-xs">
        <q-date
          v-if="target == 'date'"
          v-model="selection"
          :locale="myLocale"
          :landscape="isLandscape"
        />
        <q-date
          v-if="target == 'range'"
          v-model="selection"
          :locale="myLocale"
          range
          :landscape="isLandscape"
        />
        <q-input
          v-if="target == 'comment'"
          v-model="selection"
          filled
          type="textarea"
        />
        <QuantityAdjust v-if="target == 'other'" v-model="selection" />
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
        <q-btn color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import QuantityAdjust from 'components/custom/MvpPicking/QuantityAdjust.vue'

Vue.component('QuantityAdjust', QuantityAdjust)

export default {
  name: 'DialogBox',
  data() {
    return {
      selection: null,
      maximizedToggle: true,
      myLocale: {
        /* starting with Sunday */
        days: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
        daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
        months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split(
          '_'
        ),
        monthsShort: 'Jan_Fév_Mar_Avr_Mai_Jui_Jui_Aoû_Sep_Oct_Nov_Déc'.split(
          '_'
        ),
        firstDayOfWeek: 1
      }
    }
  },
  props: {
    target: String,
    title: String
  },

  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    onDialogHide() {
      this.$emit('hide')
    },
    onOKClick() {
      if (this.target == 'date') {
        var clean = moment(this.selection, 'YYYY/MM/DD').format(
          'YYYY-MM-DDTHH:mm:ss+01:mm'
        )
        var o = { fr: clean, to: clean }
      }
      if (this.target == 'range') {
        var cleanF = moment(this.selection.from, 'YYYY/MM/DD').format(
          'YYYY-MM-DDTHH:mm:ss+01:mm'
        )
        var cleanT = moment(this.selection.to, 'YYYY/MM/DD').format(
          'YYYY-MM-DDTHH:mm:ss+01:mm'
        )
        var o = { fr: cleanF, to: cleanT }
      }
      if (this.target == 'comment') {
        var o = { msg: this.selection }
      }

      this.$emit('ok', { data: o })
      // or with payload: this.$emit('ok', { ... })
      this.hide()
    },
    onCancelClick() {
      this.hide()
    }
  },
  created() {},
  mounted() {},
  computed: {
    isLandscape: function() {
      if (this.$store.state.pickingModule.screenSize.windowWidth > 1000)
        return false
      else if (
        this.$store.state.pickingModule.screenSize.windowWidth >
        this.$store.state.pickingModule.screenSize.windowHeight
      )
        return true
      else return false
    }
  }
}
</script>

<style>
.my-card {
  /* width: 1000px;
  max-width: 1500; */
}
</style>
