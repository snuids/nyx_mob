import axios from 'axios'

export default {
  namespaced: true,
  state: {
    orders: [],
    items: [],
    currentOrder: {},
    currentItem: {},
    currentOrderItems: [],
  },
  mutations: {
    mutate_allOrders(state, payload) {
      state.orders = payload
    },
    mutate_allItems(state, payload) {
      state.items = payload
    },
    mutate_currentOrder(state, payload) {
      state.currentOrder = payload
    },
    mutate_currentItem(state, payload) {
      state.currentItem = payload
    }
  },
  actions: {

    getOrderItems({state, rootState}) {

      let mvpStore = rootState.mvp
      let url = rootState.apiurl
      console.log(mvpStore)
      console.log(url)


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
          "bool": {
            "must": [],
            "filter": [
              {
                "bool": {
                  "should": [
                    {
                      "match": {
                        "order": ""
                      }
                    }
                  ],
                  "minimum_should_match": 1
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
            "should": [],
            "must_not": []
          }
        }
      }
      const indiceProducts = 'dev_shopify_line_item'

      console.log(queryList2)

      queryList2.query.bool.filter[1].range.date.gte = mvpStore.targetDate.dateFrom.format(
        'YYYY/MM/DD'
      )
      queryList2.query.bool.filter[1].range.date.lte = mvpStore.targetDate.dateTo.format(
        'YYYY/MM/DD'
      )

      queryList2.query.bool.filter[0].bool.should[0].match.order = '#' + state.currentOrder.orderNumber.replace('#', '')

      url += 'generic_search/' + indiceProducts
      url += '?token=' + rootState.creds.token

      axios
      .post(url, queryList2)
      .then(response => {
        if (response.data.error != '') console.error('Get products error...')
        else {
          console.log(response)

        }
      })
      .catch(error => {
        console.error(error)
      })

      

    }
  },
  getters: {
    allOrders: state => state.orders,
    orderItems: state => order =>
      state.items.filter(product => product.order === order),
    lock: state => state.currentOrder._source.lock
  }
}
