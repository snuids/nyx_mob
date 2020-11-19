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
          :landscape="isLandscape"
        />
        <q-date
          v-if="target == 'range'"
          v-model="selection"
          range
          :landscape="isLandscape"
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
      maximizedToggle: true
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
        var clean = moment(this.selection).format('YYYY-MM-DDTHH:mm:ss+01:mm')
        var o = { fr: clean, to: clean }
      }
      if (this.target == 'range') {
        var cleanF = moment(this.selection.from).format(
          'YYYY-MM-DDTHH:mm:ss+01:mm'
        )
        var cleanT = moment(this.selection.to).format(
          'YYYY-MM-DDTHH:mm:ss+01:mm'
        )
        var o = { fr: cleanF, to: cleanT }
      }

      this.$emit('ok', { data: o })
      // or with payload: this.$emit('ok', { ... })
      this.hide()
    },
    onCancelClick() {
      this.hide()
    }
  },
  created() {
  },
  mounted() {
  },
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
