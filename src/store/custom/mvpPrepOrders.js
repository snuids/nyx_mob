export default {
  namespaced: true,
  state: {
    orders: [],
    productItems: [],
    currentOrder: {}
  },
  mutations: {
    mutate_allOrders(state, payload) {
      state.orders = payload
    },
    mutate_allProducts(state, payload) {
      state.productItems = payload
    },
    mutate_currentOrder(state, payload) {
      state.currentOrder = payload
    }
  },
  getters: {
    allOrders: state => state.orders,
    orderProducts: state => order =>
      state.productItems.filter(product => product.order === order)
  }
}
