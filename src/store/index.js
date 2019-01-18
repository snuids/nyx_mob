import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import moment from 'moment';

import example from './module-example'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      apiurl: "api/v1/",
      menus: [],
      apps: [],
      currentApps: null,
      privileges: [],
      creds: {}
    },
    getters: {
      apiurl: state => state.apiurl,
      creds: state => state.creds,
      privileges: state => state.privileges,
    },
    actions: {
      privileges({ commit, state }) {
        var url =
          state.apiurl +
          "generic_search/nyx_privilege?token=" +
          state.creds.token;
  
        axios
          .post(url, {"size":1000})
          .then(response => {
            if (response.data.error != "")
              console.log("Privileges error...");
            else {
              console.log("Privileges success...");
              commit("privileges", response.data.records);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      filters({ commit, state }) {
        var url =
          state.apiurl +
          "generic_search/nyx_filter?token=" +
          state.creds.token;
  
        axios
          .post(url, {})
          .then(response => {
            if (response.data.error != "")
              console.log("Filters error...");
            else {
              console.log("Filters success...");
              commit("filters", response.data.records);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
  
    mutations: {
      filters(state, payload) {
        state.filters = payload;
      },
      privileges(state, payload) {
        state.privileges = payload;
      },
      login(state, payload) {
        console.log("Login mutation called.");
        state.initialized = false;
        state.creds = payload.data.cred;
        state.menus = payload.data.menus;
        state.apps = [];
        for (var m in payload.data.menus) {
          var menu1 = payload.data.menus[m];
          if (menu1.category == "apps") {
            if (menu1.submenus != undefined && menu1.submenus.length > 0) {
              for (var sub in menu1.submenus) {
                state.apps = menu1.submenus[sub].apps;
              }
            }
          }
        }
  
        state.filteredmenus = []
        var cmenus = state.menus;
        for (var i in cmenus)
          if (cmenus[i].category != "apps")
            state.filteredmenus.push(cmenus[i]);
        state.currentApps = state.filteredmenus[0].submenus[0];
        state.maintitle = state.filteredmenus[0].submenus[0].loc_title;
        state.maintitleicon = state.filteredmenus[0].submenus[0].icon;
  
        console.log("Login mutation done.");
      },
      logout(state) {
        var url =
          state.apiurl +
          "cred/logout?token=" +
          state.creds.token;
  
        axios
          .get(url)
          .then(response => {
            if (response.data.error != "")
              console.log("Logout error...");
            else {
              console.log("Logout success...");
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  })

  return Store
}
