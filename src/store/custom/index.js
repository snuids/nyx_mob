import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default {
  modules: {
    mvp: {
      namespaced: true,

      state: {
        version: "mvp specific",
      },
      getters: {
        version: state => state.version,
      },
      actions: {},

      mutations: {}

    }
  }
}
