<template>
  <q-btn-toggle
    v-model="modeFilter"
    spread
    class="my-custom-toggle"
    no-caps
    rounded
    unelevated
    toggle-color="primary"
    color="white"
    text-color="primary"
    :options="[
      { label: 'Frais', value: 'fresh' },
      { label: 'Sec', value: 'dry' },
      { label: 'Tout', value: 'all' }
    ]"
  ></q-btn-toggle>
</template>
<script>
export default {
  name: 'ItemsFilter',
  computed: {
    modeFilter: {
      get() {
        return this.$store.getters['mvpPrep/modeFilter']
      },
      set(newMode) {
        this.$store.commit('mvpPrep/mutate_modeFilter', newMode)
      }
    }
  },
  watch: {
    modeFilter: {
      handler: function(newFilter) {
        this.$store.commit('mvpPrep/mutate_modeFilter', newFilter)
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
