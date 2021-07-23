<template>
  <div id="q-app">
    <router-view />
    <div
      style="position:fixed;
      z-index:10000;
      top:0px;
      width:100%"
      v-if="isOffline"
    >
      <q-banner inline-actions rounded class="bg-red text-white">
        L'appareil n'est pas connecté à internet. L'application est hors ligne.
      </q-banner>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import _ from 'lodash'
import VueOffline from 'vue-offline'
Vue.use(VueOffline)
export default {
  name: 'App',
  data: () => ({
    noNetworkNotif: null,
    axiosInterceptor: null
  }),
  watch: {},
  methods: {
    enableInterceptor() {
      console.log('enable interceptors axios')
      this.axiosInterceptor = axios.interceptors.request.use(
        config => {
          if (this.isOffline) {
            console.log('NO NETWORK')
            return Promise.reject('NO NETWORK')
          }
          return config
        },
        error => {
          return Promise.reject(error)
        }
      )
      axios.interceptors.response.use(
        response => {
          if (
            response.data != null &&
            response.data.error != null &&
            response.data.error == 'UNKNOWN_TOKEN'
          ) {
            console.warn('UNKNOWN_TOKEN')
            if (this.$route.path != '/') {
              this.logoutDebounce(true)
            }
          } else if (
            response.data != null &&
            response.data.error != null &&
            response.data.error != ''
          ) {
            this.$notify({
              title: 'Error',
              message: response.data.error,
              type: 'error',
              position: 'bottom-right'
            })
          }
          return response
        },
        error => {
          console.error('response interceptor error ', error)
          return Promise.reject(error)
        }
      )
    },
    disableInterceptor() {
      axios.interceptors.request.eject(this.axiosInterceptor)
    }
  },
  mounted: function() {
    console.log('mounted')
    if (this.axiosInterceptor == null) {
      this.enableInterceptor()
    }
  },
  beforeDestroy() {
    this.disableInterceptor()
  }
}
</script>
<style></style>
