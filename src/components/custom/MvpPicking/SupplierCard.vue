<template>
  <q-item class="full-width">
    <q-card
      clickable
      @click="onCardClick"
      class="row bg-white q-mb-xs full-width justify-between"
    >
      <div class="flex">
        <div class="bg-yellow">{{ expected_date | dateShort }}</div>
        <div class="bg-red q-ml-xs">{{ supplier }}</div>
      </div>
      <div class="bg-blue">{{ status }}</div>
      <!-- <q-item-side class="date-card">
        {{ expected_date | dateShort }}
      </q-item-side>

      <div class="q-ml-xs inner-cont">
        <div class="full-width">
          <q-item-main class="main-card">
            <q-item>
              {{ supplier }}
            </q-item>
          </q-item-main>

          <q-item-side class="icon-card">
            {{ status }}
          </q-item-side> 
        </div>
      </div>-->
    </q-card>
  </q-item>
</template>

<script>
export default {
  name: "SupplierCard",
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
    }
  },
  data() {
    return {};
  },
  methods: {
    onCardClick() {
      console.log("clicked");
    }
  },
  mounted() {
    console.log("i am a supplier card ");
  },
  beforeCreate() {
    console.log("ZEBI LA MOUCHEEEEEEEEEEEEEEEEEEE");
  }
};
</script>

<style lang="css">
.date-card {
  padding: 5px;
  background-color:lightskyblue;
  min-height: 100%;
  min-width: 60px !important;
  max-width: 60px !important;
}
.main-card {
  /* min-width: 230px; */
  background-color:gold;
  min-width: 70% !important;
  max-width: 550px;
  min-height: 1.1em;
  font-size: 1.4em;
}
.icon-card {
  padding: 5px;
  background-color:rgb(226, 102, 102);
  min-width: 125px !important;
  width: auto !important;
  max-width: 200px;
}
.inner-cont {
    /* width: auto;
    min-width: auto; */
}
</style>
