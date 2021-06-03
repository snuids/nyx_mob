<template>
  <q-page v-if="currentOrderItems" style="padding-top: 200px">
    <div class="row text-h6 flex full-width"></div>

    <q-page-sticky expand position="top">
      <div class="row full-width flex bg-blue-grey-1 items-center">
        <div
          v-if="currentOrder._source.to_customer === 'delivery'"
          class="col-xs-8 col-md-3 row justify-center items-center"
          style="height: 100px;   "
        >
          <q-icon
            size="40px"
            name="directions_bike"
            style="background-color: black; border-radius: 50px; padding: 10px; color: white; width: 40px;"
          ></q-icon
          >&nbsp; &nbsp;
          <div class="row flex">
            <div class="col-xs-12" style="font-weight: bold;">
              #{{ orderId }}
              <br />
            </div>
            <div class="col-xs-12" style="font-weight: lighter">
              Livraison à vélo
            </div>
          </div>
        </div>

        <div
          v-if="currentOrder._source.to_customer === 'pickup'"
          class="col-xs-8 col-md-3 row justify-center items-center"
          style="height: 100px;   "
        >
          <q-icon
            size="40px"
            name="shopping_bag"
            style="background-color: black; border-radius: 50px; padding: 10px; color: white; width: 40px"
          ></q-icon
          >&nbsp; &nbsp;
          <div class="row flex">
            <div class="col-xs-12" style="font-weight: bold;">
              #{{ orderId }}
              <br />
            </div>
            <div class="col-xs-12" style="font-weight: lighter">
              Commande à récupérer
            </div>
          </div>
        </div>

        <div
          class="row col-xs-3 col-md-2 justify-center items-center text-white"
          style="border-radius: 10px;  height: 60px; background-color: #70B937; font-weight: bold"
        >
          {{
            currentOrder._source.tags
              .split(',')
              .filter(elt => elt.includes('-'))[0]
          }}
        </div>
        <div class="row col-xs-5 col-md-2 justify-end">
          <q-btn
            @click="goBackToList"
            icon="arrow_back_ios"
            style="margin-right: 60px"
            size="20px"
            unelevated
            round
          />
        </div>

        <div class="row col-xs-7 col-md-4 justify-center items-center">
          <ItemsFilter />
        </div>

        <div class="col-xs-12">
          <OrderTabs :prepared="preparedProducts" />
        </div>
      </div>
    </q-page-sticky>
    <q-page-sticky expand position="bottom">
      <div
        class="row full-width flex items-center text-white"
        style="box-shadow: 1px -3px 5px rgba(0, 0, 0, 0.2); background-color: #70B937"
      >
        <div class="row col-xs-6 justify-end">
          <q-circular-progress
            show-value
            font-size="12px"
            :value="progress"
            :max="this.currentOrderItems.length"
            size="50px"
            :thickness="0.15"
            color="white"
            track-color="grey-6"
            class="q-ma-md float-right"
            >{{
              Math.round((progress * 100) / currentOrderItems.length)
            }}%</q-circular-progress
          >
        </div>
        <div class="row col-xs-6 justify-start">
          {{ this.currentOrderItems.length - progress }} produits restants
        </div>
        <!---->
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script>
import OrderItems from './OrderItems'
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'
import CallAction from './CallAction'
import OrderItem from './OrderItem'
import ItemsFilter from './ItemsFilter'
import OrderTabs from './OrderTabs'
import _ from 'lodash'

export default {
  name: 'ShowOrder',
  components: { ItemsFilter, CallAction, OrderItems, OrderItem, OrderTabs },
  data() {
    return {
      preparedProducts: [],
      filterHasSec: 'Sec',
      filterHasFrais: 'Frais',
      isEditing: false,
      open: false
    }
  },
  computed: {
    ...mapState('mvpPrep', [
      'currentOrderItems',
      'itemsClicked',
      'displayedItems'
    ]),
    ...mapGetters(['creds']),
    ...mapGetters('mvpPrep', [
      'preparedItems',
      'freshItems',
      'dryItems',
      'preparedFresh',
      'preparedDry',
      'missingDry',
      'missingFresh',
      'rembDry',
      'rembFresh',
      'orders',
      'modeFilter'
    ]),
    currentOrder: {
      get() {
        return this.$store.getters['mvpPrep/currentOrder']
      },
      set(newCurrentOrder) {
        this.$store.commit('mvpPrep/mutate_currentOrder', newCurrentOrder)
      }
    },
    progress() {
      if (_.isEmpty(this.currentOrder)) {
        return 0
      }
      let alreadyMadeProgress
      // this is to make sure that values in store have been updated
      if (
        this.preparedFresh !== undefined &&
        this.currentOrder._id === this.orderId
      ) {
        alreadyMadeProgress =
          this.preparedDry.length +
          this.preparedFresh.length +
          this.rembDry.length +
          this.rembFresh.length
      } else {
        alreadyMadeProgress = this.itemsClicked
      }
      console.log('this is already made progress ', alreadyMadeProgress)
      console.log('these are the items clicked ', this.itemsClicked)
      return alreadyMadeProgress + this.itemsClicked
    },

    userName: function() {
      return this.creds.user.firstname
    }
  },
  props: ['orderId'],
  methods: {
    isFrais(item) {
      return item._source.fresh
    },

    goBackToList() {
      let query = Object.assign({}, this.$route.query)
      delete query.showOrder
      this.unlock()
      this.$router.replace({ query })
    },

    async unlock() {
      console.log('I am in unlock so wowo that is amazing')
      // console.table(this.preparedProducts)
      let fresh = this.preparedProducts.filter(
        product =>
          product._source.fresh && product._source.prep_status === 'success'
      )

      let dry = this.preparedProducts.filter(
        product =>
          !product._source.fresh && product._source.prep_status === 'success'
      )

      let manqFresh = this.preparedProducts.filter(
        product =>
          product._source.fresh && product._source.prep_status === 'manq'
      )

      let manqDry = this.preparedProducts.filter(
        product =>
          !product._source.fresh && product._source.prep_status === 'manq'
      )

      let rembFresh = this.preparedProducts.filter(
        product =>
          product._source.fresh && product._source.prep_status === 'remb'
      )

      let rembDry = this.preparedProducts.filter(
        product =>
          !product._source.fresh && product._source.prep_status === 'remb'
      )

      this.currentOrder._source.freshItems = this.freshItems
      this.currentOrder._source.dryItems = this.dryItems

      if (this.preparedFresh.length === 0) {
        this.currentOrder._source.preparedFresh = []
        this.updateArrayPreparedItems(
          fresh,
          this.currentOrder._source.preparedFresh
        )
      } else {
        this.updateArrayPreparedItems(
          fresh,
          this.currentOrder._source.preparedFresh
        )
      }

      if (this.preparedDry.length === 0) {
        this.currentOrder._source.preparedDry = []

        this.updateArrayPreparedItems(
          dry,
          this.currentOrder._source.preparedDry
        )
      } else {
        this.updateArrayPreparedItems(
          dry,
          this.currentOrder._source.preparedDry
        )
      }

      if (this.missingFresh.length === 0) {
        this.currentOrder._source.missingFresh = []
        this.updateArrayPreparedItems(
          manqFresh,
          this.currentOrder._source.missingFresh
        )
      } else {
        this.updateArrayPreparedItems(
          manqFresh,
          this.currentOrder._source.missingFresh
        )
      }

      if (this.missingDry.length === 0) {
        this.currentOrder._source.missingDry = []
        this.updateArrayPreparedItems(
          manqDry,
          this.currentOrder._source.missingDry
        )
      } else {
        this.updateArrayPreparedItems(
          manqDry,
          this.currentOrder._source.missingDry
        )
      }

      if (this.rembFresh.length === 0) {
        this.currentOrder._source.rembFresh = []
        this.updateArrayPreparedItems(
          rembFresh,
          this.currentOrder._source.rembFresh
        )
      } else {
        this.updateArrayPreparedItems(
          rembFresh,
          this.currentOrder._source.rembFresh
        )
      }

      if (this.rembDry.length === 0) {
        this.currentOrder._source.rembDry = []
        this.updateArrayPreparedItems(
          rembDry,
          this.currentOrder._source.rembDry
        )
      } else {
        this.updateArrayPreparedItems(
          rembDry,
          this.currentOrder._source.rembDry
        )
      }

      this.$store.commit('mvpPrep/mutate_preparedItems', this.preparedProducts)
      if (this.preparedProducts.length > 0) {
        console.log('we are going to updateOrders on the server')
        await this.$store.dispatch('mvpPrep/updateOrderItems', {
          line_items: this.preparedProducts
        })
      }
      await this.sendUnlockOrder()
      await this.$store.dispatch('mvpPrep/getOrders')
      // console.log(this.$store.state.mvpPrep.updated_items)
      // console.log(this.$store.getters['mvpPrep/preparedItems'])
    },

    async sendUnlockOrder() {
      console.log('i am in sendunlockorder')
      // console.table(this.currentOrder._source.rembFresh)
      // console.table(this.currentOrder._source.rembDry)
      // console.table(this.currentOrder._source.preparedDry)
      // console.table(this.currentOrder._source.preparedFresh)
      if (
        this.currentOrder._source.rembDry.length +
          this.currentOrder._source.rembFresh.length +
          this.currentOrder._source.preparedFresh.length +
          this.currentOrder._source.preparedDry.length ===
        this.freshItems.length + this.dryItems.length
      ) {
        if (
          this.currentOrder._source.rembDry.length > 0 ||
          this.currentOrder._source.rembFresh.length > 0
        ) {
          this.currentOrder._source.prep_status = 'finishedWithRemb'
        } else {
          this.currentOrder._source.prep_status = 'finished'
        }
      } else {
        // console.log('really wow you deceive me')
        this.currentOrder._source.prep_status = 'unfinished'
      }
      this.currentOrder._source.lock = false
      this.currentOrder._source.updatedAt = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )

      // console.log('bouton retour cliqué')
      /* UNCOMMENT TO COMMIT REAL UPDATE */
      // send the update request
      await this.$store.dispatch({
        type: 'mvpPrep/updateOrder',
        data: this.currentOrder
      })
      // console.log('sendunlockorder terminé')
    },

    updateArrayPreparedItems(preparedArray, arrayToInsertIn) {
      preparedArray.map(item =>
        this.addProductToPrepared(
          [
            this.currentOrder._source.preparedDry,
            this.currentOrder._source.missingDry,
            this.currentOrder._source.rembDry,
            this.currentOrder._source.preparedFresh,
            this.currentOrder._source.missingFresh,
            this.currentOrder._source.rembFresh
          ],
          arrayToInsertIn,
          item
        )
      )
    },

    addProductToPrepared(productsArray, arrayToInsertIn, product) {
      productsArray.forEach(products => {
        if (products === arrayToInsertIn) {
          console.log('ok equality between the two arrays')
          if (products.filter(item => item._id === product._id).length === 0) {
            arrayToInsertIn.push(product)
          }
        } else {
          if (products.filter(item => item._id === product._id).length > 0) {
            this.update(products, product)
            console.log('element removed from ', products)
          }
        }
      })
    },

    update(products, product) {
      const eltIdx = products.findIndex(elt => elt._id === product._id)
      products.splice(eltIdx, 1)
    },

    preventNav(event) {
      console.log('ENNNNNNNNNNDDDDDDDDD:::::::::::::::::::::::::')
      event.preventDefault()
      this.sendUnlockOrder()
      event.returnValue = ''
    },

    showNotif(position) {
      const alerts = [
        {
          color: 'green',
          message: "Wow! tu te dépasses aujourd'hui",
          icon: 'thumb_up'
        },
        {
          color: 'teal',
          message: 'Commande préparée avec succès',
          icon: 'tag_faces'
        }
      ]
      const { color, textColor, multiLine, icon, message, avatar } = alerts[
        Math.floor(Math.random() * 10) % alerts.length
      ]

      this.$q.notify({
        color,
        textColor,
        //icon: random > 30 ? icon : null,
        icon,
        message,
        position,
        avatar,
        multiLine,
        actions: [
          {
            handler: () => {
              console.log('wooow')
            }
          }
        ],
        timeout: 500
      })
    },

    updateOrderStatus() {
      this.currentOrder._source.prep_status = 'started'
      this.currentOrder._source.lock = true
      this.currentOrder._source.lock_type =
        this.modeFilter === 'fresh'
          ? 'fresh'
          : this.modeFilter === 'dry'
          ? 'dry'
          : 'none'
      this.currentOrder._source.updatedAt = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )
      console.log('lock type: ', this.currentOrder._source.lock_type)
      console.log('this is the current order on which ive clicked')
      /* UNCOMMENT TO COMMIT REAL UPDATE */
      // send the update request
      this.$store.dispatch({
        type: 'mvpPrep/updateOrder',
        data: this.currentOrder
      })
    },

    async prepareData() {
      /*
      console.log(this.orders)
      console.log(this.orderId)

       */

      await this.$store.dispatch('mvpPrep/requestOrder', this.orderId)
      await this.updateOrderStatus()
      await this.$store.dispatch('mvpPrep/getOrderItems')
      console.log('these are the items sent when the card was cliked')
      console.log(this.currentOrderItems)
    }
  },

  watch: {
    async $route(to, from) {
      this.$q.loading.show({
        message: 'Fetching data'
      })
      await this.prepareData()
      setTimeout(() => {
        this.$q.loading.hide()
      }, 500)
    },
    progress: function(newValue) {
      console.log('this is the progress: ', this.progress)
      if (newValue === this.currentOrderItems.length && this.open) {
        this.showNotif('center')
        setTimeout(() => {
          this.goBackToList()
        }, 2500)
      }
      this.open = true
    }
  },

  beforeCreate() {
    this.$store.commit('mvpPrep/mutate_itemsClicked', 0)
  },

  beforeMount() {
    window.addEventListener('beforeunload', this.preventNav)
    this.$q.loading.show({
      message: 'Fetching data',
      delay: 100
    })
    this.prepareData()
    this.$q.loading.hide()
  },

  destroyed() {
    console.log('wow')
    window.removeEventListener('beforeunload', this.preventNav)
    this.unlock()
  }
}
</script>

<style scoped></style>
