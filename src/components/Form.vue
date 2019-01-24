<template slot="items">
  <div class="form-container">
    <q-field
      v-for="item in formModel" :key="item.field"
      :label="item.title"
    >

      <q-input 
        v-if="item.type=='string'" 
        v-model="item.value" 
        :type="item.subtype" 
        :color="item.color"
        :inverted="item.inverted" 
        :clearable="item.clearable"/>
      <q-input 
        v-if="item.type=='number'" 
        v-model="item.value" 
        :type="item.type" 
        :color="item.color"
        :inverted="item.inverted"
        :clearable="item.clearable"/>
      <q-datetime 
        v-if="item.type=='datetime'" 
        v-model="item.value" 
        :color="item.color"
        :inverted="item.inverted"
        :type="item.subtype" />
      <q-uploader 
        v-if="item.type=='uploader'" 
        :color="item.color"
        :inverted="item.inverted"
        :url="item.value" />
      <q-chips-input 
        v-if="item.type=='chips'" 
        :color="item.color"
        :inverted="item.inverted"
        v-model="item.value"/>
      <q-toggle 
        v-if="item.type=='boolean'" 
        :color="item.color"
        :inverted="item.inverted"
        v-model="item.value" />
      <q-rating
        v-if="item.type=='rating'"
        v-model="item.value"
        :color="item.color"
        :inverted="item.inverted"
        :max="item.maxRating"/>
       <q-select
          v-if="item.type=='selecter'"
          v-model="item.value"
          :options="item.selectOptions"
          :color="item.color"
          :inverted="item.inverted"
          :multiple="item.multiple"/>

      

    </q-field> 
    <div class="button-box">
      <q-btn 
          color="primary" 
          class="send-form-button"
          
          size="lg"
          outline
          :loading="loading"
          @click="submit">Send</q-btn>
      <q-btn 
          color="negative" 
          class="send-form-button"
          
          size="lg"
          outline
          :disable="loading"
          @click="reset">Reset</q-btn>
    </div>
  </div>
</template>
  
<script>
import moment from "moment";
import Vue from "vue";
import axios from "axios";

import VueGeolocation from 'vue-browser-geolocation';
Vue.use(VueGeolocation);

export default {
  name: "Form",
  data: () => ({
    formLabelWidth: "120px",
    chips: ['abc'], 
    inverted: true,
    loading: false,
    formModel: null
  }),
  props: {
    config: {
      type: Object
    }
  },
  created: function() {
    this.prepareData();

    
    

  },
  methods:{
    prepareData :function() {
      this.formModel = JSON.parse(JSON.stringify(this.config.config.headercolumns))


      console.log('prepare data')
      console.log(JSON.stringify(this.config.config.headercolumns))
      for (var i in this.formModel) {
        var field = this.formModel[i]

        if(field.type == 'chips')
          field.value=[]
        else if(field.type == 'uploader')
          field.value=''
        else if(field.type == 'string')
          field.value=''
        else if(field.type == 'boolean')
          field.value=false
        else if(field.type == 'number')
          field.value=0
        else if(field.type == 'rating')
          field.value=0
        else if(field.type == 'datetime') {
          field.subType = 'datetime'
          field.value=moment.now()
        }
        else if(field.type == 'selecter') {
          
          for(var i in field.selectOptions) {
            var obj = {
              'label': field.selectOptions[i],
              'value': field.selectOptions[i]
            }
            field.selectOptions[i] = obj
          }

          if(field.multiple)
            field.value = []
          else
            field.value = ''

        }
        else
          field.value=null
        
        if(field.color == null)
          field.color = 'light'
        if(field.inverted == null)
          field.inverted = true

      }
      

      var tmp = JSON.parse(JSON.stringify(this.formModel))
      this.formModel = {}
      this.formModel = tmp
    },
    reset :function() {
      this.prepareData()
    },
    submit :function() {
      this.loading = true
      //this.$v.form.$touch()
     
      var newRec={"_index":this.config.config.index,"_source":{},"_id":"id_" + Math.floor((1 + Math.random()) * 0x1000000)+"_"+ Math.floor((1 + Math.random()) * 0x1000000)};
      
      for (var i in this.formModel)
      {
        var item=this.formModel[i];
        newRec["_source"][item.field]=item.value;
      }
      newRec["_source"]["@timestamp"]=moment();
      this.$getLocation({
        enableHighAccuracy: false
        
      }).then(coordinates => {
          newRec._source.location=[coordinates["lng"],coordinates["lat"]];
          newRec._source.user=this.$store.getters.creds.user.user;
          this.$store.commit({
            type: "updateRecord",
            data: newRec
          });

          this.$q.notify({
          title: "saved",
          message:"Saved",
          type: "positive",
          position: "bottom",
          timeout:500
        });
          
          this.prepareData()
          this.loading=false;       
        }).catch(error => {
        alert(error);
        this.loading=false;    
      });;
     
         
    }
  }
};
</script>

<style scoped>
.form-container {
  margin: 0px 10px;
}

.button-box {
  margin: 40px;
}

.button-box button{
  margin: 20px;
}
</style>