export default {
  namespaced: true,
  state: {
    orders: []
  },
  mutations: {
    mutate_allOrders(state, payload) {
      state.orders = payload
    }
  },
  getters: {
    allOrders: state => state.orders
  }
}
