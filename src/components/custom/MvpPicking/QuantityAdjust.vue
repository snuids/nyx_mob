<template>
  <div class="row flex-center">
    <div class="row items-center button-container">
      <q-btn
        round
        color="primary"
        size="xl"
        class=""
        icon="remove"
        v-touch-repeat:0:150.mouse.enter.space="removeQty"
      />
      <!-- @click="removeQty" -->
      <div class="bold text-h3 qty-nbr">{{ modifiedQuantity }}</div>
      <!-- @click="addQty" -->
      <q-btn
        round
        color="primary"
        size="xl"
        class=""
        icon="add"
        v-touch-repeat:0:150.mouse.enter.space="addQty"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuantityAdjust',
  props: {
    quantity: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      modifiedQuantity: null
    }
  },
  methods: {
    addQty() {
      this.modifiedQuantity += 1
      this.updateData()
    },
    removeQty() {
      this.modifiedQuantity -= 1
      if (this.modifiedQuantity < 0) this.modifiedQuantity = 0
      this.updateData()
    },
    updateData() {
      this.$emit('quantityModified', { data: this.modifiedQuantity })
    }
  },
  mounted() {
    //console.log(' je suis mounted() dans quantityAdjust.vue : ', this.quantity)
    this.modifiedQuantity = this.quantity
    this.$emit('quantityModified', { data: this.modifiedQuantity })
  }
}
</script>

<style>
.button-container {
  /* width: 60%;
  min-width: 60%; */
}
.qty-nbr {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
