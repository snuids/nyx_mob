<template>
  <q-page class="flex bg-grey-5 row">
    <div v-if="!isPurchaseOrderDisplayed" class="my-container full-width">
      <PurchaseOrdersList @toggleDisplay="toggleDisplay" />
      {{ showMe() }}
    </div>
    <div v-else class="">
      <PurchaseOrderDisplay @toggleDisplay="toggleDisplay" />
    </div>
  </q-page>
</template>

<script>
import Vue from "vue";
import PurchaseOrdersList from "components/custom/MvpPicking/PurchaseOrdersList.vue";
import PurchaseOrderDisplay from "components/custom/MvpPicking/PurchaseOrderDisplay.vue";

Vue.component("PurchaseOrdersList", PurchaseOrdersList);
Vue.component("PurchaseOrderDisplay", PurchaseOrderDisplay);

export default {
  name: "MvpPicking",
  components: {
    PurchaseOrdersList,
    PurchaseOrderDisplay
  },
  data() {
    return {
      leftDrawerOpen: false,
      isPurchaseOrderDisplayed: false
    };
  },
  methods: {
    showMe() {
      console.log("#### testest : ", this.$store.state.pickingModule.date);
      console.log("testest getter: ", this.$store.getters.date);
      return this.$store.getters.date;
    },
    toggleDisplay(event) {
      this.currentOrder = null;
      for (var i = 0; i < this.ordersList.length; i++) {
        if (this.ordersList[i].id == event)
          this.currentOrder = this.ordersList[i];
      }
      this.isPurchaseOrderDisplayed = !this.isPurchaseOrderDisplayed;
    }
  },
  created() {
    console.log("hello coucou");
    this.$store.registerModule("pickingModule", {
      state: {
        date: "route 66"
      },
      getters: {
        date: state => state.date
      },
      mutations: {
        redate(state, payload) {
          state.date = payload.date;
        }
      }
    });
    console.log("byebye coucou");
  },
  mounted() {
    console.log("ayayayayaye");
  },
  befpreCreate() {
    console.log("caramba");
  }
};
</script>

<style>
.custom-style {
  color: white;
}
.my-container {
  /* max-width: 800px; */
  background-color: mistyrose;
}
.my-page {
  min-height: 100vh;
}
.date-row {
  background-color: slategrey;
  min-width: 100vw !important;
}
.card-container {
  background-color: violet;
}
.card {
  background-color: white;
}
</style>
