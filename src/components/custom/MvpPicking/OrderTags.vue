<template>
  <div>
    <div class="row justify-end items-center">
      <q-badge
        v-if="has_direct"
        :color="badgeColor"
        class="icon-spacer q-pa-xs"
      >
        AJOUT(S)
      </q-badge>
      <q-badge v-if="comments" :color="badgeColor" class="icon-spacer q-pa-xs">
        <q-icon name="notes" color="white" />
      </q-badge>
      <q-badge v-if="has_dlc" :color="badgeColor" class="icon-spacer q-pa-xs">
        DLC
      </q-badge>
      <q-badge v-if="closed" :color="badgeColor" class="icon-spacer q-pa-xs">
        <q-icon name="lock" color="white" />
      </q-badge>
      <q-badge :color="badgeColor" class="icon-spacer text-uppercase q-pa-xs">
        <!-- {{ currentStatus() }} -->
        {{ textStatus }}
      </q-badge>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderTags',
  props: {
    closed: {
      type: Boolean,
      required: true
    },
    cart_complete: {
      type: Number,
      required: true
    },
    has_dlc: {
      type: Boolean,
      required: true
    },
    picking_state: {
      type: Number,
      required: true
    },
    comments: {
      type: Boolean,
      required: true
    },
    has_direct: {
      type: Boolean,
      required: true
    }
  },
  components: {},
  data() {
    return {
      badgeColor: 'primary',
      textStatus: 'en attente'
    }
  },
  methods: {},
  mounted() {
    console.log(' debug ordertags.vue >>> has_dlc >>> ', this.has_dlc)
    if (this.cart_complete === 0) {
      // missing items
      this.badgeColor = 'orange-9'
      this.textStatus = 'commande incomplète'
    } else if (this.cart_complete === 1) {
      // nothing missing
      this.badgeColor = 'green-9'
      this.textStatus = 'commande complète'
    } else if (this.cart_complete === 2) {
      // waiting to be processed
      this.badgeColor = 'primary'
      this.textStatus = 'en attente'
    }
  }
}
</script>

<style>
.icon-spacer {
  margin: 1px;
}
</style>
