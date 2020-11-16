<template>
  <div class="a-dallas">
    <q-card flat bordered class="bg-white q-ma-xs q-pa-xs">
      {{ item.full_title }} - {{ item.quantity }} -
      {{ item.received }}
    </q-card>
  </div>
</template>

<script>
export default {
  name: "CartItem",
  data() {
    return {};
  },
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    zebi() {
      console.log("debug item ::::: ", this);
    }
  },
  created() {},
  computed: {}
};
</script>

<style lang="css">
.a-dallas {
    font-size: 28px;
    color: red;
}
</style>
