<template>
  <q-page-container>
    <q-page>
      <div class="q-pa-none">
        <q-list class="supplier-list">
          <SupplierCard
            v-for="order in allPurchaseOrders"
            :key="order.id"
            v-bind="order"
          />

          <!-- if no order found -->
          <template v-if="allPurchaseOrders.length === 0">
            <q-card class="bg-white fixed-center card-aucun">
              <q-card-section class="row">
                <div class="text-italic text-caption aucun">
                  Aucun bon de commande trouvé !
                </div>
              </q-card-section>
            </q-card>
          </template>
        </q-list>
      </div>
      <q-page-sticky expand position="top">
        <StickyBanner ref="StickyBannerInstance" />
      </q-page-sticky>
    </q-page>
  </q-page-container>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import StickyBanner from 'components/custom/MvpPicking/StickyBanner.vue'
import SupplierCard from 'components/custom/MvpPicking/SupplierCard.vue'

Vue.component('StickyBanner', StickyBanner)
Vue.component('SupplierCard', SupplierCard)

export default {
  name: 'PurchaseOrdersList',
  components: {
    StickyBanner,
    SupplierCard
  },
  data() {
    return {
      original_allPurchaseOrders: [],
      allPurchaseOrders: [],
      queryList: {
        size: 5000,
        sort: [
          {
            expected_date: {
              order: 'desc',
              unmapped_type: 'boolean'
            }
          }
        ],
        _source: {
          includes: [
            'number',
            'status',
            'type',
            'expected_date',
            'supplier',
            'line_items',
            'comment',
            'units_ordered',
            'units_received',
            'updated_at',
            'validated',
            'closed',
            'cart_complete',
            'has_dlc',
            'comments'
          ]
        },
        query: {
          bool: {
            must: [
              {
                range: {
                  expected_date: {
                    gte: '',
                    lte: ''
                  }
                }
              }
            ]
          }
        }
      },
      indice: 'purchase_order*',
      marker: false
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
        this.getPoList()
      },
      deep: true
    }
  },
  methods: {
    getPoList(dateObj = null) {
      if (dateObj === null) {
        this.queryList.query.bool.must[0].range.expected_date.gte = this.targetDate.dateFrom
        this.queryList.query.bool.must[0].range.expected_date.lte = this.targetDate.dateTo
      } else {
        this.queryList.query.bool.must[0].range.expected_date.gte =
          dateObj.dateFrom
        this.queryList.query.bool.must[0].range.expected_date.lte =
          dateObj.dateTo
      }

      var url =
        this.$store.getters.apiurl +
        'generic_search/' +
        this.indice +
        '?token=' +
        this.$store.getters.creds.token

      this.$q.loading.show()
      axios
        .post(url, this.queryList)
        .then(response => {
          this.allPurchaseOrders = []
          for (var i = 0; i < response.data.records.length; i++) {
            this.allPurchaseOrders.push(response.data.records[i]._source)
            this.allPurchaseOrders[i].id = response.data.records[i]._id
            this.allPurchaseOrders[i].index = response.data.records[i]._index
          }
          // saving purchase orders list for later comparison
          this.original_allPurchaseOrders = this.allPurchaseOrders

          // Checking for missing fields
          this.checkPurchaseOrderModel()

          this.allPurchaseOrders.forEach(element => {
            if (element.units_ordered && element.units_received) {
              if (element.units_received == 0) element.cart_complete = 0
              else if (element.units_received < element.units_ordered)
                element.cart_complete = 0
              else if (element.units_received >= element.units_ordered)
                element.cart_complete = 1
            }
          })

          this.orderTheOrders()

          // Saving in store
          this.$store.commit('mvp/mutate_allPurchaseOrders', {
            data: this.allPurchaseOrders
          })

          // UPDATING DISPLAY TRICK
          var tmp = this.allPurchaseOrders
          this.allPurchaseOrders = null
          this.allPurchaseOrders = tmp

          this.$q.loading.hide()
        })
        .catch(error => {
          this.$q.loading.hide()
        })
    },
    checkPurchaseOrderModel() {
      for (var i = 0; i < this.allPurchaseOrders.length; i++) {
        // specifics po fields
        if (!this.allPurchaseOrders[i].hasOwnProperty('closed')) {
          this.allPurchaseOrders[i].closed = false
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('cart_complete')) {
          this.allPurchaseOrders[i].cart_complete = 2
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('has_dlc')) {
          this.allPurchaseOrders[i].has_dlc = false
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('comments')) {
          this.allPurchaseOrders[i].comments = JSON.stringify(new Array())
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('has_direct_product')) {
          this.allPurchaseOrders[i].has_direct_product = false
        }

        // line items fields check
        this.checkItemsModel(i)
      }
    },
    checkItemsModel(id) {
      var cart = Array.from(JSON.parse(this.allPurchaseOrders[id].line_items))
      for (var j = 0; j < cart.length; j++) {
        // received property
        if (!cart[j].hasOwnProperty('received')) {
          cart[j].received = ''
        }

        // dlc & dlc_date properties
        if (cart[j].hasOwnProperty('dlc')) {
          if (!cart[j].hasOwnProperty('dlc_date')) {
            cart[j].dlc_date = ''
          }
        }

        if (cart[j].hasOwnProperty('direct_product')) {
          this.allPurchaseOrders[id].has_direct_product = true
        }
      }

      // rebuild allPurchaseOrders array
      this.allPurchaseOrders[id].line_items = JSON.stringify(cart)
    },
    orderTheOrders() {
      // take all orders with cart_complete 2
      var array_2 = []
      for (var i = 0; i < this.allPurchaseOrders.length; i++) {
        if (this.allPurchaseOrders[i].cart_complete === 2)
          array_2.push(this.allPurchaseOrders[i])
      }
      // ===> then order them by supplier name, ascending
      array_2.sort(function(a, b) {
        var nameA = a.supplier.toLowerCase()
        var nameB = b.supplier.toLowerCase()
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })
      // ===> finally order them by expected_date, ascending
      array_2.sort(function(a, b) {
        var nameA = moment(a.expected_date).format('YYYY/MM/DD')
        var nameB = moment(b.expected_date).format('YYYY/MM/DD')
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })

      // take all orders with cart_complete 0
      var array_0 = []
      for (var j = 0; j < this.allPurchaseOrders.length; j++) {
        if (this.allPurchaseOrders[j].cart_complete === 0)
          array_0.push(this.allPurchaseOrders[j])
      }
      // ===> then order them by supplier name, ascending
      array_0.sort(function(a, b) {
        var nameA = a.supplier.toLowerCase()
        var nameB = b.supplier.toLowerCase()
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })
      // ===> finally order them by expected_date, ascending
      array_0.sort(function(a, b) {
        var nameA = moment(a.expected_date).format('YYYY/MM/DD')
        var nameB = moment(b.expected_date).format('YYYY/MM/DD')
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })

      // take all orders with cart_complete 1
      var array_1 = []
      for (var k = 0; k < this.allPurchaseOrders.length; k++) {
        if (this.allPurchaseOrders[k].cart_complete === 1)
          array_1.push(this.allPurchaseOrders[k])
      }
      // ===> then order them by supplier name, ascending
      array_1.sort(function(a, b) {
        var nameA = a.supplier.toLowerCase()
        var nameB = b.supplier.toLowerCase()
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })
      // ===> finally order them by expected_date, ascending
      array_1.sort(function(a, b) {
        var nameA = moment(a.expected_date).format('YYYY/MM/DD')
        var nameB = moment(b.expected_date).format('YYYY/MM/DD')
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })

      // re assemble all orders with c_c 2 => c_c 0 => c_c 1
      this.allPurchaseOrders = []
      array_2.forEach(element => {
        this.allPurchaseOrders.push(element)
      })
      array_0.forEach(element => {
        this.allPurchaseOrders.push(element)
      })
      array_1.forEach(element => {
        this.allPurchaseOrders.push(element)
      })
    }
  },
  mounted() {
    this.getPoList()
    let timer = process.env.AUTO_REFRESH * 1000

    // automatic refresh every X ms
    this.interval = setInterval(
      function() {
        this.getPoList()
      }.bind(this),
      timer
    )
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style lang="css">
.supplier-list {
  padding: 0px !important;
  border: none;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.aucun {
  font-size: 1.3em;
  margin: 15px;
}
.card-aucun {
  width: 85%;
}
</style>
