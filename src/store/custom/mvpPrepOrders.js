export default {
  namespaced: true,
  state: {
    currentOrder: {
      meta: {
        id: '',
        index: ''
      },
      details: {},
      cart: {}
    },
    allProductsOrder: []
  },
  mutations: {
    addProduct(state, payload) {
      state.allProductsOrder.push(payload.product_items)
      //console.table(state.allProductsOrder)
    }
  },
  getters: {
    currentOrder: state => state.currentOrder,
    getOrderDetails: state => state.currentOrder.details,
    allPurchaseOrders: state => state.allPurchaseOrders,
    screenSize: state => state.screenSize
  }
}
