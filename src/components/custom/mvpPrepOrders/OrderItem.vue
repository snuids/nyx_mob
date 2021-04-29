<template>
  <q-item class="q-pa-md">
    <q-item-section
      >{{ product._source.quantity }} |
      {{ product._source.name }}</q-item-section
    >
    <q-btn-group class="float-right">
      <q-btn
        @click="remb(product)"
        color="yellow"
        text-color="black"
        push
        label="REMB"
        unelevated
      ></q-btn>
      <q-btn
        @click="manq(product)"
        color="amber"
        text-color="black"
        push
        label="MANQ"
        unelevated
      ></q-btn>
      <q-btn
        @click="success(product)"
        color="green"
        text-color="black"
        push
        label="ok"
        unelevated
      ></q-btn>
    </q-btn-group>
  </q-item>
</template>

<script>
export default {
  name: 'OrderItem',
  props: ['product'],
  methods: {
    remb(product) {
      this.$emit('remb', product)
    },
    manq(product) {
      this.$emit('manq', product)
    },
    success(product) {
      this.$emit('success', product)
    }
  }
}
</script>

<style scoped></style>
