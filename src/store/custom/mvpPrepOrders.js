import axios from 'axios'

export default {
  namespaced: true,
  state: {
    orders: [],
    items: [],
    currentOrder: {},
    currentItem: {},
    currentOrderItems: null
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
      const indiceProducts = 'dev_shopify_line_item'

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
            commit('mutate_currentOrderItems', response.data.records)
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
  getters: {
    allOrders: state => state.orders,
    orderItems: state => state.currentOrderItems,
    lock: state => state.currentOrder._source.lock
  }
}
