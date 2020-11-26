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
            'validated'
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
          // console.log('getPoList() full response : ', response)

          this.allPurchaseOrders = []
          for (var i = 0; i < response.data.records.length; i++) {
            this.allPurchaseOrders.push(response.data.records[i]._source)
            this.allPurchaseOrders[i].id = response.data.records[i]._id
            this.allPurchaseOrders[i].index = response.data.records[i]._index
          }
          // saving purchase orders list for later comparison
          this.original_allPurchaseOrders = this.allPurchaseOrders

          // console.log(
          //   'getPoList()::allPurchaseOrders: ',
          //   this.allPurchaseOrders
          // )

          // Checking for missing fields
          this.checkPurchaseOrderModel()

          // Saving in store
          this.$store.commit('mutate_allPurchaseOrders', {
            data: this.allPurchaseOrders
          })

          // UPDATING DISPLAY TRICK
          // var tmp = this.allPurchaseOrders;
          // this.allPurchaseOrders = null;
          // this.allPurchaseOrders = tmp;

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
    saveToServer() {
      // todo
    },
    checkPurchaseOrderModel() {
      //console.log('<============<< poList | checkPOmodel() >>============>')
      for (var i = 0; i < this.allPurchaseOrders.length; i++) {
        // console.log('Checking po[' + i + '] (start): ')

        // specifics po fields
        if (!this.allPurchaseOrders[i].hasOwnProperty('closed')) {
          // console.log("PO hasn't closed property. It's now created !")
          this.allPurchaseOrders[i].closed = false
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('cart_complete')) {
          // console.log("PO hasn't cart_complete property. It's now created !")
          this.allPurchaseOrders[i].cart_complete = 2
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('has_dlc')) {
          // console.log("PO hasn't has_dlc property. It's now created !")
          this.allPurchaseOrders[i].has_dlc = false
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('picking_state')) {
          // console.log("PO hasn't picking_state property. It's now created !")
          this.allPurchaseOrders[i].picking_state = 0
        }
        if (!this.allPurchaseOrders[i].hasOwnProperty('comments')) {
          // console.log("PO hasn't comments property. It's now created !")
          this.allPurchaseOrders[i].comments = []
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
          cart[j].dlc_date = ''
        }
      }

      // rebuild allPurchaseOrders array
      this.allPurchaseOrders[id].line_items = JSON.stringify(cart)
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
