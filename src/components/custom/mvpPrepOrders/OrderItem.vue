<template>
  <q-item :class="[status, 'q-pa-md']">
    <q-item-section>
      <q-badge class="frais" align="top">{{
        this.isFrais ? 'Frais' : 'Sec'
      }}</q-badge>
      <div>
        {{ product._source.quantity }} &nbsp; &nbsp;
        {{ product._source.name }}
      </div>
      &nbsp; &nbsp;
    </q-item-section>
    <q-btn-group class="float-right" rounded>
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

  computed: {
    isFrais() {
      return this.product._source.product.tags
        .map(x => x.toLowerCase())
        .includes('frais')
    },
    status() {
      return this.product._source.prep_status
    }
  },
  methods: {
    remb(product) {
      this.product._source.prep_status = 'remb'
      this.$emit('remb', product)
    },
    manq(product) {
      this.product._source.prep_status = 'manq'
      this.$emit('manq', product)
    },
    success(product) {
      this.product._source.prep_status = 'success'
      this.$emit('success', product)
    }
  }
}
</script>

<style scoped>
.remb {
  border-left: 5px solid red;
}

.manq {
  border-left: 5px solid #f2c037;
}

.success {
  border-left: 5px solid green;
}

.frais {
  max-width: 40px;
}
</style>
