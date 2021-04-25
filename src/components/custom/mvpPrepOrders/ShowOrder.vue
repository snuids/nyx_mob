<template>
  <div>
    <div class="q-pa-xl">
      <q-btn
        color="white"
        text-color="black"
        label="orders"
        :to="{ name: 'orders' }"
        class="float-right "
      />
    </div>

    <q-list bordered separator>
      <q-item
        clickable
        v-ripple
        v-for="(product, idx) in products"
        :key="idx"
        class="q-pa-md"
      >
        <q-item-section
          >{{ product.quantity }} | {{ product.name }}</q-item-section
        >
      </q-item>
    </q-list>
    <q-page-sticky expand position="top">
      <StickyBanner></StickyBanner>
    </q-page-sticky>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'ShowOrder',
  props: ['orderId', 'status', 'hasSec', 'hasFrais', 'products']
}
</script>

<style scoped></style>
