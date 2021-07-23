<template>
  <q-card flat square bordered class="bg-white q-pa-xs q-mt-sm q-mb-md">
    <div class="row">
      <q-select
        v-model="model"
        use-input
        input-debounce="0"
        label="AJOUTER UN PRODUIT"
        :options="options"
        class="full-width"
        @filter="filterFn"
        @new-value="createValue"
        @input="selectedValue"
        @filter-abort="abortFilterFn"
        ref="qselect"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Aucun produit référencé chez ce fournisseur
              <q-btn
                v-if="showAddBtn"
                color="primary"
                label="Ajouter ce produit"
                @click="addProduct"
              />
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </q-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AddItem',
  props: {
    supplierName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      model: '',
      otherModel: '',
      options: [],
      queryProductsList: {
        size: 500,
        sort: [
          {
            updated_at: {
              order: 'desc',
              unmapped_type: 'boolean'
            }
          }
        ],
        query: {
          bool: {
            must: [],
            filter: [
              {
                multi_match: {
                  type: 'phrase',
                  query: '',
                  lenient: true
                }
              }
            ]
          }
        }
      },
      fullProductsList: null,
      cleanProductsList: null,
      showAddBtn: false
    }
  },
  methods: {
    filterFn(val, update, abort) {
      if (this.cleanProductsList !== null) {
        // already loaded
        update(() => {
          const needle = val.toLocaleLowerCase()
          this.options = this.cleanProductsList.filter(
            v => v.toLocaleLowerCase().indexOf(needle) > -1
          )
          if (this.options.length === 0 && val.length > 2) {
            this.showAddBtn = true
            this.otherModel = val
          } else {
            this.showAddBtn = false
          }
        })
        return
      }
      update(() => {
        this.getProductsList()
      })
    },
    abortFilterFn() {},
    createValue(val, done) {
      if (val.length > 0) {
        if (!this.options.includes(val)) {
          this.addThisProduct(val)
        }
      }
    },
    addProduct() {
      this.addThisProduct(this.otherModel)
      this.otherModel = ''
      this.model = ''
      this.$refs.qselect.hidePopup()
    },
    selectedValue(val) {
      this.addThisProduct(val)
      this.model = null
    },
    async getProductsList() {
      this.$q.loading.show()
      await this.requestProductsList()
      this.$q.loading.hide()
    },
    requestProductsList() {
      var url =
        this.$store.getters.apiurl +
        'generic_search/product*?token=' +
        this.$store.getters.creds.token

      this.queryProductsList.query.bool.filter[0].multi_match.query = this.supplierName

      axios
        .post(url, this.queryProductsList)
        .then(response => {
          this.fullProductsList = response.data.records
          this.prepareProducts()
        })
        .catch(error => {})
    },
    prepareProducts() {
      this.cleanProductsList = []
      this.options = []

      if (this.fullProductsList.length == 0) {
        return
      }
      var array = []
      for (var i = 0; i < this.fullProductsList.length; i++) {
        array[i] = this.fullProductsList[i]._source.title
      }

      array.sort(function(a, b) {
        var nameA = a.toLowerCase(),
          nameB = b.toLowerCase()
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })
      this.cleanProductsList = array

      // building options array
      if (this.cleanProductsList.length > 0) {
        var myArray = []
        for (var i = 0; i < this.cleanProductsList.length; i++) {
          myArray.push(this.cleanProductsList[i])
        }
      }
      this.options = myArray
    },
    addThisProduct(product) {
      this.$emit('addProduct', { data: product })
      this.otherModel = ''
      this.model = ''
    }
  },
  created() {},
  mounted() {},
  updated() {},
  computed: {}
}
</script>

<style></style>
