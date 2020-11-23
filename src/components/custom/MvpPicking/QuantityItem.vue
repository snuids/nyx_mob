<template>
  <div class="full-height">
    <q-chip
      color="primary"
      text-color="white"
      class="quantity-chip"
      size="16px"
    >
      <div class="">{{ current_received }} / {{ quantity }}</div>
      <!-- 666 / 666 -->
      <!-- 85px -->
    </q-chip>
  </div>
</template>

<script>
export default {
  name: 'QuantityItem',
  data() {
    return {
      current_received: 0
    }
  },
  props: {
    quantity: {
      type: Number
    },
    received: {
      type: Number
    }
  },
  methods: {},
  mounted() {
    console.log(
      'je suis quantityItem et je reocis ces deux props : ' +
        this.quantity +
        ' & ' +
        this.received
    )
  }
}
</script>

<style>
.quantity-chip {
  width: 85px;
  min-width: 85px;
}
.numbers {
  margin-right: auto;
  margin-left: auto;
}
</style>
