<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <!-- showLeft is a model attached to left side drawer below -->
        <q-btn flat round dense @click="showLeft = !showLeft" icon="menu" />

        <q-toolbar-title>
          {{ title }}
          <span slot="subtitle">{{ maintitle }}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer side="left" v-model="showLeft">
      <div class="bg-brown-1 account-container">
        <q-icon
          size="80px"
          class="account-icon"
          name="account_circle"
          color="green"
        />

        <div class="user-info" v-if="creds">
          <small class="text-bold lowercase text-black block"
            >{{ creds.user.firstname }} {{ creds.user.lastname }}</small
          >
          <small class="text text-grey-7 block">{{ creds.user.user }}</small>
          <small class="logout-button text-bold lowercase text-black block">{{
            $store.getters.version
          }}</small>
        </div>
        <q-btn
          @click="clickLogout()"
          class="pwd-button"
          rounded
          outline
          color="negative"
          size="sm"
          label="Logout"
        />
      </div>

      <q-list no-border link inset-separator>
        <span v-for="(menu, index) in filteredmenus" :key="index">
          <q-item-label header>{{ menu.loc_category }}</q-item-label>
          <q-item
            :to="'/main/' + submenu.apps[0].rec_id"
            v-for="(submenu, index) in menu.submenus"
            @click.native="appClicked(submenu)"
            :key="index"
          >
            <q-item-section
              avatar
              v-if="submenu.apps[0].type == 'form'"
              icon="insert_drive_file"
            />
            <q-item-section avatar v-else>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>{{ submenu.loc_title }}</q-item-section>
          </q-item>
        </span>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

// @ is an alias to /src
export default {
  name: 'home',

  data: () => ({
    title: 'NYX Mobile',
    showLeft: false,
  }),
  computed: {
    apiurl() {
      return this.$store.getters.apiurl
    },
    creds() {
      return this.$store.getters.creds
    },
    menus() {
      return this.$store.getters.menus
    },
    maintitle() {
      if (this.$store.getters.activeApp)
        return this.$store.getters.activeApp.title
    },
    filteredmenus() {
      return this.$store.getters.filteredmenus
    },
  },
  methods: {
    clickLogout() {
      this.$q
        .dialog({
          title: 'Warning',
          message: 'Are you sure you want to logout ?',
          color: 'negative',
          ok: true,
          cancel: true,
          //position: 'top',
        })
        .onOk(() => {
          this.logout()
        })
        .catch(() => {
          // Picked "Cancel" or dismissed
        })
    },
    logout() {
      console.log('BEFCOMMIT')
      this.$store.commit({
        type: 'logout',
        data: {},
      })
      console.log('AFTERCOMMIT')

      this.$q.notify({
        title: this.$t('notifications.message'),
        message: this.$t('notifications.bye'),
        type: 'positive',
        position: 'bottom',
        timeout: 500,
      })
      this.$router.push('/')
    },
    appClicked(e) {
      if (e.type == 'external') {
        window.open(e.config.url)
      }
    },
  },
  created: async function () {
    var vars = {}
    window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value
      }
    )

    if (vars['api'] != undefined) {
      this.$store.state.apiurl = vars['api'].split('#')[0]
    }

    if (
      this.$store.getters.currentSubCategory == undefined &&
      localStorage.authResponse
    ) {
      var path = this.$route.path
      if (path[path.length - 1] == '/')
        path = path.substring(0, path.length - 1)

      var rec_id = path.replace('/main/', '')

      var authResponse = JSON.parse(localStorage.authResponse)

      var url =
        this.$store.getters.apiurl +
        'status?token=' +
        authResponse.data.cred.token

      try {
        const response = await axios.get(url)

        if (response.status == 200 && response.data.error == '') {
          this.$store.commit({
            type: 'login',
            data: authResponse.data,
          })

          this.$store.commit({
            type: 'changeApp',
            data: rec_id,
          })

          if (authResponse.data.cred.user.privileges.includes('admin')) {
            this.$store.commit({
              type: 'privileges',
              data: authResponse.data.all_priv,
            })
            this.$store.commit({
              type: 'filters',
              data: authResponse.data.all_filters,
            })
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted: function () {},
  beforeDestroy: function () {},
}
</script>
<style scoped>
.account-container {
  height: 160px;
}

.account-icon {
  margin: 12px 15px;
}

.user-info {
  margin-left: 20px;
}

.user-info small {
  margin-bottom: 5px;
}

.pwd-button {
  position: absolute;
  right: 10px;
  top: 20px;
  width: 115px;
}

.logout-button {
  position: absolute;
  right: 10px;
  top: 60px;
  width: 115px;
}
</style>
