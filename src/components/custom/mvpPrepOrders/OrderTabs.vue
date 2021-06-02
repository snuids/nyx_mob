<template>
  <div>
    <q-tabs
      active-bg-color="grey-4"
      v-model="tab"
      dense
      class="row flex justify-center  items-center text-black"
      indicator-color="primary"
      align="justify"
    >
      <q-tab
        class="row col-xs-4 justify-center"
        name="articles"
        label="Articles"
      />
      <q-tab class="row col-xs-4 justify-center" name="resume" label="Résumé" />
      <q-tab class="row col-xs-4 justify-center" name="client" label="Client" />
    </q-tabs>
    <q-tab-panels animated v-model="tab">
      <q-tab-panel
        class="q-pa-none"
        name="articles"
        style="height: calc(100vh - 260px); overflow: scroll;"
      >
        <OrderItems :preparedProducts="prepared" />
      </q-tab-panel>
      <q-tab-panel
        name="resume"
        style="height: calc(100vh - 260px); overflow: scroll;"
      >
        <OrderInfos style="padding-bottom: 80px" />
      </q-tab-panel>
      <q-tab-panel name="client">
        <ClientInfos />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import OrderItems from './OrderItems'
import OrderInfos from './OrderInfos'
import { mapState } from 'vuex'
import ClientInfos from './ClientInfos'
export default {
  name: 'OrderTabs',
  components: { ClientInfos, OrderItems, OrderInfos },
  props: ['prepared'],
  data() {
    return {
      tab: 'articles'
    }
  },
  computed: {
    ...mapState('mvpPrep', ['currentOrder', 'currentOrderItems'])
  }
}
</script>

<style scoped></style>
