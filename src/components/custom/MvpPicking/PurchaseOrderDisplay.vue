<template>
  <div class="my-display">
    <div v-if="loaded" class="">
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
        :closed="isClosed"
        @modifyReceived="onReceivedModified"
        @deleteItem="onDeleteItem"
        @modifyDlc="onDlcModified"
        @deleteDlc="onDlcDeleted"
      />
    </q-list>

    <div v-if="showAddItem" class="flex-center tppt">
      <AddItem
        :supplierName="currentOrder.supplier"
        @addProduct="onProductAdded"
      />
    </div>

    <q-page-sticky expand position="top">
      <div
        v-if="loaded"
        class="full-width q-pa-xs bg-primary"
        style="max-width:800px;"
      >
        <div class="row">
          <div class="col-3 b-c q-pa-xs">
            <q-btn
              unelevated
              class="full-width my-btn"
              padding="md lg"
              color="white"
              text-color="primary"
              icon="arrow_back_ios"
              :label="labelLeft"
              @click="backToList"
            />
          </div>
          <div class="col-6 b-c q-pa-xs">
            <q-btn
              unelevated
              class="full-width my-btn"
              padding="md lg"
              color="white"
              text-color="primary"
              icon="face"
              :label="labelMenu"
              @click="supplierInfoBox = true"
            />
          </div>
          <div class="col-3 b-c q-pa-xs">
            <q-btn
              v-if="!isClosed"
              unelevated
              class="full-width my-btn"
              padding="md lg"
              color="positive"
              icon-right="save"
              :label="labelRight"
              @click="validateOrder"
            />
            <q-btn
              v-else
              unelevated
              class="full-width my-btn"
              padding="md lg"
              color="white"
              text-color="primary"
              icon-right="create"
              :label="labelRightM"
              @click="modifyClosed"
            />
          </div>
        </div>
      </div>
    </q-page-sticky>

    <!--  DIALOG BOX [ SupplierInfo ]  -->
    <q-dialog v-model="supplierInfoBox" maximized>
      <SupplierInfos
        :order="currentOrder"
        @addComment="onAddComment"
        @closeSupplier="onCloseWindow"
      />
    </q-dialog>

    <!--  DIALOG BOX [ orderIsIncomplete ]  -->
    <q-dialog v-model="orderIncomplete" full-width persistent>
      <q-card class="q-pa-xs">
        <q-card-section class="row items-center">
          <div class="dialog-box-title">
            Attention
          </div>
        </q-card-section>
        <q-card-section class="row flex-center">
          <q-banner inline-actions rounded class="bg-orange text-white">
            <div class="text-weight-medium text-body1">
              Vous ne pouvez pas encore valider ce bon de commande.
            </div>
            <div class="text-weight-medium text-body1">
              Tous les produits doivent avoir une quantité avant de pouvoir
              valider un bon.
            </div>
          </q-banner>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="j'ai compris" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import AddItem from 'components/custom/MvpPicking/AddItem.vue'
import Comment from 'components/custom/MvpPicking/Comment.vue'
import CartItem from 'components/custom/MvpPicking/CartItem.vue'
import SupplierInfos from 'components/custom/MvpPicking/SupplierInfos.vue'

Vue.component('SupplierInfos', SupplierInfos)
Vue.component('CartItem', CartItem)
Vue.component('Comment', Comment)
Vue.component('AddItem', AddItem)

export default {
  name: 'PurchaseOrderDisplay',
  components: {
    SupplierInfos,
    CartItem,
    AddItem,
    Comment
  },
  data() {
    return {
      originalOrder: null,
      currentOrder: null,
      allItems: [],
      allComments: [],
      disableValidate: true,
      loaded: false,
      reportObject: null,
      isClosed: false,
      supplierInfoBox: false,
      orderIncomplete: false
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

      // counting items & products (direct product aren't counted)
      var totItems = 0
      for (var j = 0; j < this.allItems.length; j++) {
        if (this.allItems[j].direct_product === undefined) totItems += 1
      }
      var totProducts = 0
      for (var i = 0; i < this.allItems.length; i++) {
        if (this.allItems[i].direct_product === undefined) {
          totProducts += this.allItems[i].quantity
        }
      }
      this.currentOrder.total_items_ordered = totItems
      this.currentOrder.total_products_ordered = totProducts

      // Checking for missing fields
      this.checkPoMissingFields()
      this.checkCartMissingFields()

      // preparing comments list
      this.allComments = []
      if (this.currentOrder.hasOwnProperty('comments')) {
        this.allComments = Array.from(JSON.parse(this.currentOrder.comments))
      }

      // is this purchase order already closed ?
      if (this.currentOrder.closed) {
        this.isClosed = true
      }

      // update the store
      this.$store.commit('mvp/mutate_currentOrder', {
        order: {
          meta: {
            id: this.$store.state.mvp.currentOrder.meta.id,
            index: this.$store.state.mvp.currentOrder.meta.index
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
            total_items_ordered: totItems,
            total_products_ordered: totProducts,
            total_items_received: this.currentOrder.total_items_received,
            total_products_received: this.currentOrder.total_products_received,
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
        this.$store.state.mvp.currentOrder.meta.index +
        '/' +
        this.$store.state.mvp.currentOrder.meta.id +
        '?token=' +
        this.$store.getters.creds.token

      return axios
        .get(url)
        .then(response => {
          // saving original order for later comparison,
          // and current order to work with
          this.originalOrder = Object.assign({}, response.data.data._source)
          this.currentOrder = response.data.data._source
        })
        .catch(error => {})
    },
    sendOrderToServer() {
      // Change order status ?
      this.checkOrderStatus()

      // Update "updated_at" field (2020-10-21T01:00:01.408567+02:00)
      this.currentOrder.updated_at = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )

      // prepare currentOrder
      this.currentOrder.line_items = JSON.stringify(this.allItems)
      this.currentOrder.comments = JSON.stringify(this.allComments)

      // forge the query
      var updatedPurchaseOrder = {
        _index: this.$store.state.mvp.currentOrder.meta.index,
        _source: this.currentOrder,
        _id: this.$store.state.mvp.currentOrder.meta.id
      }

      /* UNCOMMENT TO COMMIT REAL UPDATE */
      // send the update request
      this.$store.commit({
        type: 'updateRecord',
        data: updatedPurchaseOrder
      })

      // notify user
      this.$q.notify({
        message: 'Bon de commande sauvegardé',
        timeout: 2000,
        color: 'green'
      })

      /* =========== LOGGING =========== */
      var logObject = {
        _index: 'pickupapp_log',
        _source: {
          id: this.$store.state.mvp.currentOrder.meta.id,
          date: moment(),
          user: this.$store.getters.creds.user.login,
          current_order: this.currentOrder,
          original_order: this.originalOrder,
          type: 'save_po'
        },
        _id: this.$store.state.mvp.currentOrder.meta.id + '_' + moment().unix()
      }

      /* UNCOMMENT TO COMMIT REAL UPDATE */
      this.$store.commit({
        type: 'updateRecord',
        data: logObject
      })

      return true
    },
    async backToList() {
      var timer = 50

      // has something changed ?
      if (this.hasPurchaseOrderChanged()) {
        // submit updated data to server
        await this.sendOrderToServer()
        timer = 1500
      }
      // then switch component
      setTimeout(() => {
        this.$root.$emit('displayListEvent')
      }, timer)
    },
    async onReceivedModified(event) {
      this.allItems[event.index].received = event.new_received

      // QUICK REFRESH FIX
      var tmp = JSON.parse(JSON.stringify(this.allItems))
      this.allItems = null
      this.allItems = tmp

      // an item has just received a quantity, we need to check
      // if the order is complete or not
      this.isOrderComplete()
    },
    async validateOrder() {
      // check if order is complete. if not, open a dialog box to say it must be
      // completed before saving data to  server.
      if (!this.isOrderComplete()) {
        this.orderIncomplete = true
      } else {
        // order is complete, we can proceed
        this.currentOrder.status = 'fully_collected'

        // count received items & products
        var totItemsReceived = 0
        for (var j = 0; j < this.allItems.length; j++) {
          totItemsReceived += 1
        }
        var totProductsReceived = 0
        for (var i = 0; i < this.allItems.length; i++) {
          totProductsReceived += this.allItems[i].received
        }
        this.currentOrder.total_items_received = totItemsReceived
        this.currentOrder.total_products_received = totProductsReceived

        // checking if something is missing. If so, send a message on slack
        let rez = await this.isThereSomethingToReport()

        if (rez) {
          this.prepareForSlack()
        }

        // mark the current order as "closed"
        this.currentOrder.closed = true

        // send order to server
        await this.sendOrderToServer()

        // notify user
        this.$q.notify({
          message: 'Bon de commande validé',
          timeout: 3000,
          color: 'green'
        })

        // then switch component
        // after artificial waiting
        setTimeout(() => {
          this.$root.$emit('displayListEvent')
        }, 500)
      }
    },
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
        this.currentOrder.closed = false
      }
      if (!this.currentOrder.hasOwnProperty('cart_complete')) {
        this.currentOrder.cart_complete = 2
      }
      if (!this.currentOrder.hasOwnProperty('has_dlc')) {
        this.currentOrder.has_dlc = false
      }
      if (!this.currentOrder.hasOwnProperty('dlc_date')) {
        this.currentOrder.dlc_date = ''
      }
      if (!this.currentOrder.hasOwnProperty('comments')) {
        this.currentOrder.comments = JSON.stringify(new Array())
      }
      if (!this.currentOrder.hasOwnProperty('total_items_received')) {
        this.currentOrder.total_items_received = 0
      }
      if (!this.currentOrder.hasOwnProperty('total_products_received')) {
        this.currentOrder.total_products_received = 0
      }
    },
    checkCartMissingFields() {
      for (var i = 0; i < this.allItems.length; i++) {
        // received property
        if (!this.allItems[i].hasOwnProperty('received')) {
          this.allItems[i].received = ''
        }

        // dlc & dlc_date properties
        if (this.allItems[i].hasOwnProperty('dlc')) {
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
      var flag = null
      var involvedItems = 0
      // check every items
      for (var k = 0; k < this.allItems.length; k++) {
        if (this.allItems[k].direct_product === undefined) {
          involvedItems++
          if (this.allItems[k].received === '') {
            flag += 0
          } else if (this.allItems[k].received === this.allItems[k].quantity) {
            flag += 1
          } else if (this.allItems[k].received < this.allItems[k].quantity) {
            flag += 2
          } else if (this.allItems[k].received > this.allItems[k].quantity) {
            flag += 1
          }
        }
      }
      // results :
      // flag = 0   --> only empty strings -> picking has not started yet
      // flag = nb of items (k) -> every items has a good number
      // flag > nb of items -> there is some items with problems
      if (flag === 0) {
        this.currentOrder.cart_complete = 2
        this.currentOrder.status = 'to_be_collected'
      } else if (flag === involvedItems) {
        this.currentOrder.cart_complete = 1
        this.currentOrder.status = 'fully_collected'
      } else {
        this.currentOrder.cart_complete = 0
        this.currentOrder.status = 'partially_collected'
      }
    },
    isOrderComplete() {
      var flag = true
      var stat = false
      for (var i = 0; i < this.allItems.length; i++) {
        if (this.allItems[i].direct_product === true) {
          if (this.allItems[i].received === 0) {
            // this directly added product hasn't been quantified yet
            flag = false
          }
        } else if (this.allItems[i].received === '') {
          flag = false
        }
      }
      return flag
    },
    onProductAdded(event) {
      // check if product isn't already in cart
      var flag = false
      for (var i = 0; i < this.allItems.length; i++) {
        if (this.allItems[i].full_title === event.data) flag = true
      }

      if (!flag) {
        var o = {
          full_title: event.data,
          product_id: null,
          quantity: 0,
          received: 0,
          variant_id: null,
          direct_product: true
        }
        this.allItems.push(o)
      }
    },
    onDeleteItem(event) {
      this.allItems.splice(event.index, 1)
    },
    isThereSomethingToReport() {
      var needReport = false
      this.reportObject = { less: [], more: [], new: [] }

      // 1. is there less products than expected
      for (var i = 0; i < this.allItems.length; i++) {
        if (this.allItems[i].received < this.allItems[i].quantity) {
          this.reportObject.less.push({
            title: this.allItems[i].full_title,
            quantity: this.allItems[i].quantity,
            received: this.allItems[i].received,
            sku_code: this.allItems[i].sku
          })
          needReport = true
        }
      }

      // 2. is there more products than expected
      for (var i = 0; i < this.allItems.length; i++) {
        if (this.allItems[i].received > this.allItems[i].quantity) {
          // reject any product created directly
          if (this.allItems[i].direct_product !== true) {
            this.reportObject.more.push({
              title: this.allItems[i].full_title,
              quantity: this.allItems[i].quantity,
              received: this.allItems[i].received,
              sku_code: this.allItems[i].sku
            })
            needReport = true
          }
        }
      }

      // 3. is there any products added directly on purchase order
      for (var i = 0; i < this.allItems.length; i++) {
        if (this.allItems[i].received > this.allItems[i].quantity) {
          // reject any product created directly
          if (this.allItems[i].direct_product === true) {
            this.reportObject.new.push({
              title: this.allItems[i].full_title,
              quantity: this.allItems[i].quantity,
              received: this.allItems[i].received
            })
            needReport = true
          }
        }
      }

      // return result
      return needReport
    },
    prepareForSlack() {
      var o = {}
      o.date = moment()
      o.user = this.$store.getters.creds.user.firstname
      o.apiUrl = this.$store.getters.apiurl
      o.apiKey = this.$store.getters.activeApp.config.restApiKey

      // specifics
      o.type = 'problem'
      o.supplier = this.currentOrder.supplier
      o.problems = this.reportObject
      o.poType = this.currentOrder.type

      this.sendToSlack(o)
    },
    async sendToSlack(data) {
      try {
        await this.$store.dispatch('mvp/sendMessageToSlack', data)
        this.$q.notify({
          message: 'Message envoyé !',
          timeout: 5000,
          color: 'green'
        })
      } catch (er) {
        this.$q.notify({
          message: 'Un problème est survenu, veuillez re-essayer plus tard.',
          timeout: 5000,
          color: 'red'
        })
      }
    },
    modifyClosed() {
      this.$q
        .dialog({
          title: 'Confirmez svp',
          message: 'Voulez-vous vraiment modifier ce bon déjà validé ?',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.currentOrder.closed = false
          this.isClosed = false
        })
    },
    onDlcModified(event) {
      this.allItems[event.index].dlc_date = event.new_dlcDate
      this.allItems[event.index].has_dlc = true
      this.currentOrder.has_dlc = true
    },
    onDlcDeleted(event) {
      this.allItems[event.index].dlc_date = ''
      this.allItems[event.index].has_dlc = false
      this.currentOrder.has_dlc = false
    },
    onCloseWindow() {
      this.supplierInfoBox = false
    }
  },
  created() {},
  beforeMount() {},
  mounted() {
    this.getPurchaseOrder()
  },
  computed: {
    labelMenu: function() {
      if (this.$store.getters['mvp/screenSize'].windowWidth < 600) {
        return ''
      } else {
        if (this.currentOrder.clean_name === undefined)
          return this.currentOrder.supplier
        else return this.currentOrder.clean_name
      }
    },
    labelLeft: function() {
      if (this.$store.getters['mvp/screenSize'].windowWidth < 600) {
        return ''
      } else {
        return 'retour'
      }
    },
    labelRight: function() {
      if (this.$store.getters['mvp/screenSize'].windowWidth < 600) {
        return ''
      } else {
        return 'valider'
      }
    },
    labelRightM: function() {
      if (this.$store.getters['mvp/screenSize'].windowWidth < 600) {
        return ''
      } else {
        return 'modifier'
      }
    },
    showAddItem: function() {
      if (this.loaded && !this.currentOrder.closed) return true
      else return false
    }
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
  margin-top: 75px;
}
.b-c {
  text-align: center;
}
.my-btn {
  border-radius: 0px !important;
}
.tppt {
  margin-left: auto;
  margin-right: auto;
}
</style>
