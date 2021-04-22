<template>
  <!-- <q-page class="flex bg-grey-5 row">
    <q-page-sticky expand position="top">
      <div class="bg-grey-8 full-width grey-banner">
        <div class="whole-container">
          <div class="text-white date-banner">
            <div class="text-center">
              Date :
            </div>
            <div class="menu-banner float-right"></div>
          </div>
        </div>
      </div>
    </q-page-sticky>
  </q-page> -->
  <StickyBanner></StickyBanner>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import StickyBanner from './MvpPicking/StickyBanner'

export default {
  name: 'MvpPrepOrders',
  components: { StickyBanner },
  computed: {
    today() {
      return moment()
    }
  },
  methods: {
    getOrders() {
      this.orders = [
        {
          orderNumber: 12863,
          status: 'jhesgfjhd',
          hasSec: true,
          hasFrais: false
        },
        {
          orderNumber: 12863,
          status: 'jhesgfjhd'
        },
        {
          orderNumber: 12863,
          status: 'jhesgfjhd'
        },
        {
          orderNumber: 12863,
          status: 'jhesgfjhd'
        },
        {
          orderNumber: 12863,
          status: 'jhesgfjhd'
        },
        {
          orderNumber: 12863,
          status: 'jhesgfjhd'
        }
      ]
    }
  }
}
</script>

<style>
.date-banner {
  font-size: 1.1em;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
}

.grey-banner {
  height: 32px;
}

.whole-container {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  display: flex;
}
</style>
