<template>
  <div class="">
    <q-card flat bordered class="bg-white q-ma-xs q-pa-xs">
      <div class="row">
        <div class="col-xs-12 col-sm-8 ite-nam q-pa-sm">
          {{ item.full_title }}
        </div>
        <div class="col-xs-12 col-sm-4 ite-ico q-pa-sm text-right">
          <q-btn flat round color="primary" label="DLC" />
          <!-- <QuantityItem /> -->
          12 /12
          <q-btn flat round color="primary" icon="priority_high" />
          <q-btn flat round color="primary" icon="check" />
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
    zebi() {
      console.log('debug item ::::: ', this)
    }
  },
  created() {},
  computed: {}
}
</script>

<style>
.ite-nam {
  background-color: cornflowerblue;
  font-size: 1.3em;
}
.ite-ico {
  background-color: #fd0000;
  font-size: 1.3em;
}
</style>
