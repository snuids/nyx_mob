<template>
  <div class="a-dallas">
    <q-card flat bordered class="bg-white q-ma-xs q-pa-xs">
      Je suis supplier infos
      <q-collapsible
        icon="perm_identity"
        :label="capitalizeFistLetter(this.currentPurchaseOrder.supplier)"
      >
        <q-card class="q-pa-sm">
          <div class="row flex-center">
            <div>
              <h5>
                {{ capitalizeFistLetter(this.currentPurchaseOrder.supplier) }}
              </h5>
            </div>
          </div>
          <q-card-separator />
          <div class="row q-pa-sm q-mb-md commande">
            <div class="col-6">
              <div>
                <span class="caption">Date commande : </span>
                <b>
                  {{ goodLookingDate(this.currentPurchaseOrder.expected_date) }}
                </b>
              </div>
              <div>
                <span class="caption">Statut actuel : </span>
                <b>{{ this.currentPurchaseOrder.status }}</b>
              </div>
            </div>
            <div class="col-6">
              <div>
                <span class="caption">Numéro de commande : </span>
                <b>{{ this.currentPurchaseOrder.number }}</b>
              </div>
              <div>
                <span class="caption">Type de bon : </span>
                <b>{{ this.currentPurchaseOrder.type }}</b>
              </div>
            </div>
          </div>
          <q-card-separator />
          <div class="row q-pa-sm q-mb-md contact">
            <div class="col-6">
              <div>
                <span class="caption">Contact : </span>
                <b>{{ this.currentPurchaseOrder.sales_contact_name }}</b>
              </div>
              <div>
                <span class="caption">Téléphone : </span>
                <b>{{ this.currentPurchaseOrder.sales_phone_number }}</b>
              </div>
              <div>
                <span class="caption">Email : </span>
                <b>{{ this.currentPurchaseOrder.sales_contact_email }}</b>
              </div>
            </div>
            <div class="col-6">
              <div>
                <span class="caption">Adresse : </span>
                <b>{{ this.currentPurchaseOrder.address_line_1 }}</b>
              </div>
              <div>
                <b
                  >{{ this.currentPurchaseOrder.post_code }}
                  {{ this.currentPurchaseOrder.city }}</b
                >
              </div>
              <div>
                <span class="caption">Complément : </span>
                <b>{{ this.currentPurchaseOrder.address_line_2 }}</b>
              </div>
            </div>
          </div>
          <q-card-separator />
          <div class="row q-pa-sm q-mb-sm items">
            <div class="col-6">
              <div>
                <span class="caption">Nb d'items : </span>
                <b>{{ this.currentPurchaseOrder.line_items.length }}</b>
              </div>
            </div>
            <div class="col-6">
              <div>
                <span class="caption">Nb total de produits : </span>
                <b>{{ this.total }}</b>
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
    return {};
  },
  methods: {},
  created() {},
  computed: {}
};
</script>

<style lang="css">
.a-dallas {
    font-size: 28px;
    color: red;
}
</style>
