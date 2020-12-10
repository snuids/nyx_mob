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
        </q-list>
      </div>
      <q-page-sticky expand position="top">
        <TargetDate ref="TargetDateInstance" @dateChanged="onDateChanged" />
      </q-page-sticky>
    </q-page>
  </q-page-container>

  <!-- <div class="">
    <TargetDate ref="TargetDateInstance" />
    <div class="q-pa-none">
      <q-list class="supplier-list">
        <SupplierCard
          v-for="order in allPurchaseOrders"
          :key="order.id"
          v-bind="order"
        />
      </q-list>
    </div>
  </div> -->
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import TargetDate from 'components/custom/MvpPicking/TargetDate.vue'
import SupplierCard from 'components/custom/MvpPicking/SupplierCard.vue'

Vue.component('TargetDate', TargetDate)
Vue.component('SupplierCard', SupplierCard)

export default {
  name: 'PurchaseOrdersList',
  components: {
    TargetDate,
    SupplierCard
  },
  data() {
    return {
      // fullResponse: null,
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
            'picking_state',
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
      indice: 'purchase_order*'
    }
  },
  methods: {
    getPoList(dateObj = null) {
      if (dateObj === null) {
        this.queryList.query.bool.must[0].range.expected_date.gte = this.$store.getters.targetDate.dateFrom
        this.queryList.query.bool.must[0].range.expected_date.lte = this.$store.getters.targetDate.dateTo
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
          // var fullResponse = response
          console.log('getPoList() FULL RESPONSE : ', response)

          this.allPurchaseOrders = []
          for (var i = 0; i < response.data.records.length; i++) {
            this.allPurchaseOrders.push(response.data.records[i]._source)
            this.allPurchaseOrders[i].id = response.data.records[i]._id
            this.allPurchaseOrders[i].index = response.data.records[i]._index
          }
          // saving purchase orders list for later comparison
          this.original_allPurchaseOrders = this.allPurchaseOrders

          console.log(
            'getPoList()::allPurchaseOrders: ',
            this.allPurchaseOrders
          )

          // Checking for missing fields
          this.checkPurchaseOrderModel()
          this.orderTheOrders()

          // Saving in store
          this.$store.commit('mutate_allPurchaseOrders', {
            data: this.allPurchaseOrders
          })

          // UPDATING DISPLAY TRICK
          var tmp = this.allPurchaseOrders
          this.allPurchaseOrders = null
          this.allPurchaseOrders = tmp

          this.$q.loading.hide()
        })
        .catch(error => {
          //console.log('|getPoList()::POST| UN PROBLEME EST SURVENU : ', error)
          this.$q.loading.hide()
        })
    },
    onDateChanged(obj) {
      this.getPoList(obj)
    },
    checkPurchaseOrderModel() {
      //console.log('<============<< poList | checkPOmodel() >>============>')
      for (var i = 0; i < this.allPurchaseOrders.length; i++) {
        // console.log(
        //   'Checking po[' +
        //     i +
        //     '] (start): ' +
        //     this.allPurchaseOrders[i].supplier
        // )

        // specifics po fields
        if (!this.allPurchaseOrders[i].hasOwnProperty('closed')) {
          // console.log('Test hasOwn : ')
          this.allPurchaseOrders[i].closed = false
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('cart_complete')) {
          // console.log(
          //   'PO[' + i + "] hasn't cart_complete property. It's now created !"
          // )
          this.allPurchaseOrders[i].cart_complete = 2
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('has_dlc')) {
          // console.log(
          //   'PO[' + i + "] hasn't has_dlc property. It's now created !"
          // )
          this.allPurchaseOrders[i].has_dlc = false
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('picking_state')) {
          // console.log(
          //   'PO[' + i + "] hasn't picking_state property. It's now created !"
          // )
          this.allPurchaseOrders[i].picking_state = 0
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('comments')) {
          // console.log(
          //   'PO[' + i + "] hasn't comments property. It's now created !"
          // )
          this.allPurchaseOrders[i].comments = JSON.stringify(new Array())
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('has_direct_product')) {
          // console.log(
          //   'PO[' + i + "] hasn't comments property. It's now created !"
          // )
          this.allPurchaseOrders[i].has_direct_product = false
        }

        // line items fields check
        this.checkItemsModel(i)

        // console.log('Checking po[' + i + '] (end): ')
      }
    },
    checkItemsModel(id) {
      var cart = Array.from(JSON.parse(this.allPurchaseOrders[id].line_items))
      for (var j = 0; j < cart.length; j++) {
        // received property
        if (!cart[j].hasOwnProperty('received')) {
          // console.log("Item hasn't received property. It's now created !")
          cart[j].received = ''
        }

        // dlc & dlc_date properties
        if (cart[j].hasOwnProperty('dlc')) {
          // console.log(
          //   'Item has a dlc property. We need to create the dlc_date !'
          // )
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
      // console.log('Entering TWILIGHT ZONE')
      // console.log('AVANT : ', this.allPurchaseOrders)
      // take all orders with cart_complete 2
      var array_2 = []
      for (var i = 0; i < this.allPurchaseOrders.length; i++) {
        if (this.allPurchaseOrders[i].cart_complete === 2)
          array_2.push(this.allPurchaseOrders[i])
      }
      // console.log(' DEBUG array_2 : ', array_2)
      // then order them ascending
      array_2.sort(function(a, b) {
        var nameA = a.supplier.toLowerCase()
        var nameB = b.supplier.toLowerCase()
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
      // console.log(' DEBUG array_0 : ', array_0)
      // then order them ascending
      array_0.sort(function(a, b) {
        var nameA = a.supplier.toLowerCase()
        var nameB = b.supplier.toLowerCase()
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
      // console.log(' DEBUG array_1 : ', array_1)
      // then order them ascending
      array_1.sort(function(a, b) {
        var nameA = a.supplier.toLowerCase()
        var nameB = b.supplier.toLowerCase()
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

      // done
      // console.log('APRES : ', this.allPurchaseOrders)
      // console.log('Exiting TWILIGHT ZONE')
    }
  },
  mounted() {
    this.getPoList()
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
</style>
