<template>
  <div>
    <q-card flat bordered class="bg-white">
      <q-btn
        dense
        flat
        color="primary"
        icon="close"
        class="absolute-top-right text-black q-px-md"
        @click="closeWindow"
      />
      <div class="row flex-center bg-light-blue-1">
        <div>
          <h5>{{ currentOrder.name | uppercaseFirst }}</h5>
        </div>
      </div>

      <!-- INFOS COMMANDES -->
      <div class="row q-pa-xs">
        <div class="col-xs-12 col-sm-6 q-pa-sm">
          <q-list bordered separator>
            <q-item>
              <q-item-section>
                Date commande :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ currentOrder.expected_date | dateFrench }}
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                Statut actuel :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                <q-chip dense :color="statusColor" text-color="white">
                  {{ status }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-xs-12 col-sm-6 q-pa-sm">
          <q-list bordered separator>
            <q-item>
              <q-item-section>
                Numéro de commande :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ orderNumber(currentOrder.number) }}
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                Type de bon :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ currentOrder.type }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <!-- <q-separator /> -->

      <!-- INFOS CONTACT -->
      <div class="row q-pa-xs">
        <div class="col-xs-12 col-sm-6 q-pa-sm">
          <q-list bordered separator>
            <q-item>
              <q-item-section>
                Contact :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ currentOrder.contact_name }}
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                Téléphone :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ cleanPhone }}
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                Email :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ currentOrder.contact_email }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-xs-12 col-sm-6 q-pa-sm">
          <q-list bordered separator>
            <q-item>
              <q-item-section>
                Adresse :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ currentOrder.address_line_1 }}<br />
                {{ currentOrder.post_code }} {{ currentOrder.city }}
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                Complément d'adresse :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ currentOrder.address_line_2 }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <!-- <q-separator /> -->

      <!-- INFOS COMMANDES -->
      <div class="row q-pa-xs">
        <div class="col-xs-12 col-sm-6 q-pa-sm">
          <q-list bordered separator>
            <q-item>
              <q-item-section>
                Nb d'items commandés :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ currentOrder.total_items_ordered }}
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                Nb d'items reçus :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ currentOrder.total_items_received }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-xs-12 col-sm-6 q-pa-sm">
          <q-list bordered separator>
            <q-item>
              <q-item-section>
                Nb total de produits commandés :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ currentOrder.total_products_ordered }}
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                Nb total de produits reçus :
              </q-item-section>
              <q-item-section avatar class="text-weight-medium">
                {{ currentOrder.total_products_received }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <q-separator />

      <q-btn
        color="primary"
        class="full-width q-my-sm"
        label="Envoyer sur slack"
        icon="chat_bubble_outline"
        size="lg"
        @click="slackPo = true"
      />
      <q-btn
        color="primary"
        class="full-width q-my-sm"
        label="Commentaire"
        icon="notes"
        size="lg"
        @click="comment = true"
      />
    </q-card>

    <!--  DIALOG BOX [ slackPo ]  -->
    <q-dialog v-model="slackPo" full-width>
      <q-card class="q-pa-xs">
        <q-card-section class="row items-center">
          <div class="dialog-box-title">
            Envoyer un message sur slack concernant cette commande
          </div>
        </q-card-section>
        <q-card-section class="row flex-center">
          <q-input
            v-model="slackPoMsg"
            filled
            type="textarea"
            class="full-width"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn
            flat
            label="Valider"
            @click="onSlackPo"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--  DIALOG BOX [ comment ]  -->
    <q-dialog v-model="comment" full-width>
      <q-card class="q-pa-xs">
        <q-card-section class="row items-center">
          <div class="dialog-box-title">
            Attacher un commentaire à cette commande
          </div>
        </q-card-section>
        <q-card-section class="row flex-center">
          <q-input
            v-model="commentMsg"
            filled
            type="textarea"
            class="full-width"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn
            flat
            label="Valider"
            @click="onComment"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'SupplierInfos',
  data() {
    return {
      currentOrder: null,
      slackPo: false,
      slackPoMsg: '',
      comment: false,
      commentMsg: '',
      statusColor: 'grey'
    }
  },
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  methods: {
    orderNumber(number) {
      if (number == 'CREATED_BY_NYX') return 'n/a'
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
        this.$q.notify({
          message: 'Un problème est survenu, veuillez re-essayer plus tard.',
          timeout: 5000,
          color: 'red'
        })
      }
    },
    onSlackPo() {
      var o = {}
      o.date = moment()
      o.user = this.$store.getters.creds.user.firstname
      o.msg = this.slackPoMsg
      o.apiUrl = this.$store.getters.apiurl
      o.apiKey = this.$store.getters.activeApp.config.restApiKey
      o.type = 'po'
      o.supplier = this.currentOrder.name
      o.poType = this.currentOrder.type

      this.sendToSlack(o)
    },
    onComment() {
      var datDate = moment()
      var datUser =
        this.$store.getters.creds.user.firstname +
        ' ' +
        this.$store.getters.creds.user.lastname
      var o = { date: datDate, user: datUser, msg: this.commentMsg }

      this.$emit('addComment', o)
      this.commentMsg = ''
    },
    closeWindow() {
      this.$emit('closeSupplier')
    }
  },
  created() {
    console.log('>>>>>>>>>>> ', this.order)
    this.currentOrder = this.$store.getters.currentOrder.details
  },
  mounted() {},
  updated() {},
  computed: {
    status: function() {
      if (this.currentOrder.status === 'to_be_collected') {
        this.statusColor = 'primary'
        return 'En attente de collecte'
      } else if (this.currentOrder.status === 'partially_collected') {
        this.statusColor = 'warning'
        return 'En cours de collecte'
      } else if (this.currentOrder.status === 'fully_collected') {
        this.statusColor = 'positive'
        return 'Terminée'
      }
    },
    cleanPhone: function() {
      var tmp = this.currentOrder.contact_phone
      var tmpClean = tmp.replace(/\s+/g, '')
      return tmpClean.toString().replace(/\d{2}(?=.)/g, '$& ')
    }
  }
}
</script>

<style>
.dialog-box-title {
  font-size: 1.2em;
}
</style>
