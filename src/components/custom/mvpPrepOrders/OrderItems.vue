<template>
  <q-list bordered separator>
    <q-item v-for="(product, idx) in products" :key="idx" class="q-pa-md">
      <q-item-section
        >{{ product.quantity }} | {{ product.name }}</q-item-section
      >
      <q-btn-group class="float-right">
        <q-btn
          @click="itemClick"
          color="yellow"
          text-color="black"
          push
          label="REMB"
          unelevated
        ></q-btn>
        <q-btn
          @click="itemClick"
          color="amber"
          text-color="black"
          push
          label="MANQ"
          unelevated
        ></q-btn>
        <q-btn
          @click="itemClick"
          color="green"
          text-color="black"
          push
          label="ok"
          unelevated
        ></q-btn>
      </q-btn-group>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'OrderItems',
  props: ['products'],
  computed: {},
  methods: {
    itemClick() {
      console.log('ok')
    }
  }
}
</script>

<style scoped></style>
