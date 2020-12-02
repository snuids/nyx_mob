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
      />
    </q-list>

    <div v-if="loaded" class="flex-center tppt">
      <AddItem
        :supplierName="currentOrder.supplier"
        @addProduct="onProductAdded"
      />
    </div>

    <q-page-sticky expand position="top">
      <div
        v-if="loaded"
        class="full-width"
        style="max-width:800px; background-color: yellow;"
      >
        <div class="row">
          <div class="col-3 b-c">
            <q-btn
              unelevated
              class="full-width my-btn"
              padding="md lg"
              color="secondary"
              icon="arrow_back_ios"
              label="retour"
              @click="backToList"
            />
          </div>
          <div class="col-6 b-c">
            <!-- <SupplierInfos @addComment="onAddComment" /> -->
            <q-btn
              unelevated
              class="full-width my-btn"
              padding="md lg"
              color="primary"
              icon="face"
              :label="currentOrder.name | uppercaseFirst"
              @click="openWindow"
            />
          </div>
          <div class="col-3 b-c">
            <q-btn
              v-if="!isClosed"
              unelevated
              class="full-width my-btn"
              padding="md lg"
              color="secondary"
              icon-right="arrow_forward_ios"
              label="valider"
              @click="validateOrder"
              :disable="isValidateDisabled"
            />
            <q-btn
              v-else
              unelevated
              class="full-width my-btn"
              padding="md lg"
              color="secondary"
              icon-right="arrow_forward_ios"
              label="modifier"
              @click="modifyClosed"
            />
          </div>
        </div>
      </div>
    </q-page-sticky>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import AddItem from 'components/custom/MvpPicking/AddItem.vue'
import Comment from 'components/custom/MvpPicking/Comment.vue'
import CartItem from 'components/custom/MvpPicking/CartItem.vue'
import DialogBox from 'components/custom/MvpPicking/DialogBox.vue'
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
      isValidateDisabled: true,
      reportObject: null,
      isClosed: false
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

      // is this purchase order already closed ?
      if (this.currentOrder.closed) {
        this.isClosed = true
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

      console.log(
        'updatedPurchaseOrder debug pre-send : ',
        updatedPurchaseOrder
      )

      /* UNCOMMENT TO COMMIT REAL SAVES*/
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

      return true
    },
    async backToList() {
      // console.log('<<<!! back to list !!>>>')
      // console.log('original:', this.originalOrder)
      // console.log('current:', this.currentOrder)
      var timer = 50

      // has something changed ?
      if (this.hasPurchaseOrderChanged()) {
        // submit updated data to server
        await this.sendOrderToServer()
        timer = 500
      }
      // then switch component
      setTimeout(() => {
        this.$root.$emit('displayListEvent')
      }, timer)
    },
    async onReceivedModified(event) {
      // console.log(
      //   'onReceivedModified => je veux modifier une quantité recue !',
      //   event
      // )
      if (event.new_received > this.allItems[event.index].quantity) {
        if (
          await new Promise(resolve =>
            this.$q
              .dialog({
                title: 'Attention',
                message:
                  'La quantité reçue est supérieure à la quantité commandée. Veuillez valider cette action.',
                cancel: true,
                persistent: true
              })
              .onOk(() => resolve(true))
              .onCancel(() => resolve(false))
          )
        ) {
          this.allItems[event.index].received = event.new_received
          var tmp = JSON.parse(JSON.stringify(this.allItems))
          this.allItems = null
          this.allItems = tmp
        } else {
          this.allItems[event.index].received = ''
          var tmp = JSON.parse(JSON.stringify(this.allItems))
          this.allItems = null
          this.allItems = tmp
        }
      } else {
        this.allItems[event.index].received = event.new_received
      }
      // console.log('after qty updated : ', this.allItems[event.index].received)

      // QUICK REFRESH FIX
      var tmp = JSON.parse(JSON.stringify(this.allItems))
      this.allItems = null
      this.allItems = tmp

      // an item has just received a quantity, we need to check
      // if the order is complete or not
      this.isOrderComplete()
    },
    async validateOrder() {
      // console.log('ValidateOrder() - starting function')

      // checking if something is missing. If so, send a message on slack
      let rez = await this.isThereSomethingToReport()

      if (rez) {
        this.prepareForSlack()
        // console.log('need to report on slack ::=>> ', this.reportObject)
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
      // console.log('ValidateOrder() - ending function')

      // artificial waiting
      setTimeout(() => {
        this.$root.$emit('displayListEvent')
      }, 500)
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
    },
    isOrderComplete() {
      var flag = false
      for (var i = 0; i < this.allItems.length; i++) {
        // console.log('<===<< isOrderComplete >>===> ', this.allItems[i].received)
        if (this.allItems[i].received === '') {
          // console.log(
          //   '<===<< isOrderComplete :: item vide trouvé(' +
          //     i +
          //     '), on quitte >>===>',
          //   this.allItems[i]
          // )
          flag = true
          return
        }
      }
      // console.log(
      //   '<===<< isOrderComplete :: ALL ITEM HAS A QTY, WE NEED TO ENABLE VALIDATE BUTTON >>===> '
      // )
      this.isValidateDisabled = false
    },
    openDialogBox(slug) {
      var titles = {
        add: 'Ajouter un produit'
      }

      this.$q
        .dialog({
          component: DialogBox,
          parent: this,
          target: slug,
          title: titles[slug],
          supplier: this.currentOrder.supplier
        })
        .onOk(event => {
          //console.log('Dialog() => OK ', event.data)
          if (slug === 'add') {
            console.log(
              'je suis poDisplay.vue -> openDialogBox().onOk() :: ',
              event
            )
          }
        })
        .onCancel(() => {
          //console.log('Dialog() => Cancel')
        })
        .onDismiss(() => {
          //console.log('Dialog() => I am triggered on both OK and Cancel')
        })
    },
    onProductAdded(event) {
      console.log('Je suis purchaseOrderDisplay.vue -> onProductAdded ', event)
      console.log('DEBUG all Items ', this.allItems)

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
      } else {
        console.log(
          '!!! Cet item est deja dans la liste des produits !!! Ajout impossible'
        )
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
        await this.$store.dispatch('sendMessageToSlack', data)
        this.$q.notify({
          message: 'Message envoyé !',
          timeout: 5000,
          color: 'green'
        })
      } catch (er) {
        console.log('Something goes wrong when posting to slack : ', er)
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
          // console.log('>>>> OK')
          this.currentOrder.closed = false
          this.isClosed = false
          this.isValidateDisabled = false
        })
    },
    openWindow() {
      this.$q.dialog({
        component: SupplierInfos,
        parent: this,
        position: 'top',
        order: this.currentOrder
      })
    }
  },
  created() {},
  beforeMount() {},
  mounted() {
    this.getPurchaseOrder()
  },
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
  margin-top: 58px;
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
