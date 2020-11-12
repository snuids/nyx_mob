<template>
  <div class="bg-grey-8 q-py-sm q-px-md text-white">
    <div v-if="dateFromShort == dateToShort" class="text-center">
      Date : <b>{{ dateFrom | dateFrench }}</b>
    </div>
    <div v-else class="text-center">
      Période : du <b>{{ dateFrom | dateFrench }}</b> au
      <b>{{ dateTo | dateFrench }}</b>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Vue from "vue";

export default {
  name: "TargetDate",
  data() {
    return {
      dateFrom: null,
      dateTo: null,
      dateFromShort: null,
      dateToShort: null
    };
  },
  methods: {
    makeDatesBundle() {
      // console.log("##############[ ENTERING makesDateBundle() ]##############");
      this.dateFromShort = moment(this.dateFrom).format("DD-MM-YYYY");
      this.dateToShort = moment(this.dateTo).format("DD-MM-YYYY");
      // console.log("##############[ EXITING makesDateBundle() ]##############");
    },
    onToday() {
      /* 2020-11-06T00:00:00+01:00 */

      var from =
        moment()
          .startOf("day")
          .unix() * 1000;
      this.dateFrom = moment(from).format("YYYY-MM-DDTHH:mm:ss+01:mm");

      var to =
        moment()
          .endOf("day")
          .unix() * 1000;
      this.dateTo = moment(to).format("YYYY-MM-DDTHH:mm:ss+01:mm");

      this.makeDatesBundle();
      // console.log(
      //   " DEBUG <TargetDate/> onToday() : dateFrom/dateTo : " +
      //     moment(this.dateFrom).format("DD-MM-YYYY HH:mm") +
      //     " / " +
      //     moment(this.dateTo).format("DD-MM-YYYY HH:mm")
      // );
      // console.log(
      //   " DEBUG <TargetDate/> onToday() : dateFromShort/dateToShort : " +
      //     this.dateFromShort +
      //     " / " +
      //     this.dateToShort
      // );
      var obj = {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        dateFromShort: this.dateFromShort,
        dateToShort: this.dateToShort
      };
      this.$store.commit("mutate_targetDate", { dateObj: obj });
      /* VUE-X TESTS */
      // console.log(
      //   "test targetDate.vue => onToday() : " + this.$store.getters.date
      // );
      // this.$store.commit("redate", { date: "allo" });
      // console.log(
      //   "test targetDate.vue => onToday() post commit : " +
      //     this.$store.getters.date
      // );
    }
  },
  created() {
    this.onToday();
  },
  mounted() {},
  beforeDestroy() {
    this.dateFrom = null;
    this.dateTo = null;
    this.dateFromShort = null;
    this.dateToShort = null;
  },
  computed: {}
};
</script>

<style lang="css"></style>
