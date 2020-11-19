<template>
  <div class="">
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
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import axios from 'axios'
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
      fullResponse: null,
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
    getPoList() {
      this.queryList.query.bool.must[0].range.expected_date.gte = this.$store.getters.targetDate.dateFrom
      this.queryList.query.bool.must[0].range.expected_date.lte = this.$store.getters.targetDate.dateTo

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
          this.fullResponse = response
          //console.log('getPoList() full response : ', response)

          this.allPurchaseOrders = []
          for (var i = 0; i < response.data.records.length; i++) {
            this.allPurchaseOrders.push(response.data.records[i]._source)
            this.allPurchaseOrders[i].id = response.data.records[i]._id
            this.allPurchaseOrders[i].index = response.data.records[i]._index
          }
          // console.log(
          //   'getPoList()::allPurchaseOrders: ',
          //   this.allPurchaseOrders
          // )
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
    }
  },
  mounted() {
    //this.onToday();
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
