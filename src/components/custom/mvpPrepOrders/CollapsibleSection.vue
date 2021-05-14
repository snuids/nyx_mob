<template>
  <div>
    <div class="header">
      <span v-if="open" @click="open = !open"> &#x25b2; Fermer</span>
      <span v-if="!open" @click="open = !open"> &#x25bc; Ouvrir</span>
    </div>
    <slot v-if="open"></slot>
  </div>
</template>

<script>
export default {
  name: 'CollapsibleSection',
  data() {
    return {
      open: false
    }
  }
}
</script>

<style scoped>
.header {
  padding: 20px;
  cursor: pointer;
}
</style>
