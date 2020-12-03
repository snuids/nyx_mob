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
      // console.log('coucou')
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
        // this.options = stringOptions
        this.getProductsList()
      })
    },
    abortFilterFn() {
      console.log('delayed filter aborted')
    },
    createValue(val, done) {
      console.log('allo', val)

      if (val.length > 0) {
        if (!this.options.includes(val)) {
          //done(val, 'add-unique')
          console.log('a l huile')
          this.addThisProduct(val)
        }
      }
    },
    addProduct() {
      console.log('Foi de morue ', this.otherModel)
      this.addThisProduct(this.otherModel)
      this.otherModel = ''
    },
    selectedValue(val) {
      console.log('TU PEUX PAS TEST')
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
      console.log('url : ', url)

      this.queryProductsList.query.bool.filter[0].multi_match.query = this.supplierName

      axios
        .post(url, this.queryProductsList)
        .then(response => {
          this.fullProductsList = response.data.records
          console.log(' recu liste de produits : ', this.fullProductsList)
          this.prepareProducts()
          // console.log('debug post bazar : ', this.options)
        })
        .catch(error => {
          console.log(
            '| requestProductsList / POST | UN PROBLEME EST SURVENU : ',
            error
          )
        })
    },
    prepareProducts() {
      if (this.fullProductsList.length == 0) {
        // this.noProducts = true;
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
    },
    activate(index) {
      // addThisProduct(index)
      console.log("coucou je tente d'activer une carte")
      this.active = true
    }
  },
  created() {},
  mounted() {
    //this.getProductsList()
  },
  updated() {},
  computed: {}
}
</script>

<style></style>
