<template>
  <q-item :class="[status, 'q-pa-md']">
    <q-item-section
      >{{ product._source.quantity }} |
      {{ product._source.name }}</q-item-section
    >
    <q-btn-group class="float-right " rounded>
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
  data() {
    return {
      status: null
    }
  },
  methods: {
    remb(product) {
      this.status = 'remb'
      this.$emit('remb', product)
    },
    manq(product) {
      this.status = 'manq'
      this.$emit('manq', product)
    },
    success(product) {
      this.status = 'success'
      this.$emit('success', product)
    }
  }
}
</script>

<style scoped>
.remb {
  border-left: 5px solid #c2185b;
}

.manq {
  border-left: 5px solid #f2c037;
}

.success {
  border-left: 5px solid green;
}
</style>
