<template>
  <q-card class="q-pa-xs">
    <!-- TITLE -->
    <q-card-section class="row items-center">
      <div class="dialog-box-title">
        Modifier la quantité
      </div>
    </q-card-section>
    <!-- +/- BUTTONS -->
    <q-card-section class="row flex-center">
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
    </q-card-section>
    <!-- QUANTITY EXCEED BANNER-->
    <q-card-section v-if="warningBanner" class="row flex-center">
      <q-banner inline-actions class="text-white bg-red">
        <template v-slot:avatar>
          <q-icon name="warning" color="white" />
        </template>
        <b>La quantité reçue est supérieure à la quantité commandée.</b>
      </q-banner>
    </q-card-section>
    <!-- BUTTONS -->
    <q-card-actions align="right">
      <q-btn flat label="Annuler" color="primary" v-close-popup />
      <q-btn
        flat
        label="Valider"
        @click="closeWindow"
        color="primary"
        v-close-popup
      />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'QuantityAdjust',
  props: {
    quantity: {
      type: Number,
      required: true
    },
    ordered: {
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
      // this.updateData()
    },
    removeQty() {
      this.modifiedQuantity -= 1
      if (this.modifiedQuantity < 0) this.modifiedQuantity = 0
      // this.updateData()
    },
    updateData() {
      this.$emit('quantityModified', { data: this.modifiedQuantity })
    },
    closeWindow() {
      this.$emit('quantityModified', { data: this.modifiedQuantity })
      this.$emit('closeWindow')
    }
  },
  mounted() {
    //console.log(' je suis mounted() dans quantityAdjust.vue : ', this.quantity)
    this.modifiedQuantity = this.quantity
    // this.$emit('quantityModified', { data: this.modifiedQuantity })
  },
  computed: {
    warningBanner: function() {
      if (this.modifiedQuantity > this.ordered) return true
      else return false
    }
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
