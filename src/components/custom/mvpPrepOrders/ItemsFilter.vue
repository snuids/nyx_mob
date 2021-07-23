<template>
  <q-btn-toggle
    v-model="modeFilter"
    unelevated
    style="border: 1px solid black; font-weight: lighter;"
    size="sm"
    toggle-color="brown-4"
    color="white"
    text-color="black"
    :options="[
      { label: 'Frais', value: 'fresh', icon: 'ac_unit' },
      { label: 'Sec', value: 'dry', icon: 'grass' },
      { value: 'all', icon: 'grass ac_unit', style: 'padding: 10px' }
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
