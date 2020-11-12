<template>
  <q-item class="item-supplier">
    <q-card class="bg-white q-mb-sm full-width">
      <div class="row" clickable @click="onCardClick" v-ripple>
        <div class="date-toto q-py-sm">
          {{ expected_date | dateShort }}
        </div>
        <div class="cont-toto flex justify-between">
          <div class="name-toto q-py-sm q-px-lg">
            {{ supplier | uppercaseFirst }}
          </div>
          <div class="icon-toto q-py-sm q-px-lg">{{ status }}</div>
        </div>
      </div>
    </q-card>
  </q-item>

  <!-- SAVE -->
  <!-- <q-item class="full-width item-supplier">
    <q-card class="bg-white q-mb-sm full-width" ref="cardLink" id="cardLink">
      <q-resize-observable @resize="onResize" />
      <div class="row full-width" clickable @click="onCardClick" v-ripple>
        <div class="date-toto">{{ expected_date | dateShort }}</div>
        <div class="conteneur flex-inline justify-between">
          <div class="name-toto">
            {{ supplier | uppercaseFirst }}
          </div>
          <div class="icon-toto">{{ status }}</div>
        </div>
      </div>
    </q-card>
  </q-item> -->

  <!-- SAVE VAL -->
  <!-- <q-item class="full-width item-supplier">
    <q-card class="bg-white q-mb-sm full-width">
      <div
        class="row full-width justify-between"
        clickable
        @click="onCardClick"
        v-ripple
      >
        <div class="flex">
          <div class="q-py-md q-px-sm date-card">
            {{ expected_date | dateShort }}
          </div>
          <div class="q-py-md q-px-sm main-card">
            {{ supplier | uppercaseFirst }}
          </div>
        </div>
        <div class="q-py-md q-px-sm icon-card">{{ status }}</div>
      </div>
    </q-card>
  </q-item> -->
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
    return {
      cardWidth: 15
    };
  },
  methods: {
    onCardClick() {
      //console.log("clicked: ", this.id);
      //console.log("clicked: ", this.index);
      var o = { id: this.id, index: this.index };
      this.$root.$emit("toggleDisplayEvent", o);
    },
    onResize(size) {
      console.log("onResize ELEMENT : " + size.width);
      this.cardWidth = size.width;
    }
  },
  mounted() {}
};
</script>

<style lang="css">
.date-card {

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
  font-size: 1.2em;
}
.icon-card {
  background-color:rgb(226, 102, 102);
  min-width: 125px !important;
  width: auto !important;
  max-width: 200px;
  /* margin-left: 60px; */
}
.inner-cont {
    width: auto;
    min-width: auto;
}
.item-supplier {
  padding: 0px;
}

.date-toto {
  background-color:skyblue;
  font-size: 1.3em;
  min-width: 70px !important;
  max-width: 70px !important;
  min-height: 100%;
  text-align: center;
}
.name-toto {
  background-color:yellow;
  font-size: 1.3em;
}
.icon-toto {
  background-color:orangered;
  font-size: 1.3em;
  text-align: center;
}
.cont-toto {
  background-color: slategrey;
  flex-grow: 1;
}
</style>
