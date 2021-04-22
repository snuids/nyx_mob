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
  <div>
    <StickyBanner></StickyBanner>
    <div class="flex flex-center column">
      <div class="text-h6">Commandes</div>
      <div
        class="row bg-blue-grey-2"
        style="min-height: 400px; width: 80%; padding: 24px;"
      >
        <div
          id="parent"
          class="fit row wrap justify-start items-start content-start"
          style="overflow: hidden;"
        >
          <p v-if="orders.length == 0">
            Pas de commandes ce jour ci
          </p>
          <div
            v-for="(order, idx) in orders"
            :key="idx"
            class="q-ma-md      bg-grey-6"
            style="overflow: auto;"
          >
            <q-card>
              <q-card-title> {{ order.orderNumber }}</q-card-title>

              <q-card-separator />

              <q-card-section> status : {{ order.status }}</q-card-section>
              <q-card-section> Client: {{ order.last_name }}</q-card-section>
              <q-card-section v-if="order.has_frais">
                Contient du frais</q-card-section
              >
              <q-card-section v-if="order.has_sec">
                Contient du sec</q-card-section
              >
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import StickyBanner from './MvpPicking/StickyBanner'

export default {
  components: {
    StickyBanner
  },

  name: 'MvpPrepOrders',
  data() {
    return {
      orders: [],
      queryList: {
        size: 5000,
        sort: [
          {
            date: {
              order: 'desc',
              unmapped_type: 'boolean'
            }
          }
        ],
        _source: {},
        query: {
          bool: {
            must: [
              {
                range: {
                  date: {
                    gte: '',
                    lte: ''
                  }
                }
              }
            ]
          }
        }
      },
      indice: 'dev_shopify_order'
    }
  },
  computed: {
    targetDate: function() {
      return this.$store.getters['mvp/targetDate']
    }
  },
  watch: {
    targetDate: {
      handler: function() {
        this.getOrders()
      },
      deep: true
    }
  },
  methods: {
    getOrders(dateObj = null) {
      if (dateObj === null) {
        this.queryList.query.bool.must[0].range.date.gte = this.targetDate.dateFrom
        this.queryList.query.bool.must[0].range.date.lte = this.targetDate.dateTo
      } else {
        this.queryList.query.bool.must[0].range.date.gte = dateObj.dateFrom
        this.queryList.query.bool.must[0].range.date.lte = dateObj.dateTo
      }

      var url =
        this.$store.getters.apiurl +
        'generic_search/' +
        this.indice +
        '?token=' +
        this.$store.getters.creds.token

      console.log(url)
      axios
        .post(url, this.queryList)
        .then(response => {
          this.orders = []
          for (let record of response.data.records) {
            let data = {
              id: record._id,
              orderNumber: record._source.order_number,
              has_frais: record._source.has_frais,
              has_sec: record._source.has_sec,
              last_name: record._source.last_name,
              status: record._source.financial_status
            }

            this.orders.push(data)
          }
        })
        .catch(error => console.error(error))
    }
  },
  mounted() {
    this.getOrders()
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
