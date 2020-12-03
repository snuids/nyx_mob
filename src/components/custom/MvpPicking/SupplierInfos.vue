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
          Date commande : {{ currentOrder.expected_date | dateFrench }}
        </div>
        <div class="col-xs-12 col-sm-6 q-pa-sm">
          Numéro de commande : {{ orderNumber(currentOrder.number) }}
        </div>

        <div class="col-xs-12 col-sm-6 q-pa-sm">
          Statut actuel : {{ currentOrder.status }}
        </div>
        <div class="col-xs-12 col-sm-6 q-pa-sm">
          Type de bon : {{ currentOrder.type }}
        </div>
      </div>
      <q-separator />
      <!-- INFOS CONTACT -->
      <div class="row q-pa-sm q-mb-md">
        <div class="col-xs-12 col-sm-6">
          <div class="col q-pa-sm">
            Contact : {{ currentOrder.contact_name }}
          </div>
          <div class="col q-pa-sm">
            Téléphone : {{ currentOrder.contact_phone }}
          </div>
          <div class="col q-pa-sm">
            Email : {{ currentOrder.contact_email }}
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 full-height justify-between">
          <div class="flex">
            <div class="col-xs-3 q-pa-xs">Adresse :</div>
            <div class="col-xs-9 q-pa-xs text-right">
              {{ currentOrder.address_line_1 }}<br />
              {{ currentOrder.post_code }} {{ currentOrder.city }}
            </div>
          </div>
          <div class="q-pa-sm justify-end">
            Complément d'adresse : {{ currentOrder.address_line_2 }}
          </div>
        </div>
      </div>
      <q-separator />
      <!-- INFOS DIVERSES -->
      <div class="row q-pa-xs q-mb-sm">
        <div class="col-xs-12 col-sm-6 q-pa-sm">
          Nb d'items : {{ currentOrder.total_items }}
        </div>
        <div class="col-xs-12 col-sm-6 q-pa-sm">
          Nb total de produits : {{ currentOrder.total_products }}
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
// import DialogBox from 'components/custom/MvpPicking/DialogBox.vue'

export default {
  name: 'SupplierInfos',
  data() {
    return {
      currentOrder: null,
      slackPo: false,
      slackPoMsg: '',
      comment: false,
      commentMsg: ''
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
    addComment() {
      this.$q
        .dialog({
          component: DialogBox,
          parent: this,
          target: 'comment',
          title: 'Ajouter un commentaire à la commande'
        })
        .onOk(event => {
          this.$emit('addComment', event.data)
        })
        .onCancel(() => {
          //console.log('Dialog() => Cancel')
        })
        .onDismiss(() => {
          //console.log('Dialog() => I am triggered on both OK and Cancel')
        })
    },
    show() {
      this.$refs.dialogSupInfo.show()
    },
    hide() {
      this.$refs.dialogSupInfo.hide()
    },
    onDialogHide() {
      this.$emit('hide')
    },
    openDialogBox() {
      var slug = 'slackPo'
      var titles = {
        slackPo: 'Envoyer un message sur slack'
      }
      console.log(' :::::::::://///////::::::::::: ', this.order.supplier)
      this.$q
        .dialog({
          component: DialogBox,
          parent: this,
          target: slug,
          title: titles[slug],
          supplier: this.order.supplier,
          poType: this.order.type
        })
        .onOk(event => {
          //console.log('Dialog() => OK ', event.data)
          if (slug === 'slackPo') {
            this.sendToSlack(event.data)
          }
        })
        .onCancel(() => {
          //console.log('Dialog() => Cancel')
        })
        .onDismiss(() => {
          //console.log('Dialog() => Dismiss')
        })
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
    },
    onSlackPo() {},
    onComment() {
      console.log('onComment > emit something')
      var datDate = moment()
      var datUser =
        this.$store.getters.creds.user.firstname +
        ' ' +
        this.$store.getters.creds.user.lastname
      var o = { date: datDate, user: datUser, msg: this.commentMsg }

      this.$emit('addComment', o)
    },
    closeWindow() {
      this.$emit('closeSupplier')
    }
  },
  created() {
    this.currentOrder = this.$store.getters.currentOrder.details
    // console.log('debug created !! ', this.currentOrder)
  },
  mounted() {},
  updated() {},
  computed: {}
}
</script>

<style>
.dialog-box-title {
  font-size: 1.2em;
}
</style>
