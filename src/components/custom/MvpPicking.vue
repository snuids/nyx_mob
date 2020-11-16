<template>
  <q-page class="flex bg-grey-5 row">
    <div v-if="!isPurchaseOrderDisplayed" class="my-container full-width">
      <PurchaseOrdersList />
      <!-- {{ showMe() }} -->
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
    createCustomStore() {
      //console.log("############ Creating a custom store ############");
      this.$store.registerModule("pickingModule", {
        state: {
          targetDate: {
            dateFrom: "",
            dateTo: "",
            dateFromShort: "",
            dateToShort: ""
          },
          currentOrder: {
            meta: {
              id: "",
              index: ""
            },
            details: {},
            cart: {}
          },
          allPurchaseOrders: {}
        },
        getters: {
          targetDate: state => state.targetDate,
          currentOrder: state => state.currentOrder,
          allPurchaseOrders: state => state.allPurchaseOrders
        },
        mutations: {
          mutate_targetDate(state, payload) {
            state.targetDate = payload.dateObj;
          },
          mutate_currentOrder(state, payload) {
            state.currentOrder = payload.order;
          },
          mutate_allPurchaseOrders(state, payload) {
            state.allPurchaseOrders = payload.data;
          }
        }
      });
    },
    addEventListener() {
      this.$root.$on("toggleDisplayEvent", event => {
        this.toggleDisplay(event);
      });
    },
    removeEventListener() {
      this.$root.$off("toggleDisplayEvent");
    },
    showMe() {
      console.log("#### testest : ", this.$store.state.pickingModule.date);
      console.log("testest getter: ", this.$store.getters.date);
      return this.$store.getters.date;
    },
    toggleDisplay(event) {
      this.currentOrderMeta = event;
      this.$store.commit("mutate_currentOrder", {
        order: {
          meta: {
            id: event.id,
            index: event.index
          }
        }
      });
      this.isPurchaseOrderDisplayed = !this.isPurchaseOrderDisplayed;
    }
  },
  beforeCreate() {
    
  },
  created() {
    this.createCustomStore();
    this.addEventListener();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {
    this.removeEventListener();
    this.$store.unregisterModule("pickingModule");
  },
  destroyed() {},
  computed: {}
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
