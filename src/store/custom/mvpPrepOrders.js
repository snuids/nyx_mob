import axios from 'axios'
import { Loading } from 'quasar'

export default {
  namespaced: true,
  state: {
    serverUrl: 'https://app.nyx-mvp.ovh/api/v1',
    apiUrl: '/lambdas/4/save_line_items',
    apiKey: 'PREPKEY_39864873684',
    lock_dry: false,
    lock_fresh: false,
    orders: [],
    currentOrder: {},
    currentOrderStatus: null,
    currentItem: {},
    currentOrderItems: null,
    currentOrderPreparedItems: null,
    updated_items: null
  },
  mutations: {
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
    mutate_currentOrderStatus(state, payload) {
      state.currentOrderStatus = payload
    },
    mutate_lockDry(state, payload) {
      state.lock_dry = payload
    },
    mutate_lockFresh(state, payload) {
      state.lock_fresh = payload
    }
  },
  actions: {
    getOrderItems({ state, commit, rootState }) {
      Loading.show({
        delay: 300
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
                range: {
                  date: {
                    gte: '',
                    lte: ''
                  }
                }
              }
            ],
            should: [],
            must_not: []
          }
        }
      }
      const indiceProducts = 'mvp_app_line_item'
      queryList2.query.bool.filter[1].range.date.gte = mvpStore.targetDate.dateFrom.format(
        'YYYY/MM/DD'
      )
      queryList2.query.bool.filter[1].range.date.lte = mvpStore.targetDate.dateTo.format(
        'YYYY/MM/DD'
      )
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
            response.data.records.sort((a, b) =>
              a._source.loc > b._source.loc ? 1 : -1
            )
            commit('mutate_currentOrderItems', response.data.records)
          }
        })
        .catch(error => {
          console.error(error)
        })
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
      Loading.show({
        delay: 300
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
          commit('mutate_allOrders', response.data.records)
          Loading.hide()
        })
        .catch(error => console.error(error))
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
    allOrders: state => state.orders,
    orderItems: state => state.currentOrderItems,
    preparedItems: state => state.currentOrderPreparedItems,
    lock: state => state.currentOrder._source.lock
  }
}
