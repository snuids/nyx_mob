<template>
  <div class="">
    <q-card flat bordered class="bg-white q-ma-xs q-pa-xs">
      <q-expansion-item
        icon="perm_identity"
        :label="currentOrder.name | uppercaseFirst"
      >
        <q-card class="q-pa-xs">
          <div class="row flex-center">
            <div>
              <h5>{{ currentOrder.name | uppercaseFirst }}</h5>
            </div>
          </div>
          <q-separator />
          <!-- INFOS COMMANDES -->
          <div class="row commande q-pa-xs">
            <div class="col-xs-12 col-sm-6 date-cde q-pa-sm">
              Date commande : {{ currentOrder.expected_date | dateFrench }}
            </div>
            <div class="col-xs-12 col-sm-6 num-cde q-pa-sm">
              Numéro de commande : {{ orderNumber(currentOrder.number) }}
            </div>

            <div class="col-xs-12 col-sm-6 statut-actuel q-pa-sm">
              Statut actuel : {{ currentOrder.status }}
            </div>
            <div class="col-xs-12 col-sm-6 type-bon q-pa-sm">
              Type de bon : {{ currentOrder.type }}
            </div>
          </div>
          <q-separator />
          <!-- INFOS CONTACT -->
          <div class="row q-pa-sm q-mb-md contact">
            <div class="col-xs-12 col-sm-6">
              <div class="col cta-name q-pa-sm">
                Contact : {{ currentOrder.contact_name }}
              </div>
              <div class="col cta-tel q-pa-sm">
                Téléphone : {{ currentOrder.contact_phone }}
              </div>
              <div class="col cta-ema q-pa-sm">
                Email : {{ currentOrder.contact_email }}
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 full-height justify-between">
              <div class="add-mai flex">
                <div class="col-xs-3 bg-green q-pa-xs">Adresse :</div>
                <div class="col-xs-9 bg-blue q-pa-xs text-right">
                  {{ currentOrder.address_line_1 }}<br />
                  {{ currentOrder.post_code }} {{ currentOrder.city }}
                </div>
              </div>
              <!-- <div class="add-mai q-pa-sm">
                Adresse : <br />{{ currentOrder.address_line_1 }}<br />{{
                  currentOrder.post_code
                }}
                {{ currentOrder.city }}
              </div> -->
              <div class="add-cmp q-pa-sm justify-end">
                Complément d'adresse : {{ currentOrder.address_line_2 }}
              </div>
            </div>
          </div>
          <q-separator />
          <!-- INFOS DIVERSES -->
          <div class="row q-pa-xs q-mb-sm divers">
            <div class="col-xs-12 col-sm-6 div-ite q-pa-sm">
              Nb d'items : {{ currentOrder.total_items }}
            </div>
            <div class="col-xs-12 col-sm-6 div-tot q-pa-sm">
              Nb total de produits : {{ currentOrder.total_products }}
            </div>
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
      currentOrder: null
    }
  },
  methods: {
    orderNumber(number) {
      if (number == 'CREATED_BY_NYX') return 'n/a'
    }
  },
  created() {},
  mounted() {
    this.currentOrder = this.$store.getters.currentOrder.details
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
