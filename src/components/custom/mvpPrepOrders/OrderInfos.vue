<template>
  <div>
    <!-- <q-separator /> -->

    <!-- INFOS CONTACT -->
    <div class="row q-pa-xs">
      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-list bordered separator>
          <q-item>
            <q-item-section>
              Produits frais :
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{ currentOrderItems.filter(elt => elt._source.fresh).length }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              Produits secs :
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{ currentOrderItems.filter(elt => !elt._source.fresh).length }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              Nombre total de produits :
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{ currentOrderItems.length }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              Poids total en kg:
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{ currentOrder._source.tot_weight_kg }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              Compost :
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{ currentOrder._source.compost ? 'Oui' : 'Non' }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-list bordered separator>
          <q-item>
            <q-item-section>
              Addresse :
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{ currentOrder._source.addr1 }}<br />
              {{ currentOrder._source.zip }} {{ currentOrder._source.city }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              Zone :
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{ currentOrder._source.zone }}
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
              Préparés secs :
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{
                currentOrderItems.filter(
                  elt =>
                    !elt._source.fresh && elt._source.prep_status === 'success'
                ).length
              }}/{{
                currentOrderItems.filter(elt => !elt._source.fresh).length
              }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              Préparés frais :
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{
                currentOrderItems.filter(
                  elt =>
                    elt._source.fresh && elt._source.prep_status === 'success'
                ).length
              }}/{{ currentOrderItems.filter(elt => elt._source.fresh).length }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-list bordered separator>
          <q-item>
            <q-item-section>
              À rembourser secs :
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{
                currentOrderItems.filter(
                  elt =>
                    !elt._source.fresh && elt._source.prep_status === 'remb'
                ).length
              }}/{{
                currentOrderItems.filter(elt => !elt._source.fresh).length
              }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              À rembourser frais :
            </q-item-section>
            <!--Ajouter le poids des produits ici-->
            <q-item-section avatar class="text-weight-medium">
              {{
                currentOrderItems.filter(
                  elt => elt._source.fresh && elt._source.prep_status === 'remb'
                ).length
              }}/{{ currentOrderItems.filter(elt => elt._source.fresh).length }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-xs-12 col-sm-6 q-pa-sm">
        <q-list bordered separator>
          <q-item>
            <q-item-section>
              Manquants secs :
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{
                currentOrderItems.filter(
                  elt =>
                    !elt._source.fresh && elt._source.prep_status === 'manq'
                ).length
              }}/{{
                currentOrderItems.filter(elt => !elt._source.fresh).length
              }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              Manquants frais :
            </q-item-section>
            <q-item-section avatar class="text-weight-medium">
              {{
                currentOrderItems.filter(
                  elt => elt._source.fresh && elt._source.prep_status === 'manq'
                ).length
              }}/{{ currentOrderItems.filter(elt => elt._source.fresh).length }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'OrderInfos',
  computed: {
    ...mapState('mvpPrep', ['currentOrder', 'currentOrderItems'])
  }
}
</script>

<style scoped></style>
