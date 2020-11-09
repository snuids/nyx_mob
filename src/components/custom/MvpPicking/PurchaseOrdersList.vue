<template>
  <div class="">
    <TargetDate ref="TargetDateInstance" />

    <div class="q-pa-xs">
      <q-list class="supplier-list">
        <SupplierCard
          v-for="order in allPurchaseOrders"
          :key="order.id"
          v-bind="order"
        />
      </q-list>
    </div>

    <div>
      <FloatingMenu ref="FloatingMenuInstance" />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import axios from "axios";
import TargetDate from "components/custom/MvpPicking/TargetDate.vue";
import SupplierCard from "components/custom/MvpPicking/SupplierCard.vue";
import FloatingMenu from "components/custom/MvpPicking/FloatingMenu.vue";

Vue.component("TargetDate", TargetDate);
Vue.component("SupplierCard", SupplierCard);
Vue.component("FloatingMenu", FloatingMenu);

export default {
  name: "PurchaseOrdersList",
  components: {
    TargetDate,
    SupplierCard,
    FloatingMenu
  },
  data() {
    return {
      fullResponse: null,
      allPurchaseOrders: [],
      queryList: {
        size: 5000,
        sort: [
          {
            expected_date: {
              order: "desc",
              unmapped_type: "boolean"
            }
          }
        ],
        _source: {
          includes: [
            "number",
            "status",
            "type",
            "expected_date",
            "supplier",
            "line_items",
            "comment",
            "units_ordered",
            "units_received",
            "updated_at",
            "validated"
          ]
        },
        query: {
          bool: {
            must: [
              {
                range: {
                  expected_date: {
                    gte: "",
                    lte: ""
                  }
                }
              }
            ]
          }
        }
      },
      indice: "purchase_order*"
    };
  },
  methods: {
    onCardClick() {
      this.$emit("toggleDisplay", this.id);
    },
    getPoList() {
      // console.log("#################### getPoList ####################");
      // console.log("###################################################");
      // console.log(" Je veux acceder aux props de mon child targetDate");
      // console.log(
      //   " test dateFrom = " +
      //     moment(this.$refs.TargetDateInstance.dateFrom).format(
      //       "DD-MM-YYYY HH:mm:ss"
      //     )
      // );
      // console.log(
      //   " test dateTo = " +
      //     moment(this.$refs.TargetDateInstance.dateTo).format(
      //       "DD-MM-YYYY HH:mm:ss"
      //     )
      // );

      //this.isDateCorrect();
      this.queryList.query.bool.must[0].range.expected_date.gte = this.$refs.TargetDateInstance.dateFrom;
      this.queryList.query.bool.must[0].range.expected_date.lte = this.$refs.TargetDateInstance.dateTo;

      var url =
        this.$store.getters.apiurl +
        "generic_search/" +
        this.indice +
        "?token=" +
        this.$store.getters.creds.token;
      //console.log("url : ", url);

      this.$q.loading.show();
      axios
        .post(url, this.queryList)
        .then(response => {
          this.fullResponse = response;
          console.log("getPoList() full response : ", response);

          this.allPurchaseOrders = [];
          for (var i = 0; i < response.data.records.length; i++) {
            this.allPurchaseOrders.push(response.data.records[i]._source);
          }
          console.log(
            "getPoList() allPurchaseOrders: ",
            this.allPurchaseOrders
          );

          // UPDATING DISPLAY TRICK
          var tmp = this.allPurchaseOrders;
          this.allPurchaseOrders = null;
          this.allPurchaseOrders = tmp;

          this.$q.loading.hide();
        })
        .catch(error => {
          console.log(
            "| getPoList() / POST | UN PROBLEME EST SURVENU : ",
            error
          );
          this.$q.loading.hide();
        });
    }
  },
  mounted() {
    //this.onToday();
    console.log("COUCOU");
    this.getPoList();
    console.log("COUCOU FIN");
  }
};
</script>

<style lang="css">
.supplier-list {
  padding: 0px !important;
  border: none;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
</style>
