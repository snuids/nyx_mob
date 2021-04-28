export default {
  namespaced: true,
  state: {
    orders: [],
    items: [],
    currentOrder: {},
    currentItem: {}
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
  getters: {
    allOrders: state => state.orders,
    orderItems: state => order =>
      state.items.filter(product => product.order === order),
    lock: state => state.currentOrder._source.lock
  }
}
