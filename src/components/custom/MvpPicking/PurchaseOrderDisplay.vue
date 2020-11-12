<template>
  <div class="a-dallas">
    <div>
      tu peux pas test
    </div>

    <div>
      <SupplierInfos />
    </div>

    <q-list class="cart-list">
      <CartItem v-for="item in allItems" :key="item.id" v-bind="item" />
    </q-list>

    <div>
      <div class="q-my-md text-center">
        <q-btn
          label="Retour"
          icon="arrow_back_ios"
          color="primary"
          class="q-mx-md q-my-md"
          @click="backToList"
          size="md"
        />
        <q-btn
          label="Valider"
          icon-right="send"
          color="primary"
          class="q-mx-md q-my-md"
          @click="validateOrder"
          size="md"
          :disable="disableValidate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import SupplierInfos from "components/custom/MvpPicking/SupplierInfos.vue";
import CartItem from "components/custom/MvpPicking/CartItem.vue";

Vue.component("SupplierInfos", SupplierInfos);
Vue.component("CartItem", CartItem);

export default {
  name: "PurchaseOrderDisplay",
  components: {
    SupplierInfos,
    CartItem
  },
  data() {
    return {
      allItems: [{}, {}, {}],
      disableValidate: true
    };
  },
  methods: {
    getPurchaseOrder(id, index) {
      //console.log(' ################ >> getPurchaseOrder [id: '+ id +'] & [index: '+ index +']')

      var url =
        this.$store.getters.apiurl +
        "generic/" +
        index +
        "/" +
        id +
        "?token=" +
        this.$store.getters.creds.token;
      //console.log('url: ', url)

      this.$q.loading.show();
      // this.timer = setTimeout(() => { this.timer = void 0 }, 4500)
      axios
        .get(url)
        .then(response => {
          //console.log(" #####  AXIOS.POST #####");
          console.log("getPurchaseOrder() => response : ", response);
          // this.rawResponse = response;
          // this.currentPurchaseOrder = response.data.data._source;
          // this.currentPurchaseOrder.line_items = Array.from(
          //   JSON.parse(this.currentPurchaseOrder.line_items)
          // );

          //console.log('test >>>>>>> ', JSON.stringify(this.currentPurchaseOrder) != JSON.stringify(this.originalPurchaseOrder))
          //console.log(" ############# >> getPurchaseOrder", this.rawResponse);

          /////////////////////////////// OLD /////////////////////////////
          // add line_items.received field if it doesn't exist yet
          // for (
          //   var i = 0;
          //   i < this.currentPurchaseOrder.line_items.length;
          //   i++
          // ) {
          //   if (this.currentPurchaseOrder.line_items[i].received == null)
          //     this.currentPurchaseOrder.line_items[i].received = -1;
          // }
          // add units_ordered & units_received if it doesn't exist yet
          // if (this.currentPurchaseOrder.units_ordered == null)
          //   this.currentPurchaseOrder.units_ordered = -1;
          // if (this.currentPurchaseOrder.units_received == null)
          //   this.currentPurchaseOrder.units_received = -1;
          // if (this.currentPurchaseOrder.cart_status == null)
          //   this.currentPurchaseOrder.cart_status = null;
          /////////////////////////////// OLD /////////////////////////////

          //this.checkCustomFieldsOrder();

          //console.log("POST RECEIVED PROCESSING", this.currentPurchaseOrder);

          // this.originalPurchaseOrder = JSON.parse(
          //   JSON.stringify(this.currentPurchaseOrder)
          // );
          // this.poDisplayed = true;
          // this.sendBtn = true;
          // this.total = this.totalItems();
          this.$q.loading.hide();
        })
        .catch(error => {
          console.log(
            "(getPurchaseOrder/GET) UN PROBLEME EST SURVENU : ",
            error
          );
          this.$q.loading.hide();
        });
    },
    backToList() {
      var o = { id: "", index: "" };
      this.$root.$emit("toggleDisplayEvent", o);
    },
    validateOrder() {}
  },
  created() {},
  mounted() {
    console.log(" recup id et index");
    //this.getPurchaseOrder(id, index)
  },
  computed: {}
};
</script>

<style lang="css">
.a-dallas {
    font-size: 28px;
    color: red;
}
.cart-list {
  background-color: grey;
}
</style>
