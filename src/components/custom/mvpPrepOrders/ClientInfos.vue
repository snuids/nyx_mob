<template>
  <div class="row q-pa-xs">
    <div class="col-xs-12 col-sm-6 q-pa-sm">
      <q-list bordered separator>
        <q-item>
          <q-item-section>
            Nom :
          </q-item-section>
          <q-item-section avatar class="text-weight-medium">
            {{ currentOrder._source.last_name }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            Prénom :
          </q-item-section>
          <q-item-section avatar class="text-weight-medium">
            {{ currentOrder._source.first_name }}
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            Nombre de commandes :
          </q-item-section>
          <q-item-section avatar class="text-weight-medium">
            {{ currentOrder._source.customer_order_count }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ClientInfos',
  computed: {
    ...mapState('mvpPrep', ['currentOrder'])
  }
}
</script>

<style scoped></style>
