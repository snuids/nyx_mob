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
        style="height: calc(100vh - 280px); overflow: scroll;"
      >
        <OrderItems :preparedProducts="prepared" />
      </q-tab-panel>
      <q-tab-panel name="resume">
        <div class="text-h6">Résumé</div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
          consequatur dolores doloribus eum, ipsum laborum magni minus molestias
          nobis quasi repellendus repudiandae sapiente sint sunt tenetur!
          Eligendi molestias mollitia soluta.
        </p>
      </q-tab-panel>
      <q-tab-panel name="client">
        <div class="text-h6">Client</div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium
          aliquam aut dignissimos dolores, ea enim eum excepturi fuga id illum
          inventore iste magni, nesciunt numquam optio provident quo
          reprehenderit voluptates!
        </p>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import OrderItems from './OrderItems'
export default {
  name: 'OrderTabs',
  components: { OrderItems },
  props: ['prepared'],
  data() {
    return {
      tab: 'articles'
    }
  }
}
</script>

<style scoped></style>
