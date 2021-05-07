import axios from 'axios'

export default {
  namespaced: true,
  state: {
    serverUrl: 'https://app.nyx-mvp.ovh/api/v1',
    apiUrl: '/lambdas/4/save_line_items',
    apiKey: 'PREPKEY_39864873684',
    orders: null,
    currentOrder: {},
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
    }
  },
  actions: {
    getOrderItems({ state, commit, rootState }) {
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
          if (response.data.error != '') console.error('Get products error...')
          else {
            console.log(response.data.records)
            response.data.records.sort((a, b) =>
              a._source.loc > b._source.loc ? 1 : -1
            )
            console.log('sorted')
            console.log(response.data.records)
            commit('mutate_currentOrderItems', response.data.records)
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    updateOrderItems({ state, commit }, payload) {
      const url = state.serverUrl + state.apiUrl + '?apikey=' + state.apiKey
      // 'https://app.nyx-mvp.ovh/api/v1/lambdas/4/save_line_items?apikey=PREPKEY_39864873684'

      console.log(url)
      //payload:  {line_items: []}
      axios
        .post(url, payload)
        .then(res => {
          console.log(res)
          if (res.data.error != '') console.error('Send line items error...')
          else {
            commit('mutate_updated_items', res.data.records)
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    getOrders({ state, rootState, commit }, dateObj = null) {
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

      console.log('arnaud sent me to get the orders')
      axios
        .post(url, queryList1)
        .then(response => {
          commit('mutate_allOrders', response.data.records)
          console.log('the orders are here')
          console.log(state.orders)
        })
        .catch(error => console.error(error))
    }
  },
  getters: {
    allOrders: state => state.orders,
    orderItems: state => state.currentOrderItems,
    preparedItems: state => state.currentOrderPreparedItems,
    lock: state => state.currentOrder._source.lock
  }
}
