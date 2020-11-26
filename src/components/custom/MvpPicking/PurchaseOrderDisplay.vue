<template>
  <div class="my-display">
    <div v-if="loaded" class="">
      <SupplierInfos @addComment="onAddComment" />

      <div>
        <Comment
          v-for="comment in allComments"
          :key="comment.id"
          :comment="comment"
          class="q-mb-xs"
          @deleteComment="onDeleteComment"
        />
      </div>
    </div>

    <q-list v-if="loaded">
      <CartItem
        v-for="(item, index) in allItems"
        :key="item.id"
        :item_index="index"
        :item="item"
        @modifyReceived="onReceivedModified"
      />
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
import moment from 'moment'
import Comment from 'components/custom/MvpPicking/Comment.vue'
import CartItem from 'components/custom/MvpPicking/CartItem.vue'
import SupplierInfos from 'components/custom/MvpPicking/SupplierInfos.vue'

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
      originalOrder: null,
      currentOrder: null,
      allItems: [],
      allComments: [],
      disableValidate: true,
      loaded: false
    }
  },
  methods: {
    async getPurchaseOrder() {
      // get Order from the server
      this.$q.loading.show()
      await this.requestOrder()
      this.$q.loading.hide()

      // preparing items list
      this.allItems = Array.from(JSON.parse(this.currentOrder.line_items))
      var totItems = this.currentOrder.line_items.length
      var totProducts = 0
      for (var i = 0; i < this.allItems.length; i++) {
        totProducts += this.allItems[i].quantity
      }

      // Checking for missing fields
      this.checkPoMissingFields()
      this.checkCartMissingFields()

      // preparing comments list
      this.allComments = []
      if (this.currentOrder.hasOwnProperty('comments')) {
        this.allComments = Array.from(JSON.parse(this.currentOrder.comments))
      }

      // update the store
      this.$store.commit('mutate_currentOrder', {
        order: {
          meta: {
            id: this.$store.state.pickingModule.currentOrder.meta.id,
            index: this.$store.state.pickingModule.currentOrder.meta.index
          },
          details: {
            name: this.currentOrder.clean_name,
            address_line_1: this.currentOrder.address_line_1,
            address_line_2: this.currentOrder.address_line_2,
            post_code: this.currentOrder.post_code,
            city: this.currentOrder.city,
            contact_name: this.currentOrder.sales_contact_name,
            contact_email: this.currentOrder.sales_contact_email,
            contact_phone: this.currentOrder.sales_phone_number,
            status: this.currentOrder.status,
            number: this.currentOrder.number,
            supplier_id: this.currentOrder.supplier_id,
            type: this.currentOrder.type,
            picker: this.currentOrder.picker,
            expected_date: this.currentOrder.expected_date,
            total_items: totItems,
            total_products: totProducts,
            comments: this.allComments
          },
          cart: {
            line_items: this.allItems
          }
        }
      })

      // set loaded to true to render component
      this.loaded = true
    },
    requestOrder() {
      var url =
        this.$store.getters.apiurl +
        'generic/' +
        this.$store.state.pickingModule.currentOrder.meta.index +
        '/' +
        this.$store.state.pickingModule.currentOrder.meta.id +
        '?token=' +
        this.$store.getters.creds.token
      //console.log('url: ', url)

      return axios
        .get(url)
        .then(response => {
          // console.log('getPurchaseOrder() full response : ', response)

          // saving original order for later comparison,
          // and current order to work with
          this.originalOrder = Object.assign({}, response.data.data._source)
          this.currentOrder = response.data.data._source
        })
        .catch(error => {
          console.log(
            '[ [PurchaseOrderDisplay.vue] [requestOrder()] ] ::',
            error
          )
        })
    },
    sendOrderToServer() {
      // Change order status ?
      this.checkOrderStatus()

      // do we need to send a message on slack ?
      if (this.currentOrder.cart_complete === 0) {
        console.log('>> STILL TO DO << a message to slack')
      }

      // Update "updated_at" field (2020-10-21T01:00:01.408567+02:00)
      this.currentOrder.updated_at = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )

      // prepare currentOrder
      this.currentOrder.line_items = JSON.stringify(this.allItems)
      this.currentOrder.comments = JSON.stringify(this.allComments)

      // forge the query
      var updatedPurchaseOrder = {
        _index: this.$store.state.pickingModule.currentOrder.meta.index,
        _source: this.currentOrder,
        _id: this.$store.state.pickingModule.currentOrder.meta.id
      }

      // console.log(
      //   'updatedPurchaseOrder debug pre-send : ',
      //   updatedPurchaseOrder
      // )

      /* UNCOMMENT TO COMMIT REAL SAVES*/
      // send the update request
      // this.$store.commit({
      //   type: 'updateRecord',
      //   data: updatedPurchaseOrder
      // })

      // notify user
      this.$q.notify({
        message: 'Bon de commande sauvegardé',
        timeout: 2000,
        color: 'green'
      })
    },
    async backToList() {
      // console.log('<<<!! back to list !!>>>')
      // console.log('original:', this.originalOrder)
      // console.log('current:', this.currentOrder)

      // has something changed ?
      if (this.hasPurchaseOrderChanged()) {
        // submit updated data to server
        this.sendOrderToServer()
      }
      // then switch component
      this.$root.$emit('displayListEvent')
    },
    onReceivedModified(event) {
      // console.log(
      //   'onReceivedModified => je veux modifier une quantité recue !',
      //   event
      // )
      this.allItems[event.index].received = event.new_received
      // console.log('after qty updated : ', this.allItems[event.index].received)

      // QUICK REFRESH FIX
      var tmp = JSON.parse(JSON.stringify(this.allItems))
      this.allItems = null
      this.allItems = tmp
    },
    validateOrder() {},
    hasPurchaseOrderChanged() {
      // rebuild currentPurchaseOrder
      this.currentOrder.line_items = JSON.stringify(this.allItems)
      this.currentOrder.comments = JSON.stringify(this.allComments)

      return (
        JSON.stringify(this.currentOrder) != JSON.stringify(this.originalOrder)
      )
    },
    checkPoMissingFields() {
      // specifics po fields
      if (!this.currentOrder.hasOwnProperty('closed')) {
        // console.log("PO hasn't closed property. It's now created !")
        this.currentOrder.closed = false
      }
      if (!this.currentOrder.hasOwnProperty('cart_complete')) {
        // console.log("PO hasn't cart_complete property. It's now created !")
        this.currentOrder.cart_complete = 2
      }
      if (!this.currentOrder.hasOwnProperty('has_dlc')) {
        // console.log("PO hasn't has_dlc property. It's now created !")
        this.currentOrder.has_dlc = false
      }
      if (!this.currentOrder.hasOwnProperty('picking_state')) {
        // console.log("PO hasn't picking_state property. It's now created !")
        this.currentOrder.picking_state = 0
      }
      if (!this.currentOrder.hasOwnProperty('comments')) {
        // console.log("PO hasn't comments property. It's now created !")
        this.currentOrder.comments = JSON.stringify(new Array())
      }
    },
    checkCartMissingFields() {
      for (var i = 0; i < this.allItems.length; i++) {
        // received property
        if (!this.allItems[i].hasOwnProperty('received')) {
          // console.log("Item hasn't received property. It's now created !")
          this.allItems[i].received = ''
        }

        // dlc & dlc_date properties
        if (this.allItems[i].hasOwnProperty('dlc')) {
          // console.log(
          //   'Item has a dlc property. We need to create the dlc_date !'
          // )
          this.allItems[i].dlc_date = ''
        }
      }
    },
    onAddComment(event) {
      this.allComments.push(event)
    },
    onDeleteComment(event) {
      for (var i = 0; i < this.allComments.length; i++) {
        if (this.allComments[i].msg === event.msg) {
          this.allComments.splice(i, 1)
        }
      }
    },
    checkOrderStatus() {
      // console.log(' currentOrder => ', this.currentOrder)
      // console.log(' checkOrderStatus() - START')
      var flag = null
      // check every items
      for (var k = 0; k < this.allItems.length; k++) {
        // console.log(
        //   'item[' +
        //     k +
        //     '] ==> qty:' +
        //     this.allItems[k].quantity +
        //     '  rcv:' +
        //     this.allItems[k].received
        // )
        if (this.allItems[k].received === '') {
          flag += 0
        } else if (this.allItems[k].received === this.allItems[k].quantity) {
          flag += 1
        } else {
          flag += 2
        }
      }
      // results :
      // flag = 0   --> only empty strings -> picking has not started yet
      // flag = nb of items (k) -> every items has a good number
      // flag > nb of items -> there is some items with problems
      if (flag === 0) {
        this.currentOrder.cart_complete = 2
      } else if (flag === this.allItems.length) {
        this.currentOrder.cart_complete = 1
      } else {
        this.currentOrder.cart_complete = 0
      }
      // console.log(' checkOrderStatus() - END')
      // console.log(' currentOrder END checkOrderStatus=> ', this.currentOrder)
    }
  },
  created() {},
  beforeMount() {},
  mounted() {
    this.getPurchaseOrder()
  },
  computed: {
  }
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
