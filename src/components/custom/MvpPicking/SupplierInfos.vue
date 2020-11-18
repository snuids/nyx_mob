<template>
  <div class="">
    <q-card flat bordered class="bg-white q-ma-xs q-pa-xs">
      <q-expansion-item icon="perm_identity" :label="currentOrder.name">
        <q-card class="q-pa-xs">
          <div class="row flex-center">
            <div>
              <h5>{{ currentOrder.name }}</h5>
            </div>
          </div>
          <q-separator />
          <!-- INFOS COMMANDES -->
          <div class="row commande q-pa-xs">
            <div class="col-xs-12 col-sm-6 date-cde q-pa-sm">
              Date commande : 1
            </div>
            <div class="col-xs-12 col-sm-6 num-cde q-pa-sm">
              Numéro de commande : 2
            </div>

            <div class="col-xs-12 col-sm-6 statut-actuel q-pa-sm">
              Statut actuel : 3
            </div>
            <div class="col-xs-12 col-sm-6 type-bon q-pa-sm">
              Type de bon : 4
            </div>

            <!-- <div class="col-xs-12 col-6">
              <div>
                <span class="caption">Date commande : </span>
                <b>
                  date
                </b>
              </div>
              <div>
                <span class="caption">Statut actuel : </span>
                <b>status</b>
              </div>
            </div>
            <div class="col-6">
              <div>
                <span class="caption">Numéro de commande : </span>
                <b>number</b>
              </div>
              <div>
                <span class="caption">Type de bon : </span>
                <b>type de bon</b>
              </div>
            </div> -->
          </div>
          <q-separator />
          <!-- INFOS CONTACT -->
          <div class="row q-pa-sm q-mb-md contact">
            <div class="col-xs-12 col-sm-6">
              <div class="col cta-name q-pa-sm">
                Contact : 1
              </div>
              <div class="col cta-tel q-pa-sm">
                Téléphone : 2
              </div>
              <div class="col cta-ema q-pa-sm">
                Email : 3
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 full-height">
              <div class="add-mai q-pa-sm">Adresse : 4<br />ZIP Ville</div>
              <div class="add-cmp q-pa-sm justify-end">
                Complément : 6
              </div>
            </div>

            <!-- <div class="col-6">
              <div>
                <span class="caption">Contact : </span>
                <b>contact name</b>
              </div>
              <div>
                <span class="caption">Téléphone : </span>
                <b>contact tel</b>
              </div>
              <div>
                <span class="caption">Email : </span>
                <b>contact mail</b>
              </div>
            </div>
            <div class="col-6">
              <div>
                <span class="caption">Adresse : </span>
                <b>adresse 1</b>
              </div>
              <div>
                <b>zip code ville</b>
              </div>
              <div>
                <span class="caption">Complément : </span>
                <b>adresse 2</b>
              </div>
            </div> -->
          </div>
          <q-separator />
          <!-- INFOS DIVERSES -->
          <div class="row q-pa-xs q-mb-sm divers">
            <div class="col-xs-12 col-sm-6 div-ite q-pa-sm">
              Nb d'items : 1
            </div>
            <div class="col-xs-12 col-sm-6 div-tot q-pa-sm">
              Nb total de produits : 2
            </div>

            <!-- <div class="col-6">
              <div>
                <span class="caption">Nb d'items : </span>
                <b>nb items</b>
              </div>
            </div>
            <div class="col-6">
              <div>
                <span class="caption">Nb total de produits : </span>
                <b>total prod</b>
              </div>
            </div> -->
          </div>
          <q-separator />
          <q-btn
            color="primary"
            class="full-width q-my-sm"
            label="Ajouter un produit"
            icon="add"
            size="lg"
          />
          <q-btn
            color="primary"
            class="full-width q-my-sm"
            label="Envoyer sur slack"
            icon="chat_bubble_outline"
            size="lg"
          />
          <q-btn
            color="primary"
            class="full-width q-my-sm"
            label="Commentaire"
            icon="notes"
            size="lg"
          />
        </q-card>
      </q-expansion-item>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'SupplierInfos',
  data() {
    return {
      //   name: "",
      //   expected_date: "",
      //   number: "",
      //   picker: "",
      //   address_line_1: "",
      //   address_line_2: "",
      //   city: "",
      //   post_code: "",
      //   contact_mail: "",
      //   contact_name: "",
      //   contact_phone: "",
      //   status: "",
      //   type: "",
      //   supplier_id: ""
      currentOrder: null
    }
  },
  methods: {},
  created() {},
  mounted() {
    console.log('Zorglub is here')
    // this.$store.getters.screenSize.appWidth
    this.currentOrder = this.$store.getters.currentOrder.details

    console.log('bulgroZ was here : ', this.currentOrder)
  },
  updated() {},
  computed: {}
}
</script>

<style>
.commande  {
  background-color: rgb(227, 252, 4);
}
.contact  {
  background-color: rgb(252, 4, 4);
}
.divers  {
  background-color: rgb(0, 110, 255);
}
.date-cde {
  background-color: rgb(75, 231, 205);
}
.num-cde {
  background-color: rgb(89, 90, 94);
}
.statut-actuel {
  background-color: rgb(240, 50, 183);
}
.type-bon {
  background-color: rgb(21, 255, 0);
}
.cta-nam {
  background-color: rgb(21, 255, 0);
}
.cta-tel {
  background-color: rgb(255, 0, 0);
}
.cta-ema {
  background-color: rgb(4, 0, 255);
}
.add-mai {
  background-color: rgb(255, 0, 179);
}
.add-cmp {
  background-color: rgb(4, 203, 253);
}
.div-ite {
  background-color: rgb(178, 0, 233);
}
.div-tot {
  background-color: rgb(253, 166, 4);
}
</style>
