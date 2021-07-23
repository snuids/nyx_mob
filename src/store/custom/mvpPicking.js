export default {
  namespaced: true,
  state: {
    currentOrder: {
      currentOrder: {
        meta: {
          id: '',
          index: ''
        },
        details: {},
        cart: {}
      }
    },
    allPurchaseOrders: {}
  },

  getters: {
    currentOrder: state => state.currentOrder,
    getOrderDetails: state => state.currentOrder.details,
    allPurchaseOrders: state => state.allPurchaseOrders
  },

  mutations: {
    mutate_currentOrder(state, payload) {
      state.currentOrder = payload.order
    },
    mutate_allPurchaseOrders(state, payload) {
      state.allPurchaseOrders = payload.data
    }
  }
}
