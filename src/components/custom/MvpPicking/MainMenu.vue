<template>
  <div>
    <!--  MENU  -->
    <q-btn dense flat icon="menu" color="primary" class="text-black q-px-md">
      <q-menu anchor="bottom right" self="top right">
        <q-list style="min-width: 100px">
          <q-item v-close-popup>
            <q-item-section style="font-size:1.2em;text-align:right;">
              <div>{{ username }}</div>
              <div class="text-weight-thin">{{ id }}</div>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable @click="slackDirect = true" v-close-popup>
            <q-item-section style="text-align:right;font-size:1.2em;">
              Message slack
            </q-item-section>
            <q-item-section side>
              <q-icon name="email" />
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable @click="rangeDate = true" v-close-popup>
            <q-item-section style="text-align:right;font-size:1.2em;">
              Periode
            </q-item-section>
            <q-item-section side>
              <q-icon name="date_range" />
            </q-item-section>
          </q-item>
          <q-item clickable @click="singleDate = true" v-close-popup>
            <q-item-section style="text-align:right;font-size:1.2em;"
              >Jour</q-item-section
            >
            <q-item-section side>
              <q-icon name="event" />
            </q-item-section>
          </q-item>
          <q-item clickable @click="today" v-close-popup>
            <q-item-section style="text-align:right;font-size:1.2em;"
              >Aujourd'hui</q-item-section
            >
            <q-item-section side>
              <q-icon name="calendar_today" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <!--  DIALOG BOX [ slackDirect ]  -->
    <q-dialog v-model="slackDirect" full-width>
      <q-card class="q-pa-xs">
        <q-card-section class="row items-center">
          <div class="dialog-box-title">
            Envoyer un message sur slack
          </div>
        </q-card-section>
        <q-card-section class="row flex-center">
          <q-input
            v-model="slackMsg"
            filled
            type="textarea"
            class="full-width"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn
            flat
            label="Envoyer"
            @click="sendToSlack"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--  DIALOG BOX [ singleDate ]  -->
    <q-dialog v-model="singleDate" ref="singleDateDialog">
      <q-date
        v-model="dateSelection"
        :locale="myLocale"
        @input="onDateSelect"
        :landscape="isLandscape"
      />
    </q-dialog>

    <!--  DIALOG BOX [ rangeDate ]  -->
    <q-dialog v-model="rangeDate" ref="rangeDateDialog">
      <q-date
        v-model="dateSelection"
        :locale="myLocale"
        range
        @input="onRangeSelect"
        :landscape="isLandscape"
      />
    </q-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'MainMenu',
  data() {
    return {
      //username: null,
      id: null,
      slackDirect: false,
      slackMsg: '',
      singleDate: false,
      dateSelection: '',
      myLocale: {
        /* starting with Sunday */
        days: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
        daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
        months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split(
          '_'
        ),
        monthsShort: 'Jan_Fév_Mar_Avr_Mai_Jui_Jui_Aoû_Sep_Oct_Nov_Déc'.split(
          '_'
        ),
        firstDayOfWeek: 1
      },
      rangeDate: false
    }
  },
  methods: {
    today() {
      this.$emit('today')
    },
    async sendToSlack() {
      var slackObject = {}
      slackObject.date = moment()
      slackObject.user = this.$store.getters.creds.user.firstname
      slackObject.msg = this.slackMsg
      slackObject.apiUrl = this.$store.getters.apiurl
      slackObject.apiKey = this.$store.getters.activeApp.config.restApiKey
      slackObject.type = 'direct'

      try {
        await this.$store.dispatch('sendMessageToSlack', slackObject)
        this.$q.notify({
          message: 'Message envoyé !',
          timeout: 5000,
          color: 'green'
        })
      } catch (ex) {
        this.$q.notify({
          message: 'Un problème est survenu, veuillez re-essayer plus tard.',
          timeout: 5000,
          color: 'red'
        })
      }
    },
    onDateSelect() {
      this.$refs.singleDateDialog.hide()

      var o = {
        fr: moment(this.dateSelection, 'YYYY/MM/DD').startOf('day'),
        to: moment(this.dateSelection, 'YYYY/MM/DD').endOf('day')
      }
      this.$emit('newDates', { data: o })
    },
    onRangeSelect() {
      this.$refs.rangeDateDialog.hide()
      var o = {
        fr: moment(this.dateSelection.from, 'YYYY/MM/DD').startOf('day'),
        to: moment(this.dateSelection.to, 'YYYY/MM/DD').endOf('day')
      }
      this.$emit('newDates', { data: o })
    }
  },
  //mounted() {}

  computed: {
    ...mapGetters(['creds']),
    username() {
      return this.creds.user.firstname + ' ' + this.creds.user.lastname
      this.id = this.$store.getters.creds.user.id
    },
    isLandscape: function() {
      if (this.$store.state.mvp.screenSize.windowWidth > 1000) return false
      else if (
        this.$store.state.mvp.screenSize.windowWidth >
        this.$store.state.mvp.screenSize.windowHeight
      )
        return true
      else return false
    }
  }
}
</script>

<style>
.dialog-box-title {
  font-size: 1.2em;
}
</style>
