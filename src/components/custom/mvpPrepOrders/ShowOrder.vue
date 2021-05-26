<template>
  <q-page v-if="currentOrderItems" style="padding-top: 205px">
    <div class="row text-h6 flex full-width"></div>

    <OrderItems
      style="padding-bottom: 85px"
      :preparedProducts="preparedProducts"
    />

    <q-page-sticky expand position="top">
      <div class="row full-width flex bg-blue-grey-1 items-center text-h6">
        <div
          class="row col-xs-12 justify-center bg-green-7  items-center text-white"
          style="height: 100px; box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.2);"
        >
          <div class="row col-xs-6 justify-center">
            <q-btn
              :to="{ name: 'orders' }"
              icon="arrow_back_ios"
              style="margin-right: 60px"
              size="20px"
              unelevated
              round
            />
          </div>
          <div class="row col-xs-6 justify-start">
            {{ userName }}
          </div>
        </div>

        <div
          class="row flex col-xs-12 items-center"
          style="box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.2);"
        >
          <div
            class="col-xs-4 row justify-center items-center"
            style="height: 100px;   "
          >
            <q-icon
              size="40px"
              name="directions_bike"
              style="background-color: black; border-radius: 50px; padding: 10px; color: white; width: 40px"
            ></q-icon>
            &nbsp; &nbsp;
            <div class="row flex">
              <div class="col-xs-12" style="font-weight: bold;">
                #{{ orderId }} <br />
              </div>
              <div class="col-xs-12" style="font-weight: lighter">
                Livraison à vélo
              </div>
            </div>
          </div>

          <div
            class="row col-xs-4 justify-center items-center text-black "
            style="border-radius: 10px;  height: 60px;"
          >
            Aujourd'hui -
            {{ currentOrder._source.tags.split(',')[0].split('-')[0] }}
          </div>

          <div class="row col-xs-4 justify-center items-center">
            <ItemsFilter />
          </div>
        </div>
      </div>
    </q-page-sticky>
    <q-page-sticky expand position="bottom">
      <div
        class="row full-width flex items-center bg-blue-5 text-h6"
        style="box-shadow: 1px -3px 5px rgba(0, 0, 0, 0.2);"
      >
        <div class="row col-xs-6 justify-end ">
          <q-circular-progress
            show-value
            font-size="12px"
            :value="progress"
            :max="this.currentOrderItems.length"
            size="50px"
            :thickness="0.22"
            color="teal"
            track-color="grey-3"
            class="q-ma-md float-right"
          >
            {{ Math.round((progress * 100) / currentOrderItems.length) }}%
          </q-circular-progress>
        </div>
        <div class="row col-xs-6 justify-start ">
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

export default {
  name: 'ShowOrder',
  components: { ItemsFilter, CallAction, OrderItems, OrderItem },
  data() {
    return {
      preparedProducts: [],
      filterHasSec: 'Sec',
      filterHasFrais: 'Frais',
      isEditing: false
    }
  },
  computed: {
    ...mapState('mvpPrep', [
      'currentOrder',
      'currentOrderItems',
      'itemsClicked',
      'displayedItems'
    ]),

    progress() {
      let alreadyMadeProgress
      if (this.preparedFresh != undefined) {
        alreadyMadeProgress =
          this.preparedDry.length +
          this.preparedFresh.length +
          this.rembDry.length +
          this.rembFresh.length
      } else {
        alreadyMadeProgress = this.itemsClicked
      }
      return alreadyMadeProgress + this.itemsClicked
    },

    userName: function() {
      return this.creds.user.firstname
    },
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
      'rembFresh'
    ])
  },
  props: ['orderId'],
  methods: {
    isFrais(item) {
      return item._source.fresh
    },

    async unlock() {
      console.table(this.preparedProducts)
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
        await this.$store.dispatch('mvpPrep/updateOrderItems', {
          line_items: this.preparedProducts
        })
      }
      await this.sendUnlockOrder()
      await this.$store.dispatch('mvpPrep/getOrders')
      console.log(this.$store.state.mvpPrep.updated_items)
      console.log(this.$store.getters['mvpPrep/preparedItems'])
    },

    async sendUnlockOrder() {
      console.table(this.currentOrder._source.rembFresh)
      console.table(this.currentOrder._source.rembDry)
      console.table(this.currentOrder._source.preparedDry)
      console.table(this.currentOrder._source.preparedFresh)
      if (
        this.currentOrder._source.rembDry &&
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
          this.$store.commit('mvpPrep/mutate_currentOrderStatus', 'finished')
        }
      } else {
        console.log('really wow you deceive me')
        this.currentOrder._source.prep_status = 'unfinished'
      }
      this.currentOrder._source.lock = false
      this.currentOrder._source.updatedAt = moment().format(
        'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'
      )
      let newId = this.currentOrder._id.replace('#', '')
      // forge the query
      console.log('we are in sendunlockorder')
      console.log(this.currentOrder)
      /*
      const updatedOrder = {
        _index: this.$store.state.mvpPrep.currentOrder._index,
        _source: this.$store.state.mvpPrep.currentOrder._source,
        _id: newId
      }
      */
      console.log('bouton retour cliqué')
      //console.log(updatedOrder)
      /* UNCOMMENT TO COMMIT REAL UPDATE */
      // send the update request
      await this.$store.dispatch({
        type: 'mvpPrep/updateOrder',
        data: this.$store.state.mvpPrep.currentOrder
      })
      console.log('sendunlockorder terminé')
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
    }
  },

  watch: {
    filterHasSec(newFilter) {
      localStorage.filterHasSec = newFilter
    },
    filterHasFrais: function(newFilter) {
      localStorage.filterHasFrais = newFilter
    },
    progress: function(newValue) {
      if (newValue === this.currentOrderItems.length) {
        this.showNotif('center')
        setTimeout(() => {
          this.unlock().then(() =>
            this.$router.push({
              name: 'orders'
            })
          )
        }, 2000)
      }
    }
  },

  mounted() {
    if (localStorage.filterHasSec) {
      this.filterHasSec = localStorage.filterHasSec
    }
    if (localStorage.filterHasFrais) {
      this.filterHasFrais = localStorage.filterHasFrais
    }
  },

  created() {
    this.$store.commit('mvpPrep/mutate_itemsClicked', 0)
    this.$store.dispatch('mvpPrep/getOrderItems')
  },

  beforeMount() {
    window.addEventListener('beforeunload', this.preventNav)
  },

  async beforeRouteLeave(to, from, next) {
    await this.unlock()
    next()
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.preventNav)
  }
}
</script>

<style scoped></style>
