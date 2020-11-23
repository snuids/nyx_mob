<template>
  <div class="my-display">
    <div v-if="loaded" class="">
      <SupplierInfos ref="SupplierInfoInstance" />

      <div>
        <Comment
          v-for="comment in allComments"
          :key="comment.id"
          :comment="comment"
          class="q-mb-xs"
        />
      </div>
    </div>

    <q-list v-if="loaded">
      <CartItem v-for="item in allItems" :key="item.id" :item="item" />
    </q-list>

    <div>
      <div class="q-my-md text-center">
        <q-btn
          label="Retour"
          icon="arrow_back_ios"
          color="primary"
          class="q-mx-md q-my-md"
          @click="backToList"
          size="md"
        />
        <q-btn
          v-if="loaded"
          label="Valider"
          icon-right="send"
          color="primary"
          class="q-mx-md q-my-md"
          @click="validateOrder"
          size="md"
          :disable="disableValidate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import SupplierInfos from 'components/custom/MvpPicking/SupplierInfos.vue'
import CartItem from 'components/custom/MvpPicking/CartItem.vue'
import Comment from 'components/custom/MvpPicking/Comment.vue'

Vue.component('SupplierInfos', SupplierInfos)
Vue.component('CartItem', CartItem)
Vue.component('Comment', Comment)

export default {
  name: 'PurchaseOrderDisplay',
  components: {
    SupplierInfos,
    CartItem
  },
  data() {
    return {
      allItems: [],
      allComments: [],
      disableValidate: true,
      loaded: false
    }
  },
  methods: {
    getPurchaseOrder() {
      var url =
        this.$store.getters.apiurl +
        'generic/' +
        this.$store.state.pickingModule.currentOrder.meta.index +
        '/' +
        this.$store.state.pickingModule.currentOrder.meta.id +
        '?token=' +
        this.$store.getters.creds.token
      //console.log('url: ', url)

      this.$q.loading.show()
      // this.timer = setTimeout(() => { this.timer = void 0 }, 4500)
      axios
        .get(url)
        .then(response => {
          console.log('FULL RESPONSE : ', response)

          var currentOrder = this.$store.state.pickingModule.currentOrder

          var cart = Array.from(
            JSON.parse(response.data.data._source.line_items)
          )
          //console.log("var cart : ", cart);
          var totItems = cart.length
          var totProducts = 0
          for (var i = 0; i < cart.length; i++) {
            totProducts += cart[i].quantity
          }
          this.allItems = cart

          this.allComments = []
          if (response.data.data._source.hasOwnProperty('comments')) {
            this.allComments = Array.from(
              JSON.parse(response.data.data._source.comments)
            )
          }
          console.log('allComments POST TRAITEMENT ', this.allComments)

          this.$store.commit('mutate_currentOrder', {
            order: {
              meta: {
                id: currentOrder.meta.id,
                index: currentOrder.meta.index
              },
              details: {
                name: response.data.data._source.clean_name,
                address_line_1: response.data.data._source.address_line_1,
                address_line_2: response.data.data._source.address_line_2,
                post_code: response.data.data._source.post_code,
                city: response.data.data._source.city,
                contact_name: response.data.data._source.sales_contact_name,
                contact_email: response.data.data._source.sales_contact_email,
                contact_phone: response.data.data._source.sales_phone_number,
                status: response.data.data._source.status,
                number: response.data.data._source.number,
                supplier_id: response.data.data._source.supplier_id,
                type: response.data.data._source.type,
                picker: response.data.data._source.picker,
                expected_date: response.data.data._source.expected_date,
                total_items: totItems,
                total_products: totProducts,
                comments: this.allComments
              },
              cart: {
                line_items: cart
              }
            }
          })

          // console.log(
          //   '#### POST COMMIT : ',
          //   this.$store.state.pickingModule.currentOrder
          // )

          this.timer = setTimeout(() => {
            this.timer = void 0
          }, 50)
          this.loaded = true

          this.$q.loading.hide()
        })
        .catch(error => {
          console.log(
            '(getPurchaseOrder()::GET) UN PROBLEME EST SURVENU : ',
            error
          )
          this.$q.loading.hide()
        })
    },
    backToList() {
      var o = { id: '', index: '' }
      this.$root.$emit('toggleDisplayEvent', o)
    },
    modifyQuantityReceived(item_tit, item_qty) {
      for (var i = 0; i < this.allItems.length; i++) {
        if (this.allItems[i].full_title == item_tit) {
          console.log('FOUND')
          this.allItems[i].received = item_qty
          console.log('DONE : ', this.allItems[i].received)

          this.$store.commit('mutate_currentOrder', {
            order: {
              cart: {
                line_items: this.allItems
              }
            }
          })
        }
      }
    },
    validateOrder() {}
  },
  created() {
    this.getPurchaseOrder()
  },
  beforeMount() {},
  computed: {}
}
</script>

<style lang="css">
.my-display {
  padding: 0px !important;
  border: none;
  max-width: 800px !important;
  margin-left: auto;
  margin-right: auto;
}
</style>
