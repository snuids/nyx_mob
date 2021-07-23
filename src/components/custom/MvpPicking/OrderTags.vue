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
    }
  },
  methods: {},
  computed: {
    badgeColor: function() {
      if (this.cart_complete === 0) {
        return 'orange-9' 
      } else if (this.cart_complete === 1) {
        return 'green-9' 
      } else if (this.cart_complete === 2) {
        return 'primary' 
      }
    },
    textStatus: function() {
      if (this.cart_complete === 0) {
        return 'commande incomplète' 
      } else if (this.cart_complete === 1) {
        return 'commande complète' 
      } else if (this.cart_complete === 2) {
        return 'en attente' 
      }
    },
  },
  mounted() {
  }
}
</script>

<style>
.icon-spacer {
  margin: 1px;
}
</style>
