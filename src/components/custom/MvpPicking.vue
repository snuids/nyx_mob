<template>
  <q-page class="flex bg-grey-5 row">
    <q-resize-observer @resize="onResize" debounce="500" />
    <div v-if="!isPurchaseOrderDisplayed" class="bg-grey-2 full-width">
      <PurchaseOrdersList />
    </div>
    <div v-else class="bg-grey-2  full-width">
      <PurchaseOrderDisplay />
    </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import PurchaseOrdersList from 'components/custom/MvpPicking/PurchaseOrdersList.vue'
import PurchaseOrderDisplay from 'components/custom/MvpPicking/PurchaseOrderDisplay.vue'

Vue.component('PurchaseOrdersList', PurchaseOrdersList)
Vue.component('PurchaseOrderDisplay', PurchaseOrderDisplay)

export default {
  name: 'MvpPicking',
  components: {
    PurchaseOrdersList,
    PurchaseOrderDisplay
  },
  data() {
    return {
      leftDrawerOpen: false,
      isPurchaseOrderDisplayed: false
    }
  },
  methods: {
    createCustomStore() {
      //console.log("############ Creating a custom store ############");
      this.$store.registerModule('pickingModule', {
        state: {
          targetDate: {
            dateFrom: '',
            dateTo: '',
            dateFromShort: '',
            dateToShort: ''
          },
          currentOrder: {
            meta: {
              id: '',
              index: ''
            },
            details: {},
            cart: {}
          },
          allPurchaseOrders: {},
          screenSize: {
            windowHeight: '',
            windowWidth: '',
            appWidth: '',
            appHeight: ''
          },
          slack_api_key: ''
        },
        getters: {
          // exemple : this.$store.commit("targetDate", { dateObj: obj });
          // exemple : this.$store.state.pickingModule.date
          // exemple : this.$store.getters.targetDate
          // exemple : this.$store.getters.screenSize.windowHeight
          targetDate: state => state.targetDate,
          currentOrder: state => state.currentOrder,
          getOrderDetails: state => state.currentOrder.details,
          allPurchaseOrders: state => state.allPurchaseOrders,
          screenSize: state => state.screenSize,
          slackKey: state => state.slack_api_key
        },
        mutations: {
          mutate_screenSize(state, payload) {
            state.screenSize = payload.data
          },
          mutate_targetDate(state, payload) {
            state.targetDate = payload.dateObj
          },
          mutate_currentOrder(state, payload) {
            state.currentOrder = payload.order
          },
          mutate_allPurchaseOrders(state, payload) {
            state.allPurchaseOrders = payload.data
          }
        },
        actions: {
          async sendMessageToSlack({ commit }, payload) {
            console.log(payload)
            var firstLine = ''
            var mentionned = ''
            var title = ''
            var channel = ''

            // mentionned users string preparation
            var mentionned_UserList = JSON.parse(process.env.SLACK_MENTION)
            for (var i = 0; i < mentionned_UserList.length; i++) {
              if (i === mentionned_UserList.length - 1) {
                mentionned += mentionned_UserList[i].id
              } else {
                mentionned += mentionned_UserList[i].id + ' '
              }
            }

            // message building by type
            var poType = null
            if (payload.poType !== 'PO-NYX') poType = payload.poType

            if (payload.type === 'direct') {
              // building direct slack message
              channel = '#appro'
              title = "Message d'un ramasseur"
              firstLine =
                '[ ' +
                payload.user +
                ' | ' +
                moment(payload.date).format('DD/MM/YYYY') +
                ' ]\n' +
                payload.msg
            } else if (payload.type === 'po') {
              // building message from a producer
              channel = '#appro'
              title = 'Tournée de ramassage : ' + payload.supplier
              firstLine = '[ ' + payload.user + ' | ' + payload.supplier + ' | '
              if (poType !== null) {
                firstLine += poType + ' | '
              }
              firstLine +=
                moment(payload.date).format('DD/MM/YYYY') + ' ]\n' + payload.msg
            } else if (payload.type === 'problem') {
              // building report problem message
              channel = '#ramassage'
              title = 'Tournée de ramassage : problème reporté'
              firstLine = '[ ' + payload.user + ' | ' + payload.supplier + ' | '
              if (poType !== null) {
                firstLine += poType + ' | '
              }
              firstLine += moment(payload.date).format('DD/MM/YYYY') + ' ]'
            }

            var msg2send = [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: title
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: mentionned
                }
              },
              {
                type: 'section',
                text: {
                  type: 'plain_text',
                  text: firstLine
                }
              }
            ]

            // if payload.type = 'problem' we need to append the list of items
            // with problems
            if (payload.type === 'problem') {
              msg2send.push({ type: 'divider' })
              for (var i = 0; i < payload.problems.length; i++) {
                var toAdd = {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text:
                      '*Produit :* ' +
                      payload.problems[i].title +
                      '\n*Variant id :* ' +
                      payload.problems[i].variant +
                      '\n*Quantité reçue:* ' +
                      payload.problems[i].received +
                      ' / ' +
                      payload.problems[i].quantity
                  }
                }
                msg2send.push(toAdd)
              }
              msg2send.push({ type: 'divider' })
            }

            // >>>>>>>>>>>>>  msg depuis menu #appro
            // Message d'un ramasseur
            // [ Thierry | 17/11/2020 ]
            // msg

            // >>>>>>>>>>>>>  msg depuis un bon #appro
            // Tournée de ramassage : Les serres des pres
            // [ Thierry | Les serres des pres | PO-012 | 17/11/2020 ]
            // msg

            // >>>>>>>>>>>>>  msg auto si probleme de produit #ramassage
            // Tournée de ramassage : problème
            // [ Pierre | Faluch'truck | PO-NYX | 13/11/2020 ]
            // Il manque des produits :
            // ---------------------------------
            // Produit : Faluche Chti'luch (450g) (31788880134199)
            // Quantite reçue: 2 / 1
            //
            // Produit : Faluche Curry (450g) (31789190578231)
            // Quantite reçue: 2 / 1
            //
            // Produit : Faluche Vergeoise (200g) (31858294915127)
            // Quantite reçue: 1 / 0
            // ---------------------------------

            var slackObject = {
              channel: channel,
              blocks: msg2send
            }
            var slackUrl =
              payload.apiUrl +
              process.env.SLACK_URL +
              '?apikey=' +
              payload.apiKey

            console.log('SLACK URL PRE SEND', slackUrl)
            console.log('SLACK OBJ PRE SEND', slackObject)
            var result = axios.post(slackUrl, slackObject)
            // .then(response => {
            //   //console.log("SLACK MESSAGE PUSH response : ", response);
            //   // this.$q.notify({
            //   //   message: 'Message envoyé !',
            //   //   timeout: 5000,
            //   //   color: 'green'
            //   // })
            // })
            // .catch(error => {
            //   console.log(
            //     '| SLACK MESSAGE PUSH / POST | UN PROBLEME EST SURVENU : ',
            //     error
            //   )
            //   // this.$q.notify({
            //   //   message:
            //   //     'Un problème est survenu, veuillez re-essayer plus tard.',
            //   //   timeout: 5000,
            //   //   color: 'red'
            //   // })
            // })

            return result
          }
        }
      })
    },
    addEventListener() {
      // this.$root.$on('toggleDisplayEvent', event => {
      //   this.toggleDisplay(event)
      // })
      this.$root.$on('displayOrderEvent', event => {
        this.displayOrderEvent(event)
      })
      this.$root.$on('displayListEvent', event => {
        this.displayListEvent(event)
      })
    },
    removeEventListener() {
      // this.$root.$off('toggleDisplayEvent')
      this.$root.$off('displayOrderEvent')
      this.$root.$off('displayListEvent')
    },
    // toggleDisplay(event) {
    //   // this.currentOrderMeta = event
    //   this.$store.commit('mutate_currentOrder', {
    //     order: {
    //       meta: {
    //         id: event.id,
    //         index: event.index
    //       }
    //     }
    //   })
    //   this.isPurchaseOrderDisplayed = !this.isPurchaseOrderDisplayed
    // },
    displayOrderEvent(event) {
      this.$store.commit('mutate_currentOrder', {
        order: {
          meta: {
            id: event.id,
            index: event.index
          }
        }
      })
      this.isPurchaseOrderDisplayed = true
    },
    displayListEvent(event) {
      this.$store.commit('mutate_currentOrder', {
        order: {
          meta: {
            id: '',
            index: ''
          }
        }
      })
      this.isPurchaseOrderDisplayed = false
    },
    onResize(size) {
      var o = {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        appHeight: size.height,
        appWidth: size.width
      }
      this.$store.commit('mutate_screenSize', {
        data: o
      })
    }
  },
  beforeCreate() {
    if (this.$q.platform.is.mobile) {
      this.$q.fullscreen
        .request()
        .then(() => {
          console.log('Successfully going fullscreen')
        })
        .catch(err => {
          console.log('Unable to go fullscreen')
        })
    }
  },
  created() {
    console.log(
      'Slack token is in : ',
      this.$store.getters.activeApp.config.restApiKey
    ) // SLACK TOKEN
    console.log('User is : ', this.$store.getters.creds.user.id)
    console.log(
      'User is : ',
      this.$store.getters.creds.user.firstname +
        ' ' +
        this.$store.getters.creds.user.lastname
    )
    this.createCustomStore()
    this.addEventListener()
  },
  beforeMount() {},
  mounted() {},
  beforeDestroy() {
    this.removeEventListener()
    this.$store.unregisterModule('pickingModule')
  },
  destroyed() {
    if (this.$q.platform.is.mobile) {
      this.$q.fullscreen
        .exit()
        .then(() => {})
        .catch(err => {})
    }
  },
  computed: {}
}
</script>

<style></style>
