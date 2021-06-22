<template>
  <q-page-container>
    <q-page style="padding-top: 158px;">
      <div>
        <q-tab-panels animated v-model="tab">
          <q-tab-panel class="q-pa-none" name="articles">
            <OrderItems :preparedProducts="preparedProducts" />
          </q-tab-panel>
          <q-tab-panel name="resume">
            <OrderInfos style="padding-bottom: 80px" />
          </q-tab-panel>
          <q-tab-panel name="client">
            <ClientInfos />
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <q-page-sticky expand position="top" class="bg-blue-grey-1 q-pt-md">
        <div class="row full-width flex  q-px-lg items-center">
          <div class="col-4 justify-start items-center">
            <q-btn
              @click="goBackToList"
              icon="arrow_back_ios"
              size="md"
              class="bg-dark text-white"
              unelevated
              round
            />
          </div>

          <div class=" col-8 row justify-end items-center">
            <ItemsFilter />
          </div>
        </div>

        <div class="row full-width flex items-center q-px-lg q-mt-sm">
          <div
            v-if="currentOrder._source.to_customer === 'delivery'"
            class="col-8 row justify-start items-center text-dark"
            style="height: 100px;   "
          >
            <q-icon
              size="40px"
              name="directions_bike"
              class="bg-dark"
              style="border-radius: 50px; padding: 10px; color: white; width: 40px;"
            ></q-icon
            >&nbsp; &nbsp;
            <div class="row flex text-dark">
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
            class="col-8 row justify-start items-center"
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

          <div class="col-4 row justify-end text-white">
            <q-chip
              square
              size="xl"
              color="primary"
              text-color="white"
              class="q-ma-none q-py-lg q-px-sm"
              style="font-size:15px;font-weight:600;"
            >
              {{
                currentOrder._source.tags
                  .split(',')
                  .filter(elt => elt.includes('-'))[0]
              }}
            </q-chip>
          </div>
        </div>

        <div class="row full-width flex">
          <q-tabs
            active-bg-color="white"
            v-model="tab"
            dense
            class="row flex full-width justify-center items-center"
            indicator-color="white"
          >
            <q-tab
              class="row col-xs-4 justify-center text-dark"
              name="articles"
              label="Articles"
            />
            <q-tab
              class="row col-xs-4 justify-center text-dark"
              name="resume"
              label="Résumé"
            />
            <q-tab
              class="row col-xs-4 justify-center text-dark"
              name="client"
              label="Client"
            />
          </q-tabs>
        </div>
      </q-page-sticky>
      <q-page-sticky expand position="bottom">
        <div
          class="row full-width flex items-center text-white justify-center"
          style="box-shadow: 1px -3px 5px rgba(0, 0, 0, 0.2); background-color: #70B937"
        >
          <q-circular-progress
            show-value
            font-size="14px"
            :value="progress"
            :max="filteredCurrentOrderItemsLength"
            size="50px"
            :thickness="0.15"
            color="white"
            track-color="trackcolor"
            class="q-ma-md float-right"
          >
            {{
              Math.round((progress * 100) / filteredCurrentOrderItemsLength) ||
                0
            }}%
          </q-circular-progress>
          <span class="q-mr-md" style="font-size:18px">
            <b>{{ filteredCurrentOrderItemsLength - progress }}</b
            >&nbsp; produits restants <br />
          </span>
        </div>
      </q-page-sticky>
    </q-page>
  </q-page-container>
</template>

<script>
// TODO   <q-list-header>Files</q-list-header>

// TODO show if the internet connexion is low or inexistant
import OrderItems from './OrderItems'
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'
import CallAction from './CallAction'
import OrderItem from './OrderItem'
import ItemsFilter from './ItemsFilter'
import OrderTabs from './OrderTabs'
import ClientInfos from './ClientInfos'
import OrderInfos from './OrderInfos'
import { Loading, LoadingBar } from 'quasar'
import _ from 'lodash'

export default {
  name: 'ShowOrder',
  components: {
    ItemsFilter,
    CallAction,
    OrderItems,
    OrderItem,
    OrderTabs,
    ClientInfos,
    OrderInfos
  },
  data() {
    return {
      preparedProducts: [],
      filterHasSec: 'Sec',
      filterHasFrais: 'Frais',
      isEditing: false,
      open: false,
      openFresh: false,
      openDry: false,
      tab: 'articles'
    }
  },
  computed: {
    ...mapState('mvpPrep', [
      'currentOrderItems',
      'itemsClicked',
      'itemsClickedDry',
      'itemsClickedFresh',
      'currentOrder',
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

    filteredCurrentOrderItemsLength: function() {
      if (this.currentOrderItems == null) return 0

      return this.currentOrderItems.filter(element => {
        if (this.modeFilter === 'fresh') {
          return element._source.fresh
        } else if (this.modeFilter === 'dry') {
          return !element._source.fresh
        } else {
          return true
        }
      }).length
    },

    currentOrder: {
      get() {
        return this.$store.getters['mvpPrep/currentOrder']
      },
      set(newCurrentOrder) {
        this.$store.commit('mvpPrep/mutate_currentOrder', newCurrentOrder)
      }
    },
    progress() {
      console.log('you have entered progress computed')
      if (_.isEmpty(this.currentOrder)) {
        return 0
      }

      if (this.currentOrderItems == null || _.isEmpty(this.currentOrderItems))
        return 0

      return this.currentOrderItems
        .filter(element => {
          if (this.modeFilter === 'fresh') {
            return element._source.fresh
          } else if (this.modeFilter === 'dry') {
            return !element._source.fresh
          } else {
            return true
          }
        })
        .filter(element => {
          if (
            element._source.prep_status != null &&
            element._source.prep_status != ''
          )
            return true
          else return false
        }).length
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
      this.$router.replace({ query })
      this.$router.push({
        query: { path: 'ordersList' }
      })
    },

    async unlock() {
      console.log('I am in unlock so wowo that is amazing')
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
          message: 'Préparation frais terminée',
          icon: 'thumb_up'
        },
        {
          color: 'teal',
          message: 'Préparation sec terminée',
          icon: 'tag_faces'
        },
        {
          color: 'teal',
          message: 'Préparation terminée',
          icon: 'tag_faces'
        }
      ]
      const { color, textColor, multiLine, icon, message, avatar } =
        this.modeFilter === 'dry'
          ? alerts[1]
          : this.modeFilter === 'fresh'
          ? alerts[0]
          : alerts[2]

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
      Loading.show()
      await this.$store.dispatch('mvpPrep/requestOrder', this.orderId)
      await this.updateOrderStatus()
      await this.$store.dispatch('mvpPrep/getOrderItems')
      console.log('these are the items sent when the card was cliked')
      console.log(this.currentOrderItems)
    }
  },

  watch: {
    async $route(to, from) {
      await this.prepareData()
    },

    progress: function(newValue) {
      if (this.modeFilter === 'fresh') {
        if (
          newValue ===
            this.currentOrderItems.filter(elt => elt._source.fresh).length &&
          this.itemsClickedFresh > 0
        ) {
          this.showNotif('center')
          setTimeout(() => {
            this.goBackToList()
          }, 2500)
        }
        this.openFresh = true
      } else if (this.modeFilter === 'dry') {
        if (
          newValue ===
            this.currentOrderItems.filter(elt => !elt._source.fresh).length &&
          this.itemsClickedDry > 0
        ) {
          this.showNotif('center')
          setTimeout(() => {
            this.goBackToList()
          }, 2500)
        }
        this.openDry = true
      } else if (this.modeFilter === 'all') {
        if (
          newValue === this.currentOrderItems.length &&
          this.itemsClicked > 0
        ) {
          this.showNotif('center')
          setTimeout(() => {
            this.goBackToList()
          }, 2500)
        }
        this.open = true
      }
    }
  },

  beforeCreate() {
    this.$store.commit('mvpPrep/mutate_itemsClicked', 0)
    this.$store.commit('mvpPrep/mutate_itemsClickedDry', 0)
    this.$store.commit('mvpPrep/mutate_itemsClickedFresh', 0)
  },

  beforeMount() {
    window.addEventListener('beforeunload', this.preventNav)

    this.prepareData()
  },

  destroyed() {
    console.log('wow')
    window.removeEventListener('beforeunload', this.preventNav)
    this.unlock()
  }
}
</script>

<style scoped>
.q-tab-active__label {
  font-weight: bold;
}
</style>
