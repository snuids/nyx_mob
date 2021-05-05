<template>
  <q-page>
    <div class="flex flex-center column" v-if="orders">
      <div
        class="row justify-between q-mt-sm"
        style="min-height: 400px; width: 80%; padding: 24px;"
      >
        <div class="text-h6 q-pa-xl">
          {{ ordersToDisplay.length }} commandes
          <div class="float-right">
            <q-toggle
              :label="filterHasFrais"
              color="green"
              false-value="Pas de Frais"
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
        </div>
        <OrdersList :orders="ordersToDisplay" />
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
import OrdersList from './mvpPrepOrders/OrdersList'

export default {
  components: {
    OrdersList,
    StickyBanner
  },

  name: 'MvpPrepOrders',
  data() {
    return {
      products: [],
      filterHasSec: 'Sec',
      filterHasFrais: 'Frais',
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
    orders() {
      return this.$store.state.mvpPrep.orders
    },
    targetDate: function() {
      return this.$store.getters['mvp/targetDate']
    },
    ordersToDisplay: function() {
      let orderList
      if (this.filterHasFrais === 'Pas de Frais') {
        orderList = this.orders.filter(order => !order._source.has_frais)
        if (this.filterHasSec === 'Pas de Sec') {
          orderList = orderList.filter(order => !order._source.has_sec)
        }
      } else if (this.filterHasSec === 'Pas de Sec') {
        orderList = this.orders.filter(order => !order._source.has_sec)
      } else if (
        this.filterHasFrais === 'Frais' &&
        this.filterHasSec === 'Sec'
      ) {
        orderList = this.orders.filter(
          order => order._source.has_sec || order._source.has_frais
        )
      }
      return orderList
    }
  },
  watch: {
    targetDate: {
      handler: function() {
        this.getOrders()
        //this.getProducts()
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

      const url =
        this.$store.getters.apiurl +
        'generic_search/' +
        this.indiceOrders +
        '?token=' +
        this.$store.getters.creds.token
      this.$q.loading.show()
      axios
        .post(url, this.queryList1)
        .then(response => {
          this.$q.loading.hide()
          this.newOrders = []
          for (let record of response.data.records) {
            this.newOrders.push(record)
          }
          this.$store.commit('mvpPrep/mutate_allOrders', this.newOrders)
        })
        .catch(error => console.error(error))
    }

    /*
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
          this.$store.commit('mvpPrep/mutate_allItems', this.products)
          //console.table(this.products)
        })
        .catch(error => console.error(error))
    }

     */
  },

  created() {
    this.getOrders()
  },
  mounted() {
    //this.getProducts()
    const timer = this.$store.getters['mvp/timer'] * 1000
    this.interval = setInterval(
      function() {
        this.getOrders()
      }.bind(this),
      timer
    )
  },
  beforeDestroy() {
    clearInterval(this.interval)
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
