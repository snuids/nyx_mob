<template>
  <q-item class="q-pa-xs">
    <q-card class="bg-white full-width">
      <div class="row" clickable @click="onCardClick" v-ripple>
        <div class="col-xs-2 col-sm-1 text-center date q-pa-sm">
          {{ expected_date | dateShort }}
        </div>
        <div class="col">
          <div class="row justify-between">
            <div class="col-xs-12 col-sm-9 name q-pa-sm">
              {{ supplier | uppercaseFirst }}
            </div>
            <div class="col-xs-12 col-sm-3 meta q-pa-sm">
              {{ status }}
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-item>
</template>

<script>
export default {
  name: 'SupplierCard',
  props: {
    expected_date: {
      type: String,
      required: true
    },
    supplier: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    index: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    onCardClick() {
      //console.log("clicked: ", this.id);
      //console.log("clicked: ", this.index);
      var o = { id: this.id, index: this.index }
      this.$root.$emit('toggleDisplayEvent', o)
    }
  },
  mounted() {}
}
</script>

<style lang="css">
.meta {
  text-align: right;
  font-size: 1.2em;
}
.date {
  font-size: 1.2em;
}
.name {
  font-size: 1.2em;
}
</style>
