<template>
  <div class="zozoz">
    <q-fab
      color="primary"
      icon="calendar_today"
      :direction="direction"
      class="fixed"
      style="right: 25px; bottom: 25px; z-index: 10;"
    >
      <!-- TODAY BUTTON -->
      <q-fab-action color="primary" class="my-fab-action" icon="">
        Aujourd'hui
        <q-icon name="today" style="margin-left: 5px;" />
      </q-fab-action>

      <!-- DATE BUTTON -->
      <q-fab-action color="primary" class="my-fab-action" icon="">
        Date
        <q-icon name="event" style="margin-left: 5px;" />
      </q-fab-action>

      <!-- RANGE DATE BUTTON -->
      <q-fab-action color="primary" class="my-fab-action" icon="">
        Période
        <q-icon name="date_range" style="margin-left: 5px;" />
      </q-fab-action>
    </q-fab>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import TargetDate from 'components/custom/MvpPicking/TargetDate.vue'

Vue.component('TargetDate', TargetDate)

export default {
  name: 'FloatingMenu',
  components: {
    TargetDate
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  computed: {
    direction: function() {
      if (this.$store.getters.screenSize.appWidth > 1200) {
        // desktop
        return 'up'
      } else {
        // mobile
        if (
          this.$store.getters.screenSize.windowHeight <
          this.$store.getters.screenSize.windowWidth
        )
          return 'left'
        else return 'up'
      }
    }
  }
}
</script>

<style lang="css">
.my-fab-action {
  border-radius: 30px;
  width: 160px;
  height: 55px;
}
.q-fab-actions {
  margin-right: 185px;
}
.my-fab-action div:nth-child(2) {
  display: block;
  float: right;
  padding: 15px;
  text-align: right;
}
</style>
