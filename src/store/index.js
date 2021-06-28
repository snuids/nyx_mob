import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

import mvp from './custom/mvp'
import mvpPrepOrders from './custom/mvpPrepOrders'
import mvpPicking from './custom/mvpPicking'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      mvp: mvp,
      mvpPrep: mvpPrepOrders,
      mvpPicking: mvpPicking
    },
    state: {
      version: 'v1.0.3',
      // apiurl: '/api/v1/',
      apiurl: 'https://app.nyx-mvp.ovh/api/v1/',
      menus: [],
      apps: [],
      currentApps: null,
      activeApp: null,
      privileges: [],
      filteredmenus: [],
      creds: {},
      maintitle: '',
      appName: 'mobile'
    },
    getters: {
      version: state => state.version,
      appName: state => state.appName,
      apiurl: state => state.apiurl,
      creds: state => state.creds,
      privileges: state => state.privileges,
      filteredmenus: state => state.filteredmenus,
      currentApps: state => state.currentApps,
      activeApp: state => state.activeApp,
      menus: state => state.menus,
      maintitle: state => state.maintitle
    },
    actions: {
      privileges({ commit, state }) {
        var url =
          state.apiurl +
          'generic_search/nyx_privilege?token=' +
          state.creds.token
        axios
          .post(url, { size: 1000 })
          .then(response => {
            if (response.data.error != '') console.log('Privileges error...')
            else {
              console.log('Privileges success...')
              commit('privileges', response.data.records)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      filters({ commit, state }) {
        var url =
          state.apiurl + 'generic_search/nyx_filter?token=' + state.creds.token

        axios
          .post(url, {})
          .then(response => {
            if (response.data.error != '') console.log('Filters error...')
            else {
              console.log('Filters success...')
              commit('filters', response.data.records)
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },

    mutations: {
      filters(state, payload) {
        state.filters = payload
      },
      privileges(state, payload) {
        state.privileges = payload
      },
      login(state, payload) {
        console.log('Login mutation called.')
        state.initialized = false
        state.creds = payload.data.cred
        state.menus = payload.data.menus
        state.apps = []
        for (var m in payload.data.menus) {
          var menu1 = payload.data.menus[m]
          if (menu1.category == 'apps') {
            if (menu1.submenus != undefined && menu1.submenus.length > 0) {
              for (var sub in menu1.submenus) {
                state.apps = menu1.submenus[sub].apps
              }
            }
          }
        }

        state.filteredmenus = []
        var cmenus = state.menus
        for (var i in cmenus) {
          if (cmenus[i].category != 'apps') {
            var subMenus = []
            for (var j in cmenus[i].submenus) {
              var apps = []
              for (var k in cmenus[i].submenus[j].apps) {
                var type = cmenus[i].submenus[j].apps[k].type
                if (type == 'form' || type == 'free-text' || type == 'internal')
                  apps.push(cmenus[i].submenus[j].apps[k])
              }

              if (apps.length > 0) {
                cmenus[i].submenus[j].apps = JSON.parse(JSON.stringify(apps))
                subMenus.push(JSON.parse(JSON.stringify(cmenus[i].submenus[j])))
              }
            }

            if (subMenus.length > 0) {
              cmenus[i].submenus = JSON.parse(JSON.stringify(subMenus))
              state.filteredmenus.push(cmenus[i])
            }
          }
        }

        state.currentApps = state.filteredmenus[0].submenus[0]
        state.activeApp = state.filteredmenus[0].submenus[0].apps[0]
        state.maintitle = state.filteredmenus[0].submenus[0].loc_title
        state.maintitleicon = state.filteredmenus[0].submenus[0].icon

        console.log('Login mutation done.')
      },
      logout(state) {
        var url = state.apiurl + 'cred/logout?token=' + state.creds.token

        axios
          .get(url)
          .then(response => {
            if (response.data.error != '') console.log('Logout error...')
            else {
              console.log('Logout success...')
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      changeApps(state, payload) {
        console.log('VUEX:CURRENT APP:')
        console.log(JSON.stringify(payload.data))
        state.currentApps = payload.data
        state.maintitle = payload.data.loc_title
        state.maintitleicon = payload.data.icon
        state.timeRangeVisible = payload.data.apps[0].timeSelectorChecked
      },

      changeApp(state, payload) {
        console.log('changeApp mutation called.')
        var app = null

        for (var i = 0; i < state.filteredmenus.length; i++) {
          var cat = state.filteredmenus[i]

          for (var j = 0; j < cat.submenus.length; j++) {
            var subcat = cat.submenus[j]
            for (var k = 0; k < subcat.apps.length; k++) {
              if (subcat.apps[k].rec_id === payload.data) {
                app = subcat.apps[k]
                state.currentSubCategory = subcat
                break
              }
            }
            if (app !== null) break
          }
          if (app !== null) break
        }

        state.maintitle = state.currentSubCategory.loc_title

        state.activeApp = null
        state.activeApp = app

        console.log(app)
        if (app.timeDefault != null && app.timeDefault != '') {
          console.log('send forcetime')
          Vue.prototype.$globalbus.$emit('forcetime', app.timeDefault)
          console.log('send forcetime')
        }
      },
      updateRecord(state, payload) {
        var url =
          state.apiurl +
          'generic/' +
          payload.data._index +
          '/' +
          payload.data._id +
          '?token=' +
          state.creds.token
        axios
          .post(url, payload.data._source)
          .then(response => {
            if (response.data.error != '') console.log('Save object error...')
            else {
              console.log('Save object success...')
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      sendMessage(state, payload) {
        console.log('Send Message')

        var url = state.apiurl + 'sendmessage?token=' + state.creds.token

        var message = {
          destination: '' + payload.data.destination,
          body: payload.data.message
        }

        axios
          .post(url, message)
          .then(response => {
            if (response.data.error != '') console.log('Unable to send message')
            else {
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  })

  return Store
}
