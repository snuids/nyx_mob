<template>
  <div class="a-dallas">
    <q-card flat bordered class="bg-white q-ma-xs q-pa-xs">
      <q-collapsible icon="perm_identity" label="Nom du prod">
        <q-card class="q-pa-sm">
          <div class="row flex-center">
            <div>
              <h5>
                Nom du prod
              </h5>
            </div>
          </div>
          <q-card-separator />
          <div class="row q-pa-sm q-mb-md commande">
            <div class="col-6">
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
            </div>
          </div>
          <q-card-separator />
          <div class="row q-pa-sm q-mb-md contact">
            <div class="col-6">
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
            </div>
          </div>
          <q-card-separator />
          <div class="row q-pa-sm q-mb-sm items">
            <div class="col-6">
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
            </div>
          </div>
          <q-card-separator />
          <q-btn
            color="primary"
            class="full-width q-my-sm"
            label="Ajouter un produit"
            icon="add"
            @click=""
            size="lg"
          />
          <q-btn
            color="primary"
            class="full-width q-my-sm"
            label="Envoyer sur slack"
            icon="chat_bubble_outline"
            @click=""
            size="lg"
          />
          <q-btn
            color="primary"
            class="full-width q-my-sm"
            label="Commentaire"
            icon="notes"
            @click=""
            size="lg"
          />
        </q-card>
      </q-collapsible>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "SupplierInfos",
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
    };
  },
  methods: {
    parseData() {
      console.log("Zorglub is here");
      this.currentOrder = this.$store.state.pickingModule.currentOrder;
      console.log("bulgroZ was here : ", this.currentOrder);
    }
  },
  created() {},
  mounted() {},
  updated() {
    this.parseData();
  },
  computed: {}
};
</script>

<style lang="css">
.a-dallas {
    font-size: 28px;
    color: red;
}
</style>
