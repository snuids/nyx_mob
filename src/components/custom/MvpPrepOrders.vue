<template>
  <q-page>
    <div class="flex flex-center column">
      <div
        class="row justify-between q-mt-sm"
        style="min-height: 400px; width: 80%; padding: 24px;"
      >
        <div class="text-h6 q-py-lg">
          {{ ordersToDisplay.length }} commandes
        </div>
        <div class="q-pa-md q-gutter-y-sm">
          <q-toggle
            :label="filterHasFrais"
            color="green"
            false-value="Pas de frais"
            true-value="Frais"
            v-model="filterHasFrais"
            toggle-order="tf"
            @click="ordersToDisplay"
          ></q-toggle>
          <q-toggle
            :label="filterHasSec"
            color="green"
            false-value="Pas de Sec"
            true-value="Sec"
            v-model="filterHasSec"
            toggle-order="tf"
            @click="ordersToDisplay"
          ></q-toggle>
        </div>
        <div
          id="parent"
          class="fit row wrap justify-start items-start content-start"
          style="overflow: hidden;"
        >
          <p v-if="orders.length === 0">
            Pas de commandes ce jour ci
          </p>
          <div
            v-for="(order, idx) in ordersToDisplay"
            :key="idx"
            class="q-ma-md      bg-blue-grey-2"
            style="overflow: auto;"
          >
            <OrderCard :order="order" :products="products" />
          </div>
        </div>
      </div>
    </div>
    <q-page-sticky expand position="top">
      <StickyBanner></StickyBanner>
    </q-page-sticky>

    <router-view></router-view>
  </q-page>
</template>

<script>
import axios from 'axios'
import StickyBanner from './MvpPicking/StickyBanner'
import OrderCard from './mvpPrepOrders/OrderCard'
import ShowOrder from './mvpPrepOrders/ShowOrder'

export default {
  components: {
    StickyBanner,
    OrderCard,
    ShowOrder
  },

  name: 'MvpPrepOrders',
  data() {
    return {
      orders: [],
      products: [],
      filterHasSec: 'Sec',
      filterHasFrais: 'Frais',
      applyFilter: true,
      queryList1: {
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
      queryList2: {
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
      indiceOrders: 'dev_shopify_order',
      indiceProducts: 'dev_shopify_line_item'
    }
  },
  computed: {
    targetDate: function() {
      return this.$store.getters['mvp/targetDate']
    },
    ordersToDisplay: function() {
      let orderList
      if (this.filterHasFrais !== 'Frais') {
        orderList = this.orders.filter(order => !order.has_frais)
        if (this.filterHasSec !== 'Sec') {
          orderList = orderList.filter(order => !order.has_sec)
        }
      } else if (this.filterHasSec !== 'Sec') {
        orderList = this.orders.filter(order => !order.has_sec)
      } else if (
        this.filterHasFrais === 'Frais' &&
        this.filterHasSec === 'Sec'
      ) {
        orderList = this.orders.filter(
          order => order.has_sec || order.has_frais
        )
      }
      return orderList
    }
  },
  watch: {
    targetDate: {
      handler: function() {
        this.getOrders()
        this.getProducts()
      },
      deep: true
    }
  },
  methods: {
    getOrders(dateObj = null) {
      if (dateObj === null) {
        this.queryList1.query.bool.must[0].range.date.gte = this.targetDate.dateFrom
        this.queryList1.query.bool.must[0].range.date.lte = this.targetDate.dateTo
      } else {
        this.queryList1.query.bool.must[0].range.date.gte = dateObj.dateFrom
        this.queryList1.query.bool.must[0].range.date.lte = dateObj.dateTo
      }

      console.log(this.queryList1.query.bool.must[0].range.date.gte)

      const url =
        this.$store.getters.apiurl +
        'generic_search/' +
        this.indiceOrders +
        '?token=' +
        this.$store.getters.creds.token

      console.log(url)
      axios
        .post(url, this.queryList1)
        .then(response => {
          this.orders = []
          for (let record of response.data.records) {
            //console.table(record._source.product_list)
            let data = {
              id: record._id,
              orderNumber: record._source.order_number,
              has_frais: record._source.has_frais,
              has_sec: record._source.has_sec,
              last_name: record._source.last_name,
              status: record._source.financial_status,
              product_items: record._source.product_list
            }
            //this.$store.commit('mvpPrep/addProduct', data.product_items)

            this.orders.push(data)
          }
        })
        .catch(error => console.error(error))
    },
    getProducts(dateObj = null) {
      if (dateObj === null) {
        this.queryList2.query.bool.must[0].range.date.gte = this.targetDate.dateFrom.format(
          'YYYY/MM/DD'
        )
        this.queryList2.query.bool.must[0].range.date.lte = this.targetDate.dateTo.format(
          'YYYY/MM/DD'
        )
      } else {
        this.queryList2.query.bool.must[0].range.date.gte = dateObj.dateFrom.format(
          'YYYY/MM/DD'
        )
        this.queryList2.query.bool.must[0].range.date.lte = dateObj.dateTo.format(
          'YYYY/MM/DD'
        )
      }

      //console.log(this.queryList.query.bool.must[0].range.date.lte)

      const url =
        this.$store.getters.apiurl +
        'generic_search/' +
        this.indiceProducts +
        '?token=' +
        this.$store.getters.creds.token

      console.log(url)
      axios
        .post(url, this.queryList2)
        .then(response => {
          this.products = []
          for (let record of response.data.records) {
            //console.table(record._source.product_list)
            let data = {
              name: record._source.name,
              quantity: record._source.quantity,
              orderNumber: record._source.order
            }
            //this.$store.commit('mvpPrep/addProduct', data.product_items)

            this.products.push(data)
          }
          //console.table(this.products)
        })
        .catch(error => console.error(error))
    }
  },
  mounted() {
    this.getOrders()
    this.getProducts()
  }
}
</script>

<style>
li {
  list-style-type: none;
}

ul {
  padding-left: 0;
}
</style>
