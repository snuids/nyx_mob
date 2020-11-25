<template>
  <div>
    <div class="row justify-end items-center">
      <q-badge v-if="comments" color="primary">
        <q-icon name="notes" color="white" />
      </q-badge>
      <q-badge v-if="has_dlc" color="primary">
        DLC
      </q-badge>
      <q-badge v-if="closed" color="primary">
        <q-icon name="lock" color="white" />
      </q-badge>
      <q-badge color="primary">
        {{ currentStatus() }}
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
    }
  },
  components: {},
  data() {
    return {}
  },
  methods: {
    currentStatus() {
      if (this.cart_complete === 0) {
        // missing items
        return 'commande incomplète'
      } else if (this.cart_complete === 1) {
        // nothing missing
        return 'commande complète'
      } else if (this.cart_complete === 2) {
        // waiting to be processed
        return 'en attente'
      }
    }
  }
}
</script>

<style></style>

:closed="closed" :cart_complete="cart_complete" :has_dlc="has_dlc"
:pickin_state="picking_state" :comments="comments"
