<template>
  <q-page class="bg-grey-5">
    <!-- SINGLE PURCHASE ORDER -->
    <div v-if="poDisplayed" class="q-pa-xs">
      <!-- CART / COLLAPSIBLE SUPPLIER INFOS -->
      <q-card flat bordered class="bg-white q-ma-xs q-pa-xs">
        <q-collapsible
          icon="perm_identity"
          :label="capitalizeFistLetter(this.currentPurchaseOrder.supplier)"
        >
          <q-card class="q-pa-sm">
            <div class="row flex-center">
              <div>
                <h5>
                  {{ capitalizeFistLetter(this.currentPurchaseOrder.supplier) }}
                </h5>
              </div>
            </div>
            <q-card-separator />
            <div class="row q-pa-sm q-mb-md commande">
              <div class="col-6">
                <div>
                  <span class="caption">Date commande : </span>
                  <b>
                    {{
                      goodLookingDate(this.currentPurchaseOrder.expected_date)
                    }}
                  </b>
                </div>
                <div>
                  <span class="caption">Statut actuel : </span>
                  <b>{{ this.currentPurchaseOrder.status }}</b>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <span class="caption">Numéro de commande : </span>
                  <b>{{ this.currentPurchaseOrder.number }}</b>
                </div>
                <div>
                  <span class="caption">Type de bon : </span>
                  <b>{{ this.currentPurchaseOrder.type }}</b>
                </div>
              </div>
            </div>
            <q-card-separator />
            <div class="row q-pa-sm q-mb-md contact">
              <div class="col-6">
                <div>
                  <span class="caption">Contact : </span>
                  <b>{{ this.currentPurchaseOrder.sales_contact_name }}</b>
                </div>
                <div>
                  <span class="caption">Téléphone : </span>
                  <b>{{ this.currentPurchaseOrder.sales_phone_number }}</b>
                </div>
                <div>
                  <span class="caption">Email : </span>
                  <b>{{ this.currentPurchaseOrder.sales_contact_email }}</b>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <span class="caption">Adresse : </span>
                  <b>{{ this.currentPurchaseOrder.address_line_1 }}</b>
                </div>
                <div>
                  <b
                    >{{ this.currentPurchaseOrder.post_code }}
                    {{ this.currentPurchaseOrder.city }}</b
                  >
                </div>
                <div>
                  <span class="caption">Complément : </span>
                  <b>{{ this.currentPurchaseOrder.address_line_2 }}</b>
                </div>
              </div>
            </div>
            <q-card-separator />
            <div class="row q-pa-sm q-mb-sm items">
              <div class="col-6">
                <div>
                  <span class="caption">Nb d'items : </span>
                  <b>{{ this.currentPurchaseOrder.line_items.length }}</b>
                </div>
              </div>
              <div class="col-6">
                <div>
                  <span class="caption">Nb total de produits : </span>
                  <b>{{ this.total }}</b>
                </div>
              </div>
            </div>
            <q-card-separator />
            <q-btn
              color="primary"
              class="full-width q-my-sm"
              label="Ajouter un produit au bon"
              icon="add"
              @click="addProduct"
              size="lg"
            />
            <q-btn
              color="primary"
              class="full-width q-my-sm"
              label="Envoyer un message sur slack"
              icon="chat_bubble_outline"
              @click="showSlackMessage"
              size="lg"
            />
            <q-btn
              color="primary"
              class="full-width q-my-sm"
              label="Ajouter un commentaire au bon"
              icon="notes"
              @click="showOrderComment"
              size="lg"
            />
          </q-card>
        </q-collapsible>

        <div class="">
          <!-- ALERT BOX -->
          <div class="q-my-sm">
            <q-alert
              v-if="this.currentPurchaseOrder.comment"
              type="info"
              icon="message"
              style="width: 75%; margin: auto;"
            >
              <span>{{ this.currentPurchaseOrder.comment }}</span>
            </q-alert>
          </div>

          <!-- /////////////////////////////////////////////// -->
          <!-- /////////////// CART ITEMS LIST /////////////// -->
          <q-list class="bg-white" separator bordered>
            <q-item
              :class="getTheColor(item, 'bg')"
              v-for="(item, index) in this.currentPurchaseOrder.line_items"
              :key="item.product_id"
              style="padding: 8px; min-height:60px;"
            >
              <q-item-side style="max-width: 150px;">
                <div :style="getTheColor(item, 'name')" name="q-item-label">
                  {{ item.full_title }}
                </div>
              </q-item-side>
              <q-item-main>
                <div
                  class="q-mr-xs text-right"
                  style="display: inline-block; min-width: 75px; float: right;"
                >
                  <span
                    class="caption q-mx-sm"
                    :style="getTheColor(item, 'name')"
                  >
                    {{ getDlc(item) }}
                  </span>
                  <q-btn
                    label="DLC"
                    small
                    style="margin-right: 15px; background-color: #9f9999; color: white;"
                    @click="openDlcBox(index)"
                  />
                  <q-chip
                    small
                    style="width: 75px; text-align: center"
                    :color="getTheColor(item, 'chip')"
                  >
                    <b>{{ chipFill(item.quantity, item.received) }}</b>
                  </q-chip>
                </div>
              </q-item-main>
              <q-item-side>
                <div>
                  <!-- old icon : settings -->
                  <q-btn
                    size="20px"
                    flat
                    dense
                    square
                    icon="priority_high"
                    :color="getTheColor(item, 'btn')"
                    @click="openProblemBox(index)"
                    class="btn-po"
                  />
                  <q-btn
                    size="20px"
                    flat
                    dense
                    square
                    icon="done"
                    :color="getTheColor(item, 'btn')"
                    @click="lineIsOk(index)"
                    class="btn-po"
                  />
                </div>
              </q-item-side>
            </q-item>
          </q-list>
        </div>

        <!-- BUTTONS -->
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
      </q-card>

      <!-- DLC BOX -->
      <q-dialog v-model="dlcBox" @ok="onOkDlcPicker" minimized>
        <span slot="title">Renseigner la DLC</span>
        <div slot="body">
          <q-datetime
            v-model="dateDlc"
            minimal
            stack-label="Date limite de consommation"
          />
        </div>
        <template slot="buttons" slot-scope="props">
          <q-btn flat label="Valider" color="primary" @click="props.ok" />
        </template>
      </q-dialog>

      <!-- REPORT PROBLEM DIALOG BOX -->
      <q-dialog
        v-model="problemBox"
        @ok="onOkProblem"
        @cancel="onCancelProblem"
      >
        <span slot="title">Quantité reçue</span>
        <div slot="body">
          <div class="flex-center row q-my-lg">
            <q-btn
              round
              color="primary"
              @click="onChangeQty(-1)"
              :repeat-timeout="100"
              size="lg"
            >
              <q-icon name="remove" />
            </q-btn>
            <q-input
              v-model="currentEditQty_received"
              align="center"
              hide-underline
              type="number"
              style="max-width: 50px; width: 50px;"
              :min="0"
              :max="currentEditQty"
              class="q-mx-lg custom-input"
              @focus="focusField"
              @blur="blurField"
            />
            <q-btn
              round
              color="primary"
              @click="onChangeQty(1)"
              :repeat-timeout="100"
              size="lg"
            >
              <q-icon name="add" />
            </q-btn>
          </div>
        </div>
        <template slot="buttons" slot-scope="props">
          <q-btn flat label="Annuler" color="primary" @click="props.cancel" />
          <q-btn flat label="Valider" color="primary" @click="props.ok" />
        </template>
      </q-dialog>

      <!-- COMMENT THE ORDER -->
      <q-modal v-model="orderCommentBox" minimized>
        <div style="padding: 15px">
          <q-input
            v-model="orderComment"
            type="textarea"
            placeholder="Votre commentaire..."
            :max-height="100"
            rows="7"
            :count="300"
          />
          <q-btn
            class="q-my-md float-right"
            color="primary"
            label="Envoyer"
            icon-right="send"
            @click="saveComment()"
            size="md"
          />
        </div>
      </q-modal>

      <!-- SEND A MESSAGE ON SLACK -->
      <q-modal v-model="slackPushMessageBox" minimized>
        <div style="padding: 15px">Envoyer un message sur slack</div>
        <div class="q-px-md" style="color:red;">Channel : #appro</div>
        <div class="q-px-md" style="color:blue;">
          [
          {{ capitalizeFistLetter(this.$store.getters.creds.user.firstname) }} |
          {{ capitalizeFistLetter(this.currentPurchaseOrder.supplier) }} ]
        </div>
        <div style="padding: 15px">
          <q-input
            v-model="slackPushMessage"
            type="textarea"
            placeholder="Tapez votre message..."
            :max-height="100"
            rows="7"
            :count="300"
          />
          <q-btn
            class="q-my-md float-right"
            color="primary"
            label="Envoyer"
            icon-right="send"
            @click="
              sendSlackMsg(
                '#appro',
                currentPurchaseOrder.supplier,
                currentPurchaseOrder.number,
                currentPurchaseOrder.expected_date,
                null
              )
            "
            size="md"
          />
        </div>
      </q-modal>

      <!-- ADD A RAW PRODUCT -->
      <q-modal v-model="productSearch" maximized>
        <div style="padding: 15px">
          <div class="q-display-1 q-mb-md" style="max-width: 280px;">
            {{ capitalizeFistLetter(currentPurchaseOrder.supplier) }}
            <span class="absolute-top-right" style="margin: 15px;">
              <q-btn
                color="primary"
                @click="productSearch = false"
                label="Fermer"
              />
            </span>
          </div>
          <div>
            <div>
              <template v-if="noProducts">
                <q-item class="q-ma-lg q-pa-lg">
                  Aucun produit trouvé
                </q-item>
              </template>
              <template v-else>
                <q-list class="bg-white" separator bordered>
                  <q-item
                    v-for="(item, index) in this.productList"
                    :key="item.id"
                    style="padding: 8px; min-height:60px;"
                  >
                    <q-item-main>
                      <div
                        class="q-mr-xs text-right"
                        style="display: inline-block; min-width: 75px; 
                          float: right;"
                      >
                        {{ item.title }}
                      </div>
                    </q-item-main>
                    <q-item-side>
                      <div>
                        <q-btn
                          color="primary"
                          round
                          icon="add"
                          @click="openRawQuantity(index)"
                          size="md"
                        />
                      </div>
                    </q-item-side>
                  </q-item>
                </q-list>
              </template>
            </div>
          </div>
        </div>
      </q-modal>

      <!-- ADD A QUANTITY TO THE NEW PRODUCT -->
      <q-dialog
        v-model="rawQuantityBox"
        @ok="addThisProduct()"
        @cancel="onCancelRaw"
      >
        <span slot="title">Indiquez la quantité</span>
        <div slot="body">
          <div class="flex-center row q-my-lg">
            <q-btn
              round
              color="primary"
              @click="onChangeRawQty(-1)"
              :repeat-timeout="100"
            >
              <q-icon name="remove" />
            </q-btn>
            <q-input
              v-model="rawQty"
              align="center"
              hide-underline
              type="number"
              style="max-width: 50px; width: 50px;"
              :min="0"
              class="q-mx-lg custom-input"
              @focus="focusRawQty"
              @blur="blurRawQty"
            />
            <q-btn
              round
              color="primary"
              @click="onChangeRawQty(1)"
              :repeat-timeout="100"
            >
              <q-icon name="add" />
            </q-btn>
          </div>
        </div>
        <template slot="buttons" slot-scope="props">
          <q-btn flat label="Annuler" color="primary" @click="props.cancel" />
          <q-btn flat label="Valider" color="primary" @click="props.ok" />
        </template>
      </q-dialog>
    </div>

    <!-- PURCHASE ORDERS LIST -->
    <div v-else>
      <!-- REFERENCE DATE -->
      <div class="date-ref bg-grey-8 q-py-sm q-px-md text-white">
        <div v-if="this.dateFromShort === this.dateToShort" class="text-center">
          Date : <b>{{ goodLookingDate(this.dateFrom) }}</b>
        </div>
        <div v-else class="text-center">
          Période : du <b>{{ goodLookingDate(this.dateFrom) }}</b> au
          <b>{{ goodLookingDate(this.dateTo) }}</b>
        </div>
      </div>
      <!-- INFINITE SCROLL / PO LIST-->
      <q-infinite-scroll
        :handler="loadMore"
        v-if="poList.length"
        class="q-pa-sm"
        style="padding-bottom: 100px;"
      >
        <div>
          <q-card
            v-for="(purchaseOrder, index) in poList"
            :key="purchaseOrder.id"
            class="custom-card q-mb-sm"
            :text-color="getTextColor(purchaseOrder._source.status)"
            :color="getBgColor(purchaseOrder._source.status)"
          >
            <div
              @click="getPurchaseOrder(purchaseOrder._id, purchaseOrder._index)"
              v-ripple
              class="q-py-xs q-px-sm cursor-pointer relative-position full-height"
            >
              <div class="row full-width full-height">
                <div
                  style="float: left; display: inline-flex; font-size: 1.1em; font-weight: bold;"
                >
                  <div
                    class="q-mr-sm full-height caption"
                    style="min-width: 50px;"
                  >
                    <span :style="getTextColor(purchaseOrder._source.status)">
                      {{ purchaseOrder._source.expected_date | formatDate }}
                    </span>
                  </div>
                  <div class="q-mr-sm caption" style="min-width: 250px;">
                    <span :style="getTextColor(purchaseOrder._source.status)">
                      {{ purchaseOrder._source.supplier }}
                    </span>
                  </div>
                </div>
                <div
                  style="display:block; float: right; min-width: 150px; margin-left: auto;"
                >
                  <div style="display: inline-flex;">
                    <div class="q-mr-sm caption" style="min-width: 50px;">
                      <span :style="getTextColor(purchaseOrder._source.status)">
                        {{ checkNumber(purchaseOrder._source.number) }}
                      </span>
                    </div>
                    <div style="min-width: 40px; text-align: center;">
                      <q-icon
                        v-if="purchaseOrder._source.comment"
                        color="white"
                        name="message"
                      />
                    </div>
                    <div style="min-width: 120px; text-align: right;">
                      <q-chip
                        v-if="isThereChip(purchaseOrder._source.status)"
                        :color="getChipColor(purchaseOrder._source.status)"
                        style="width: 120px; text-align: center;"
                        dense
                      >
                        <b>{{ chipStatus(purchaseOrder._source.status) }}</b>
                      </q-chip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </q-infinite-scroll>

      <!-- BOX IF NO DATA RECEIVED-->
      <div v-else class="q-pa-md">
        <q-card class="caption bg-white fixed-center">
          <q-card-main class="q-pa-md">
            <b>Aucun résultat trouvé</b>
          </q-card-main>
        </q-card>
      </div>
    </div>

    <!-- FLOATING ACTION BUTTON -->
    <q-fab
      v-if="!poDisplayed"
      v-model="overlayFab"
      color="primary"
      icon="calendar_today"
      direction="up"
      class="fixed"
      style="right: 25px; bottom: 25px; z-index: 10;"
      @click="toggleFab"
    >
      <!-- TODAY BUTTON -->
      <q-fab-action
        color="primary"
        @click="onToday"
        class="my-fab-action"
        icon=""
      >
        Aujourd'hui
        <q-icon name="today" style="margin-left: 5px;" />
      </q-fab-action>
      <!-- DATE BUTTON -->
      <q-fab-action
        color="primary"
        @click="pickDateDialog = true"
        class="my-fab-action"
        icon=""
      >
        Date
        <q-icon name="event" style="margin-left: 5px;" />
      </q-fab-action>
      <!-- RANGE DATE BUTTON -->
      <q-fab-action
        color="primary"
        @click="pickRangeDateDialog = true"
        class="my-fab-action"
        icon=""
      >
        Période
        <q-icon name="date_range" style="margin-left: 5px;" />
      </q-fab-action>
    </q-fab>

    <!-- DATE PICKER DIALOG BOX -->
    <q-dialog v-model="pickDateDialog" @ok="onOkDatePicker">
      <!-- <span slot="title">Choisir un jour</span> -->
      <div
        slot="title"
        style="height: 450px; min-height: 450px !important; width: 330px; min-width: 330px !important;"
      >
        <q-datetime-picker v-model="curSelDate" format="DD/MM/YYYY" />
      </div>
      <template slot="buttons" slot-scope="props">
        <q-btn flat label="Valider" color="primary" @click="props.ok" />
      </template>
    </q-dialog>

    <!-- RANGE DATE PICKER DIALOG BOX -->
    <q-dialog v-model="pickRangeDateDialog" @ok="onOkRangeDatePicker">
      <span slot="title">Choisir une période</span>
      <div slot="body">
        <q-datetime minimal v-model="dateFrom" stack-label="Date de début" />
        <q-datetime minimal v-model="dateTo" stack-label="Date de fin" />
      </div>
      <template slot="buttons" slot-scope="props">
        <q-btn flat label="Valider" color="primary" @click="props.ok" />
      </template>
    </q-dialog>

    <!-- FAB OVERLAY -->
    <template>
      <q-modal
        v-model="overlayFab"
        minimized
        class="my-modal"
        style="z-index: 1;"
      >
      </q-modal>
    </template>
  </q-page>
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "PageIndex",
  // #region DATA
  data() {
    return {
      poDisplayed: false,
      curSelDate: null,
      dateFrom: null,
      dateFromShort: null,
      dateTo: null,
      dateToShort: null,
      range: null,
      pickDateDialog: false,
      pickRangeDateDialog: false,
      queryPoList: {
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
      queryProductsList: {
        size: 500,
        sort: [
          {
            updated_at: {
              order: "desc",
              unmapped_type: "boolean"
            }
          }
        ],
        query: {
          bool: {
            must: [],
            filter: [
              {
                multi_match: {
                  type: "phrase",
                  query: "",
                  lenient: true
                }
              }
            ]
          }
        }
      },
      poList: [],
      productList: [],
      indice: "purchase_order*",
      indice2: "product*",
      indice3: "nyx_user",
      rawResponse: null,
      currentPurchaseOrder: null,
      originalPurchaseOrder: null,
      currentCart: null,
      columns: [
        {
          name: "name",
          required: true,
          label: "Produit",
          align: "left",
          field: "full_title",
          sortable: true,
          style: "width: 200px"
        },
        {
          name: "qty",
          required: true,
          label: "Qté cdée",
          align: "left",
          field: "quantity",
          sortable: false,
          style: "width: 40px"
        },
        {
          name: "received",
          required: false,
          label: "Qté reçue",
          align: "left",
          field: "received",
          sortable: false,
          style: "width: 40px"
        },
        {
          name: "action",
          required: false,
          label: "Actions",
          align: "right",
          field: "action",
          sortable: false,
          style: "width: 100px"
        }
      ],
      pagination: { rowsPerPage: 500 },
      problemBox: false,
      currentEditId: null,
      currentEditQty: null,
      currentEditQty_received: 0,
      sendBtn: true,
      overlayFab: false,
      showTooltip: true,
      scrollPickerOptions: [],
      total: 0,
      tmpProp: null,
      minimizedModal: false,
      productSearch: false,
      noProducts: false,
      rawQuantityBox: false,
      rawQty: 1,
      rawIndex: null,
      orderCommentBox: false,
      orderComment: null,
      slackPushMessageBox: false,
      slackPushMessage: null,
      slackMention: [
        { user: "UserName1", id: "<@xxxx>" },
        { user: "UserName2", id: "<@xxxx>" }
      ],
      disableValidate: true,
      dlcBox: false,
      dateDlc: null
    };
  },
  // #endregion
  //#region METHODS
  methods: {
    getPoList() {
      this.isDateCorrect();
      this.queryPoList.query.bool.must[0].range.expected_date.gte = this.dateFrom;
      this.queryPoList.query.bool.must[0].range.expected_date.lte = this.dateTo;

      var url =
        this.$store.getters.apiurl +
        "generic_search/" +
        this.indice +
        "?token=" +
        this.$store.getters.creds.token;

      this.$q.loading.show();
      axios
        .post(url, this.queryPoList, {
          headers: { "Content-Type": "application/json" }
        })
        .then(response => {
          this.poList = response.data.records;
          this.checkCustomFields();

          // UPDATING DISPLAY TRICK
          var tmp = this.poList;
          this.poList = null;
          this.poList = tmp;

          this.$q.loading.hide();
        })
        .catch(error => {
          console.log("| getPoList / POST | UN PROBLEME EST SURVENU : ", error);
          this.$q.loading.hide();
        });
    },
    getPurchaseOrder(id, index) {
      var url =
        this.$store.getters.apiurl +
        "generic/" +
        index +
        "/" +
        id +
        "?token=" +
        this.$store.getters.creds.token;

      this.$q.loading.show();
      axios
        .get(url)
        .then(response => {
          this.rawResponse = response;
          this.currentPurchaseOrder = response.data.data._source;
          this.currentPurchaseOrder.line_items = Array.from(
            JSON.parse(this.currentPurchaseOrder.line_items)
          );
          this.checkCustomFieldsOrder();

          this.originalPurchaseOrder = JSON.parse(
            JSON.stringify(this.currentPurchaseOrder)
          );
          this.poDisplayed = true;
          this.sendBtn = true;
          this.total = this.totalItems();
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
    checkCustomFields() {
      for (var i = 0; i < this.poList.length; i++) {
        if (this.poList[i]._source.units_ordered == null)
          this.poList[i]._source.units_ordered = -1;
        if (this.poList[i]._source.units_received == null)
          this.poList[i]._source.units_received = -1;
        if (this.poList[i]._source.cart_status == null)
          this.poList[i]._source.cart_status = "empty";
        if (this.poList[i]._source.units_received == null)
          this.poList[i]._source.units_received = -1;
        if (this.poList[i]._source.updated_at == null)
          this.poList[i]._source.updated_at = null;
        if (this.poList[i]._source.comment == null)
          this.poList[i]._source.comment = null;
        if (this.poList[i]._source.validated == null)
          this.poList[i]._source.validated = null;
      }
    },
    checkCustomFieldsOrder() {
      if (this.currentPurchaseOrder.units_ordered == null)
        this.currentPurchaseOrder.units_ordered = -1;
      if (this.currentPurchaseOrder.units_received == null)
        this.currentPurchaseOrder.units_received = -1;
      if (this.currentPurchaseOrder.cart_status == null)
        this.currentPurchaseOrder.cart_status = "empty";
      if (this.currentPurchaseOrder.units_received == null)
        this.currentPurchaseOrder.units_received = -1;
      if (this.currentPurchaseOrder.updated_at == null)
        this.currentPurchaseOrder.updated_at = null;
      if (this.currentPurchaseOrder.comment == null)
        this.currentPurchaseOrder.comment = null;
      if (this.currentPurchaseOrder.validated == null)
        this.currentPurchaseOrder.validated = null;

      // check received field on each item of line_items
      for (var u = 0; u < this.currentPurchaseOrder.line_items.length; u++) {
        if (this.currentPurchaseOrder.line_items[u].received == null) {
          this.currentPurchaseOrder.line_items[u].received = -1;
        }
      }
    },
    validateOrder() {
      if (!this.disableValidate) {
        this.currentPurchaseOrder.validated = true;
        this.anyMissingItemsForValidation();
        this.sendData();

        this.$q.notify({
          message: "Le bon est correctement validé !",
          timeout: 5000,
          color: "green"
        });
      } else {
        this.$q.notify({
          message:
            "Vous ne pouvez valider un bon que si celui-ci est complet !",
          timeout: 5000,
          color: "orange"
        });
      }
    },
    sendData() {
      if (!this.hasPoChanged) return;
      // count ordered & received items
      this.currentPurchaseOrder.units_received = this.totalItemsReceived();
      this.currentPurchaseOrder.units_ordered = this.totalItems();

      // apply new status
      this.changeStatus();

      // Update "updated_at" field (2020-10-21T01:00:01.408567+02:00)
      this.currentPurchaseOrder.updated_at = moment().format(
        "YYYY-MM-DDTHH:mm:ss.SSSSSSZ"
      );

      // prepare the purchase order format
      var tmp = JSON.parse(JSON.stringify(this.currentPurchaseOrder));
      tmp.line_items = JSON.stringify(tmp.line_items);

      // forge the query
      var updatedPurchaseOrder = {
        _index: this.rawResponse.data.data._index,
        _source: tmp,
        _id: this.rawResponse.data.data._id
      };

      // send the update request
      this.$store.commit({
        type: "updateRecord",
        data: updatedPurchaseOrder
      });

      // notify user
      this.$q.notify({
        message: "Bon de commande sauvegardé",
        timeout: 2000,
        color: "green"
      });
    },
    getTheProducts() {
      var url =
        this.$store.getters.apiurl +
        "generic_search/" +
        this.indice2 +
        "?token=" +
        this.$store.getters.creds.token;
      console.log("url : ", url);

      this.queryProductsList.query.bool.filter[0].multi_match.query = this.currentPurchaseOrder.supplier;

      this.$q.loading.show();
      axios
        .post(url, this.queryProductsList, {
          headers: { "Content-Type": "application/json" }
        })
        .then(response => {
          this.productList = response.data.records;
          this.prepareProducts();
          this.$q.loading.hide();
        })
        .catch(error => {
          console.log(
            "| getTheProducts / POST | UN PROBLEME EST SURVENU : ",
            error
          );
          this.$q.loading.hide();
        });
    },
    addProduct() {
      this.getTheProducts();
      this.productSearch = true;
    },
    showOrderComment() {
      if (this.currentPurchaseOrder.comment != null)
        this.orderComment = this.currentPurchaseOrder.comment;
      this.orderCommentBox = true;
    },
    showSlackMessage() {
      this.slackPushMessageBox = true;
    },
    saveComment() {
      this.currentPurchaseOrder.comment = this.orderComment;
      this.orderCommentBox = false;
    },
    onToday() {
      this.dateFrom =
        moment()
          .startOf("day")
          .unix() * 1000;
      this.dateTo =
        moment()
          .endOf("day")
          .unix() * 1000;
      this.dateFromShort = moment().format("DD-MM-YYYY");
      this.dateToShort = moment().format("DD-MM-YYYY");
      this.getPoList();
    },
    goodLookingDate(date) {
      moment.locale("fr");
      return moment(date).format("DD MMMM YYYY");
    },
    loadMore: function(index, done) {
      // index - called for nth time
      // done - Function to call when you made all necessary updates.
      //        DO NOT forget to call it otherwise your loading message
      //        will continue to be displayed. Has optional boolean
      //        parameter that invokes stop() when true
      // make some Ajax call then call done()
      // console.log("We want to load more stuff (index: " + index + ")")
      // setTimeout(() => {
      //   if (this.items) {
      //     this.items.push({}, {}, {}, {}, {}, {}, {})
      //     done()
      //   }
      // }, 25000)
      // //this.items.push({}, {}, {}, {}, {})
      // console.log('items contient maintenant ' + this.items.length + ' elements.')
    },
    onOkDatePicker() {
      console.log("hello there");
      this.dateFrom =
        moment(this.curSelDate)
          .startOf("day")
          .unix() * 1000;
      this.dateTo =
        moment(this.curSelDate)
          .endOf("day")
          .unix() * 1000;
      this.dateFromShort = moment(this.dateFrom).format("DD-MM-YYYY");
      this.dateToShort = moment(this.dateTo).format("DD-MM-YYYY");
      this.getPoList();
    },
    onOkRangeDatePicker() {
      this.dateFromShort = moment(this.dateFrom).format("DD-MM-YYYY");
      this.dateToShort = moment(this.dateTo).format("DD-MM-YYYY");
      this.getPoList();
    },
    backToList() {
      this.poDisplayed = false;
      this.sendData();
      this.currentPurchaseOrder = null;
      this.rawResponse = null;
      this.poList = [];
      this.productList = null;
      this.noProducts = false;
      this.orderComment = null;
      setTimeout(() => {}, 2000);
      this.getPoList();
    },
    checkNumber(str) {
      if (str === "CREATED_BY_NYX") return "NYX";
      else return "VEEQO";
    },
    chipStatus(str) {
      if (str === "to_be_collected") return "";
      if (str === "fully_collected") return "COMPLETE";
      if (str === "partially_collected") return "INCOMPLETE";
    },
    chipColor(int) {
      var str = this.getThePassage(int);
      if (str === "passage") return "blue";
      if (str === "fini") return "green";
      if (str === "entrain") return "orange";
    },
    chipFill(qty, qty_rvd) {
      if (qty_rvd == -1) {
        return qty;
      } else if (qty_rvd == qty) {
        return qty;
      } else {
        return qty_rvd + " / " + qty;
      }
    },
    lineIsOk(index) {
      this.currentPurchaseOrder.line_items[
        index
      ].received = this.currentPurchaseOrder.line_items[index].quantity;
      var tmp = JSON.parse(JSON.stringify(this.currentPurchaseOrder));
      this.currentPurchaseOrder = null;
      this.currentPurchaseOrder = tmp;
      this.checkValidateState();
    },
    onCancelProblem() {
      this.currentEditQty = null;
      this.currentEditQty_received = null;
      this.currentEditId = null;
    },
    onOkProblem() {
      if (this.currentEditQty_received > this.currentEditQty)
        this.currentEditQty_received = this.currentEditQty;
      if (this.currentEditQty_received <= 0) this.currentEditQty_received = 0;

      this.currentPurchaseOrder.line_items[
        this.currentEditId
      ].received = this.currentEditQty_received;
      this.currentEditQty = null;
      this.currentEditQty_received = null;
      this.currentEditId = null;
      this.checkValidateState();
    },
    onCancelRaw() {
      this.rawQty = 1;
    },
    openProblemBox(id) {
      this.currentEditId = id;
      this.currentEditQty = this.currentPurchaseOrder.line_items[id].quantity;
      if (this.currentPurchaseOrder.line_items[id].received == -1)
        this.currentEditQty_received = 0;
      else
        this.currentEditQty_received = this.currentPurchaseOrder.line_items[
          id
        ].received;
      this.problemBox = true;
    },
    getTheColor(obj, str) {
      switch (str) {
        case "bg":
          if (obj.received == -1) return;
          else if (obj.received == obj.quantity) return "bg-green-5";
          else return "bg-red-5";
          break;
        case "chip":
          if (obj.received == -1) return "grey-5";
          else if (obj.received == obj.quantity) return "green-10";
          else return "red-10";
          break;
        case "btn":
          if (obj.received === -1) return "grey-5";
          else if (obj.received == obj.quantity) return "green-10";
          else return "red-10";
          break;
        case "name":
          if (obj.received === -1) return "color: grey-5;";
          else return "color: white;";
          break;
        default:
          console.log("Switch getTheColor() crashed");
      }
    },
    getBgColor(str) {
      switch (str) {
        case "to_be_collected":
          return "white";
          break;
        case "partially_collected":
          return "orange";
          break;
        case "fully_collected":
          return "green";
          break;
        default:
          console.log("Switch getBgColor() crashed");
      }
    },
    isThereChip(str) {
      switch (str) {
        case "to_be_collected":
          return false;
          break;
        default:
          return true;
      }
    },
    getChipColor(str) {
      switch (str) {
        case "partially_collected":
          return "orange-9";
          break;
        case "fully_collected":
          return "green-9";
          break;
        default:
          console.log("Switch getChipColor() crashed");
      }
    },
    getChipIcon(str) {
      switch (str) {
        case "partially_collected":
          return "error";
          break;
        case "fully_collected":
          return "thumb_up";
          break;
        default:
          console.log("Switch getChipIcon() crashed");
      }
    },
    getTextColor(str) {
      switch (str) {
        case "to_be_collected":
          return "color: black;";
          break;
        case "partially_collected":
          return "color: white;";
          break;
        case "fully_collected":
          return "color: white;";
          break;
        default:
          console.log("Switch getBgColor() crashed");
      }
    },
    toggleFab() {
      this.showTooltip != this.showTooltip;
    },
    isDateCorrect() {
      if (isNaN(this.dateFrom) && isNaN(this.dateTo)) {
        this.dateFrom =
          moment()
            .startOf("day")
            .unix() * 1000;
        this.dateTo =
          moment()
            .endOf("day")
            .unix() * 1000;
        this.dateFromShort = moment().format("DD-MM-YYYY");
        this.dateToShort = moment().format("DD-MM-YYYY");
      }
    },
    totalItems() {
      var u = 0;
      for (var i = 0; i < this.currentPurchaseOrder.line_items.length; i++) {
        u += this.currentPurchaseOrder.line_items[i].quantity;
      }
      return u;
    },
    totalItemsReceived() {
      var u = 0;
      for (var i = 0; i < this.currentPurchaseOrder.line_items.length; i++) {
        if (this.currentPurchaseOrder.line_items[i].received > 0)
          u += this.currentPurchaseOrder.line_items[i].received;
      }
      return u;
    },
    anyChangeToSubmit() {
      // return false if no difference
      // return true if some differences have been found
      for (var i = 0; i < this.currentPurchaseOrder.line_items.length; i++) {
        if (this.currentPurchaseOrder.line_items[i].received > -1) return true;
      }
      return false;
    },
    changeStatus() {
      if (this.currentPurchaseOrder.units_received == -1) {
        this.currentPurchaseOrder.status = "to_be_collected";
        this.currentPurchaseOrder.cart_status = "empty";
      } else if (
        this.currentPurchaseOrder.units_received ==
        this.currentPurchaseOrder.units_ordered
      ) {
        this.currentPurchaseOrder.status = "fully_collected";
        this.currentPurchaseOrder.cart_status = "complète";
      } else {
        this.currentPurchaseOrder.status = "partially_collected";
        this.currentPurchaseOrder.cart_status = "incomplète";
      }
    },
    onChangeQty(i) {
      this.currentEditQty_received += i;
      if (this.currentEditQty_received < 0) this.currentEditQty_received = 0;
      if (this.currentEditQty_received > this.currentEditQty)
        this.currentEditQty_received = this.currentEditQty;
    },
    focusField() {
      this.currentEditQty_received = "";
    },
    blurField() {
      if (this.currentEditQty_received === "")
        this.currentEditQty_received = this.currentPurchaseOrder.line_items[
          this.currentEditId
        ].received;
    },
    addThisProduct() {
      if (this.rawQty > 5000) this.rawQty = 5000;
      if (this.rawQty <= 0) this.rawQty = 0;

      // need to check if the product isn't already in cart
      if (this.alreadyInCart(this.productList[this.rawIndex].title)) {
        this.$q.notify({
          message: "Le produit est déjà dans le bon de commande !",
          timeout: 5000,
          color: "orange"
        });
        return;
      }

      this.currentPurchaseOrder.line_items.push({
        full_title: this.productList[this.rawIndex].title,
        product_id: "",
        quantity: this.rawQty,
        received: this.rawQty,
        variant_id: ""
      });
      this.$q.notify({
        message: "Produit ajouté au bon de commande !",
        timeout: 5000,
        color: "green"
      });

      this.rawQuantityBox = false;
      this.rawIndex = null;
      this.rawQty = 1;
    },
    prepareProducts() {
      if (this.productList.length == 0) {
        this.noProducts = true;
        return;
      }
      var array = [];
      for (var i = 0; i < this.productList.length; i++) {
        array[i] = this.productList[i]._source;
      }

      array.sort(function(a, b) {
        var nameA = a.title.toLowerCase(),
          nameB = b.title.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      this.productList = array;
    },
    getThePassage(int) {
      var cart = Array.from(JSON.parse(this.poList[int]._source.line_items));
      var foundQty = false;
      var foundMinusOne = false;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].received > -1) foundQty = true;
        else if (cart[i].received === -1) foundMinusOne = true;
        else foundMinusOne = true;
      }
      if (foundQty && foundMinusOne) return "entrain";
      else if (!foundQty && foundMinusOne) return "passage";
      else return "fini";
    },
    openRawQuantity(id) {
      this.rawIndex = id;
      this.rawQty = 1;
      this.rawQuantityBox = true;
    },
    onChangeRawQty(i) {
      this.rawQty += i;
      if (this.rawQty < 1) this.rawQty = 1;
      if (this.rawQty > 5000) this.rawQty = 5000;
    },
    focusRawQty() {
      this.rawQty = "";
    },
    blurRawQty() {
      if (this.rawQty === "") this.rawQty = 1;
    },
    alreadyInCart(str) {
      for (var i = 0; i < this.currentPurchaseOrder.line_items.length; i++) {
        if (this.currentPurchaseOrder.line_items[i].full_title == str)
          return true;
      }
      return false;
    },
    capitalizeFistLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    sendSlackMsg(channel, supplier, number, date, problems) {
      if (number == "CREATED_BY_NYX") number = "PO-NYX";
      var title = "Tournée de ramassage : nouveau message.";

      var testO =
        "[" +
        channel +
        "] " +
        "[ " +
        this.capitalizeFistLetter(this.$store.getters.creds.user.firstname) +
        " | " +
        this.capitalizeFistLetter(supplier) +
        " | " +
        number +
        " | " +
        moment(date).format("DD/MM/YYYY") +
        " ]\n" +
        this.slackPushMessage;

      var formatedMentions = "";
      for (var i = 0; i < this.slackMention.length; i++) {
        formatedMentions = formatedMentions + this.slackMention[i].id + " ";
      }

      var text2send = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Tournée de ramassage : nouveau message."
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: formatedMentions
          }
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: testO
          }
        }
      ];

      // supply quantity problems to be reported
      if (problems != null) {
        text2send[0].text.text = "Problème lors de la livraison";
        text2send.push({ type: "divider" });
        for (var i = 0; i < problems.length; i++) {
          var toAdd = {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "*Produit :* " +
                problems[i].title +
                "\n*Variant id :* " +
                problems[i].variant +
                "\n*Quantité reçue:* " +
                problems[i].received +
                " / " +
                problems[i].quantity
            }
          };
          text2send.push(toAdd);
        }
        text2send.push({ type: "divider" });
      }

      var slackObject = {
        channel: channel,
        blocks: text2send
      };
      var slackUrl =
        this.$store.getters.apiurl +
        "lambdas/4/publish_to_slack?apikey=XXXXX";

      axios
        .post(slackUrl, slackObject)
        .then(response => {
          //console.log("SLACK MESSAGE PUSH response : ", response);
          this.$q.notify({
            message: "Message envoyé !",
            timeout: 5000,
            color: "green"
          });
        })
        .catch(error => {
          console.log(
            "| SLACK MESSAGE PUSH / POST | UN PROBLEME EST SURVENU : ",
            error
          );
          this.$q.notify({
            message: "un problème est survenu, veuillez re-essayer plus tard.",
            timeout: 5000,
            color: "red"
          });
        });
      this.slackPushMessageBox = false;
      this.slackPushMessage = null;
    },
    checkValidateState() {
      var tmpState = true;
      for (var i = 0; i < this.currentPurchaseOrder.line_items.length; i++) {
        if (this.currentPurchaseOrder.line_items[i].received == -1) {
          this.disableValidate = true;
          return;
        } else {
          tmpState = false;
        }
        this.disableValidate = tmpState;
      }
    },
    anyMissingItemsForValidation() {
      var flag = false;
      for (var i = 0; i < this.currentPurchaseOrder.line_items.length; i++) {
        if (
          this.currentPurchaseOrder.units_received !=
          this.currentPurchaseOrder.units_ordered
        ) {
          var problemsArray = [];
          for (
            var i = 0;
            i < this.currentPurchaseOrder.line_items.length;
            i++
          ) {
            if (
              this.currentPurchaseOrder.line_items[i].quantity !=
              this.currentPurchaseOrder.line_items[i].received
            ) {
              var o = {
                title: this.currentPurchaseOrder.line_items[i].full_title,
                variant: this.currentPurchaseOrder.line_items[i].variant_id,
                quantity: this.currentPurchaseOrder.line_items[i].quantity,
                received: this.currentPurchaseOrder.line_items[i].received
              };
              problemsArray.push(o);
              var text = "Il manque des produits : ";
            }
          }
          this.slackPushMessage = text;

          // tous les produits a pb sont listés, on envoie sur le chan #ramassage
          this.sendSlackMsg(
            "#ramassage",
            this.currentPurchaseOrder.supplier,
            this.currentPurchaseOrder.number,
            this.currentPurchaseOrder.expected_date,
            problemsArray
          );
        }
      }
    },
    openDlcBox(id) {
      this.currentEditId = id;
      this.dlcBox = true;
    },
    onOkDlcPicker() {
      this.currentPurchaseOrder.line_items[
        this.currentEditId
      ].dlc = this.dateDlc;
      this.dlcBox = false;
      this.dateDlc = null;
    },
    getDlc(item) {
      if (item.dlc != null) return moment(item.dlc).format("DD/MM/YY");
    }
  },
  // #endregion
  mounted() {
    this.onToday();
  },
  computed: {
    hasPoChanged() {
      return (
        JSON.stringify(this.currentPurchaseOrder) !=
        JSON.stringify(this.originalPurchaseOrder)
      );
    }
  }
};
</script>

<style>
.date-ref {
  width: 100%;
}
.q-list-striped > .q-item:nth-child(even) {
  background-color: rgba(242, 240, 240, 0.65);
}
.my-modal {
  background-color: rgba(0, 0, 0, 0.562);
}
.my-dialog .modal-content {
  width: 95vw;
  height: 90vh;
}
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
.custom-input {
  height: 50px;
  font-size: 32px;
}
.custom-card {
  font-size: 1em;
  text-transform: uppercase;
  max-width: 1200px;
  min-height: 50px;
  height: 50px;
  vertical-align: middle;
}
</style>
