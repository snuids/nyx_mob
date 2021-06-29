<template>
  <q-page-container>
    <q-page style="padding-top: 158px;">
      <div>
        <q-tab-panels animated v-model="tab" :keep-alive="true">
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
import ClientInfos from './ClientInfos'
import OrderInfos from './OrderInfos'
import { Loading } from 'quasar'
import _ from 'lodash'

export default {
  name: 'ShowOrder',
  components: {
    ItemsFilter,
    CallAction,
    OrderItems,
    OrderItem,
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
      'orders',
      'modeFilter'
    ]),

    filteredCurrentOrderItemsLength: function() {
      if (this.currentOrderItems == null) return 0

      if (this.modeFilter === 'fresh') {
        return this.freshItems.length
      } else if (this.modeFilter === 'dry') {
        return this.dryItems.length
      }
      return this.currentOrderItems.length
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
      setTimeout(() => {
        this.unlock()
        setTimeout(() => {
          let query = Object.assign({}, this.$route.query)
          delete query.showOrder
          this.$router.replace({ query })
          this.$router.push({
            query: { path: 'ordersList' }
          })
        }, 500)
      }, 200)
    },

    async unlock() {
      console.log('UNLOCK')
      this.$store.commit('mvpPrep/mutate_preparedItems', this.preparedProducts)
      if (this.preparedProducts.length > 0) {
        await this.$store.dispatch('mvpPrep/updateOrderItems', {
          line_items: this.preparedProducts
        })
      }
      await this.sendUnlockOrder()
      //this.$store.commit('mvpPrep/mutate_currentOrderItems', [])
      //await this.$store.dispatch('mvpPrep/getOrders')
    },

    async sendUnlockOrder() {
      let rembDry = this.currentOrderItems.filter(
        elt => !elt._source.fresh && elt._source.prep_status === 'remb'
      ).length
      let rembFresh = this.currentOrderItems.filter(
        elt => elt._source.fresh && elt._source.prep_status === 'remb'
      ).length
      let preparedDry = this.currentOrderItems.filter(
        elt => !elt._source.fresh && elt._source.prep_status === 'success'
      ).length
      let preparedFresh = this.currentOrderItems.filter(
        elt => elt._source.fresh && elt._source.prep_status === 'success'
      ).length

      if (
        rembDry + rembFresh + preparedFresh + preparedDry ===
        this.freshItems.length + this.dryItems.length
      ) {
        if (rembDry > 0 || rembFresh > 0) {
          this.currentOrder._source.prep_status = 'finishedWithRemb'
        } else {
          this.currentOrder._source.prep_status = 'finished'
        }
      } else if (
        this.currentOrderItems.filter(elt => elt._source.prep_status !== '')
          .length === 0
      ) {
        this.currentOrder._source.prep_status = ''
      } else if (rembDry + preparedDry === this.dryItems.length) {
        this.currentOrder._source.intermediaryStatus = 'sec'
        this.currentOrder._source.prep_status = 'unfinished'
      } else if (rembFresh + preparedFresh === this.freshItems.length) {
        this.currentOrder._source.intermediaryStatus = 'frais'
        this.currentOrder._source.prep_status = 'unfinished'
      } else {
        this.currentOrder._source.prep_status = 'unfinished'
      }

      this.currentOrder._source.lock = false
      this.currentOrder._source.updatedAt = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )

      await this.$store.dispatch({
        type: 'mvpPrep/updateOrder',
        data: this.currentOrder
      })

      console.log('mvpPrep/updateOrder')
    },

    preventNav(event) {
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
              // console.log('wooow')
            }
          }
        ],
        timeout: 300
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

      this.$store.dispatch({
        type: 'mvpPrep/updateOrder',
        data: this.currentOrder
      })
      console.log(
        'I have updated my order and this is its status ',
        this.currentOrder._source.prep_status
      )
    },

    async prepareData() {
      Loading.show({
        delay: 100
      })
      await this.$store.dispatch('mvpPrep/requestOrder', this.orderId)
      await this.updateOrderStatus()
      Loading.hide()
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
          }, 1000)
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
          }, 1000)
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
          }, 1000)
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
    window.removeEventListener('beforeunload', this.preventNav)
    this.$store.commit('mvpPrep/mutate_currentOrderItems', [])
    // this.unlock()
  },

  updated() {
    console.log(this.freshItems.length)
    console.log(this.dryItems.length)
  }
}
</script>

<style scoped>
.q-tab-active__label {
  font-weight: bold;
}
</style>
