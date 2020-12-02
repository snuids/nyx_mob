<template>
  <q-btn dense flat color="primary" label="menu" class="text-white q-px-md">
    <q-menu anchor="bottom right" self="top right">
      <q-list style="min-width: 100px">
        <q-item v-close-popup>
          <q-item-section style="font-size:1.2em;text-align:right;">
            <div>{{ username }}</div>
            <div class="text-weight-thin">{{ id }}</div>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="openDialogBox('other')" v-close-popup>
          <q-item-section style="text-align:right;font-size:1.2em;">
            open w/ slug
          </q-item-section>
          <q-item-section side>
            <q-icon name="new_releases" />
          </q-item-section>
        </q-item>
        <q-item clickable @click="openDialogBox('slackDirect')" v-close-popup>
          <q-item-section style="text-align:right;font-size:1.2em;">
            Message slack
          </q-item-section>
          <q-item-section side>
            <q-icon name="email" />
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="openDialogBox('range')" v-close-popup>
          <q-item-section style="text-align:right;font-size:1.2em;">
            Periode
          </q-item-section>
          <q-item-section side>
            <q-icon name="date_range" />
          </q-item-section>
        </q-item>
        <q-item clickable @click="openDialogBox('date')" v-close-popup>
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
</template>

<script>
import DialogBox from 'components/custom/MvpPicking/DialogBox.vue'

export default {
  name: 'MainMenu',
  data() {
    return {
      username: null,
      id: null
    }
  },
  methods: {
    openDialogBox(slug) {
      var titles = {
        date: 'Choisir une date',
        range: 'Choisir une période',
        other: 'other / testing purpose',
        slackDirect: 'Envoyer un message sur slack'
      }

      this.$q
        .dialog({
          component: DialogBox,
          parent: this,
          target: slug,
          title: titles[slug]
        })
        .onOk(event => {
          //console.log('Dialog() => OK ', event.data)
          if (slug === 'date' || slug === 'range') {
            this.$parent.setNewDates(event.data.fr, event.data.to)
          } else if (
            slug === 'slackDirect' ||
            slug === 'slackProblem' ||
            slug === 'slackPo'
          ) {
            this.sendToSlack(event.data)
          } else if (slug === 'other') {
            console.log('i am the callback of other. Fear my anger !')
          }
        })
        .onCancel(() => {
          //console.log('Dialog() => Cancel')
        })
        .onDismiss(() => {
          //console.log('Dialog() => I am triggered on both OK and Cancel')
        })
    },
    today() {
      this.$emit('today')
    },
    async sendToSlack(data) {
      try {
        await this.$store.dispatch('sendMessageToSlack', data)
        this.$q.notify({
          message: 'Message envoyé !',
          timeout: 5000,
          color: 'green'
        })
      } catch (ex) {
        console.log('Something goes wrong when posting to slack : ', ex)
        this.$q.notify({
          message: 'Un problème est survenu, veuillez re-essayer plus tard.',
          timeout: 5000,
          color: 'red'
        })
      }
    }
  },
  mounted() {
    this.username =
      this.$store.getters.creds.user.firstname +
      ' ' +
      this.$store.getters.creds.user.lastname
    this.id = this.$store.getters.creds.user.id
  }
}
</script>

<style></style>
