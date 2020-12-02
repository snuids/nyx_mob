<template>
  <div class="bg-grey-8 full-width grey-banner">
    <div class="whole-container">
      <div class="text-white date-banner">
        <div v-if="dateFromShort === dateToShort" class="text-center">
          Date : <b>{{ dateFrom | dateFrench }}</b>
        </div>
        <div v-else class="text-center">
          Période : du <b>{{ dateFrom | dateFrench }}</b> au
          <b>{{ dateTo | dateFrench }}</b>
        </div>
      </div>
      <div class="menu-banner float-right">
        <MainMenu @today="onToday" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import MainMenu from 'components/custom/MvpPicking/MainMenu.vue'

Vue.component('MainMenu', MainMenu)

export default {
  name: 'TargetDate',
  data() {
    return {
      dateFrom: null,
      dateTo: null,
      dateFromShort: null,
      dateToShort: null
    }
  },
  methods: {
    setNewDates(inFrom, inTo) {
      // trust the format whatever comes in
      /* 2020-11-06T00:00:00+01:00 */
      this.dateFrom = moment(inFrom)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ss+01:mm')
      this.dateTo = moment(inTo)
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm:ss+01:mm')

      // properly format short version of dates
      this.dateFromShort = moment(this.dateFrom).format('DD-MM-YYYY')
      this.dateToShort = moment(this.dateTo).format('DD-MM-YYYY')

      // register dates in store
      var obj = {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        dateFromShort: this.dateFromShort,
        dateToShort: this.dateToShort
      }
      this.$store.commit('mutate_targetDate', { dateObj: obj })

      this.$emit('dateChanged', obj)
    },
    onToday() {
      var from =
        moment()
          .startOf('day')
          .unix() * 1000

      var to =
        moment()
          .endOf('day')
          .unix() * 1000

      this.setNewDates(from, to)
    }
  },
  created() {
    if (this.$store.getters.targetDate.dateFrom == '') this.onToday()
  },
  mounted() {
    this.dateFrom = this.$store.getters.targetDate.dateFrom
    this.dateTo = this.$store.getters.targetDate.dateTo
    this.dateFromShort = this.$store.getters.targetDate.dateFromShort
    this.dateToShort = this.$store.getters.targetDate.dateToShort
  },
  beforeDestroy() {
    this.dateFrom = null
    this.dateTo = null
    this.dateFromShort = null
    this.dateToShort = null
  },
  computed: {}
}
</script>

<style>
.date-banner {
  font-size: 1.1em;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
}
.menu-banner {
  font-size: 1.1em;
}
.grey-banner {
  height: 32px;
}
.whole-container {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  display: flex;
}
</style>
