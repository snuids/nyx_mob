<template>
  <q-page>
    <div v-for="order in orders">
      {{ order }}
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'OrderList',
  props: ['orders']
}
</script>

<style scoped></style>
