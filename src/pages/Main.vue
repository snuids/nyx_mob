<template>
  <q-layout>
    <q-layout-header>
      <q-toolbar>
        <!-- showLeft is a model attached to left side drawer below -->
        <q-btn
          flat round dense
          @click="showLeft = !showLeft"
          icon="menu"
        />

        <q-toolbar-title>
          {{title}}
          <span slot="subtitle">{{appTitle}}</span>
        </q-toolbar-title>

      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer side="left" v-model="showLeft">
      <div class="bg-brown-1 account-container">
          <q-icon size="80px" class="account-icon" name="account_circle" color="green" />

          <div class="user-info">
            <small class='text-bold lowercase text-black block'>{{creds.user.firstname}} {{creds.user.lastname}}</small>
            <small class='text text-grey-7 block'>{{creds.user.user}}</small>
          </div>


          <q-btn 
            class="pwd-button" 
            rounded 
            outline 
            size="sm" 
            icon="lock" 
            label="Password" />
          <q-btn 
            @click="clickLogout()"
            class="logout-button" 
            rounded 
            outline 
            color="negative" 
            size="sm" 
            label="Logout" />

      </div>
      
      <q-list no-border link inset-separator>
        <q-list-header>Applications</q-list-header>
        <q-item to="/docs">
          <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" />
        </q-item>
        <q-item to="/forum">
          <q-item-side icon="record_voice_over" />
          <q-item-main label="Forum" sublabel="forum.quasar-framework.org" />
        </q-item>
        <q-item to="/chat">
          <q-item-side icon="chat" />
          <q-item-main label="Discord Chat Channel" sublabel="https://discord.gg/5TDhbDg" />
        </q-item>
        <q-item to="/twitter">
          <q-item-side icon="rss feed" />
          <q-item-main label="Twitter" sublabel="@quasarframework" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
          {{privileges}}
    </q-page-container>
  </q-layout>
</template>

<script>

import Vue from "vue";
import moment from "moment";
import _ from "lodash";



// @ is an alias to /src
export default {
  name: "home",
  
  data: () => ({
    title: 'NYX Mobile',
    appTitle: 'subtitle',
    showLeft: false
  }),
  computed: {
    apiurl() { return this.$store.getters.apiurl },
    creds() { return this.$store.getters.creds },
    privileges() { return this.$store.getters.privileges }
  },
  methods: {
    clickLogout() {
      this.$q.dialog({
        title: 'Warning',
        message: 'Are you sure you want to logout ?',
        color: 'negative',
        ok: true,
        cancel: true,
        //position: 'top',
      })
        .then(() => {
          this.logout()
        })
        .catch(() => {
          // Picked "Cancel" or dismissed
        })

    },
    logout() {
      console.log("BEFCOMMIT");
      this.$store.commit({
        type: "logout",
        data: {}
      });
      console.log("AFTERCOMMIT");
      
      this.$q.notify({
        title: this.$t("notifications.message"),
        message:
          this.$t("notifications.bye"),
        type: "positive",
        position: "bottom",
        timeout:500
      });
      this.$router.push("/");
    },
    
    
  },
  created: function() {
    
  },
  mounted: function() {
    
  },
  beforeDestroy: function() {
    
  }
};
</script>
<style scoped>
.account-container {
  height: 160px;
}

.account-icon {
  margin: 12px 15px;
}

.user-info {
  margin-left:20px;
}

.user-info small{
  margin-bottom:5px;
}

.pwd-button {
  position: absolute;
  right: 10px;
  top: 20px;
  width: 115px
}

.logout-button {
  position: absolute;
  right: 10px;
  top: 60px;
  width: 115px
}

</style>