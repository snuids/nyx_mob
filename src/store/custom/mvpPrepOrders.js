import axios from 'axios'
import { Loading, LoadingBar } from 'quasar'
import { createLogger } from 'vuex'
import { Notify } from 'quasar'

export default {
  namespaced: true,
  state: {
    serverUrl: 'https://app.nyx-mvp.ovh/api/v1',
    apiUrl: '/lambdas/4/save_line_items',
    apiKey: 'PREPKEY_39864873684',
    lock_dry: false,
    lock_fresh: false,
    orders: [],
    itemsClicked: 0,
    itemsClickedFresh: 0,
    itemsClickedDry: 0,
    currentOrder: {},
    currentItem: {},
    currentOrderItems: null,
    modeFilter: 'all',
    currentOrderPreparedItems: null,
    updated_items: null,
    displayedItems: [],
    openFinishedOrders: false
  },

  mutations: {
    mutate_openFinishedOrders(state, payload) {
      state.openFinishedOrders = payload
    },
    mutate_displayedItems(state, payload) {
      console.log(payload)
      state.displayedItems = payload
    },
    mutate_itemsClicked: function(state, payload) {
      state.itemsClicked = payload
    },
    mutate_itemsClickedFresh: function(state, payload) {
      state.itemsClickedFresh = payload
    },
    mutate_itemsClickedDry: function(state, payload) {
      state.itemsClickedDry = payload
    },
    mutate_allOrders(state, payload) {
      state.orders = payload
    },
    mutate_currentOrderItems(state, payload) {
      state.currentOrderItems = payload
    },
    mutate_currentOrder(state, payload) {
      state.currentOrder = payload
    },
    mutate_currentItem(state, payload) {
      state.currentItem = payload
    },
    mutate_preparedItems(state, payload) {
      state.currentOrderPreparedItems = payload
    },
    mutate_updated_items(state, payload) {
      state.updated_items = payload
    },
    mutate_lockDry(state, payload) {
      state.lock_dry = payload
    },
    mutate_lockFresh(state, payload) {
      state.lock_fresh = payload
    },
    mutate_modeFilter(state, payload) {
      localStorage.modeFilter = payload
      state.modeFilter = payload
    }
  },

  actions: {
    getOrderItems({ state, commit, rootState }) {
      Loading.show({
        delay: 100
      })
      let mvpStore = rootState.mvp
      let url = rootState.apiurl
      let queryList2 = {
        size: 5000,
        sort: [
          {
            date: {
              order: 'desc',
              unmapped_type: 'boolean'
            }
          }
        ],
        _source: {},
        query: {
          bool: {
            must: [],
            filter: [
              {
                bool: {
                  should: [
                    {
                      match: {
                        order: ''
                      }
                    }
                  ],
                  minimum_should_match: 1
                }
              },
              {
                bool: {
                  must_not: [
                    {
                      match: {
                        isKit: true
                      }
                    }
                  ]
                }
              }
              /*
              {
                range: {
                  date: {
                    gte: '',
                    lte: ''
                  }
                }
              }

               */
            ],
            should: [],
            must_not: []
          }
        }
      }
      const indiceProducts = 'mvp_app_line_item'

      queryList2.query.bool.filter[0].bool.should[0].match.order =
        '#' + state.currentOrder._source.order_number.replace('#', '')
      url += 'generic_search/' + indiceProducts
      url += '?token=' + rootState.creds.token
      axios
        .post(url, queryList2)
        .then(response => {
          Loading.hide()
          if (response.data.error !== '') console.error('Get products error...')
          else {
            response.data.records.sort((a, b) => {
              if (a._source.loc > b._source.loc) return 1
              if (a._source.loc < b._source.loc) return -1
              if (a._source.name > b._source.name) return 1
              if (a._source.name < b._source.name) return -1
              return 0
            })
            let products = response.data.records
            for (let i in products) {
              if (products[i]._source.prep_status === undefined) {
                products[i]._source.prep_status = ''
              }
            }
            products.sort((a, b) => {
              if (
                a._source.prep_status === '' ||
                b._source.prep_status === ''
              ) {
                return b._source.prep_status !== '' ? -1 : 1
              } else if (
                a._source.prep_status === 'manq' ||
                b._source.prep_status === 'manq'
              ) {
                return b._source.prep_status !== 'manq' ? -1 : 1
              } else if (a._source.prep_status === 'remb') {
                return b._source.prep_status !== 'remb' ? -1 : 1
              }
            })
            commit('mutate_currentOrderItems', products)
          }
        })
        .catch(error => {
          Loading.hide()
          if (error.response) {
            // Request made and server responded
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
        })
    },
    requestOrder({ state, rootState }, id) {
      Loading.show({
        delay: 300
      })
      let url =
        rootState.apiurl +
        'generic/' +
        'mvp_app_order' +
        '/' +
        id +
        '?token=' +
        rootState.creds.token

      return axios
        .get(url)
        .then(response => {
          Loading.hide()
          // saving original order for later comparison,
          // and current order to work with
          console.log(response.data)
          let order = response.data.data
          state.currentOrder = order

          if (order._source.dryItems === undefined) {
            order._source.preparedDry = []
            order._source.preparedFresh = []
            order._source.missingFresh = []
            order._source.missingDry = []
            order._source.rembDry = []
            order._source.rembFresh = []
            order._source.lock = false
            order._source.prep_status = ''
          }
        })
        .catch(error => {})
    },
    updateOrderItems({ state, commit }, payload) {
      Loading.show({
        delay: 300
      })
      const url = state.serverUrl + state.apiUrl + '?apikey=' + state.apiKey
      console.log(url)
      //payload:  {line_items: []}
      axios
        .post(url, payload)
        .then(res => {
          Loading.hide()
          if (res.data.error !== '') console.error('Send line items error...')
          else {
            commit('mutate_updated_items', res.data.records)
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    getOrders({ state, rootState, commit }, dateObj = null) {
      console.log('getOrders')
      Loading.show({
        delay: 2000
      })
      const indiceOrders = 'mvp_app_order'
      const mvpStore = rootState.mvp
      let queryList1 = {
        size: 5000,
        sort: [
          {
            date: {
              order: 'desc',
              unmapped_type: 'boolean'
            }
          }
        ],
        _source: {},
        query: {
          bool: {
            must: [
              {
                range: {
                  date: {
                    gte: '',
                    lte: ''
                  }
                }
              }
            ]
          }
        }
      }
      if (dateObj === null) {
        queryList1.query.bool.must[0].range.date.gte =
          mvpStore.targetDate.dateFrom
        queryList1.query.bool.must[0].range.date.lte =
          mvpStore.targetDate.dateTo
      } else {
        queryList1.query.bool.must[0].range.date.gte = dateObj.dateFrom
        queryList1.query.bool.must[0].range.date.lte = dateObj.dateTo
      }
      const url =
        rootState.apiurl +
        'generic_search/' +
        indiceOrders +
        '?token=' +
        rootState.creds.token
      axios
        .post(url, queryList1)
        .then(response => {
          Loading.hide()
          let orders = response.data.records

          commit('mutate_allOrders', orders)
        })
        .catch(error => {
          Loading.hide()
          console.error(error)
        })
    },
    updateOrder({ state, rootState }, payload) {
      const url =
        rootState.apiurl +
        'generic/' +
        payload.data._index +
        '/' +
        payload.data._id +
        '?token=' +
        rootState.creds.token
      axios
        .post(url, payload.data._source)
        .then(res => {
          if (res.data.error !== '') {
            console.log('save object error')
          } else {
            console.log('save object success')
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },

  getters: {
    currentOrder: state => state.currentOrder,
    modeFilter: state => state.modeFilter,
    orders: state => state.orders,
    orderItems: state => state.currentOrderItems,
    preparedItems: state => state.currentOrderPreparedItems,
    lock: state => state.currentOrder._source.lock,
    freshItems: state =>
      state.currentOrderItems.filter(
        item => item._source.fresh || item._source.frais
      ),
    dryItems: state =>
      state.currentOrderItems.filter(
        item => !(item._source.fresh || item._source.frais)
      )
  }
}
