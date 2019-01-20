<template slot="items">
  <div>
    <q-field
      v-for="item in config.config.headercolumns" :key="item.field"
      :label="item.title"
    >
    
    </q-field>    
    

    {{config}}


<!--
      <el-form>
        <el-row v-for="item in config.config.headercolumns" :key="item.field">
          <el-col :span="23">
            <el-form-item
              :label="item.title"
              :label-width="formLabelWidth"
              v-if="item.type =='number'"
            >
              <el-input-number v-model="item.value" autocomplete="off"></el-input-number>
            </el-form-item>
            <el-form-item
              :label="item.title"
              :label-width="formLabelWidth"
              v-else-if="item.type =='date'"
            >
              <el-date-picker size="mini" v-model="item.value" type="date" placeholder="Pick a day"></el-date-picker>
            </el-form-item>
            <el-form-item
              :label="item.title"
              :label-width="formLabelWidth"
              v-else-if="item.type =='datetime'"
            >
              <el-date-picker
                size="mini"
                v-model="item.value"
                type="datetime"
                placeholder="Pick a date and a time"
              ></el-date-picker>
            </el-form-item>

            <el-form-item :label="item.title" :label-width="formLabelWidth" v-else>
              <el-input v-model="item.value" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="11">
            &nbsp;
          </el-col>
          <el-col :span="13">
            <el-button type="primary"  @click="submit()" :disabled="commitunderway">{{this.$t("buttons.submit")}}</el-button>            
            <span v-if="commitunderway">&nbsp;&nbsp;<v-icon name="spinner" scale="1" spin/></span>
          </el-col>
        </el-row>
      </el-form>


    </div>
      -->
  </div>
</template>
  
<script>
import moment from "moment";
import Vue from "vue";

import VueGeolocation from 'vue-browser-geolocation';
Vue.use(VueGeolocation);

export default {
  name: "Form",
  data: () => ({
    formLabelWidth: "120px",
    commitunderway:false
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
      for (var i in this.config.config.headercolumns) {
        
      }      
    },
    submit :function() {
      this.commitunderway=true;
      var newRec={"_index":this.config.config.index,"_source":{},"_id":"id_" + Math.floor((1 + Math.random()) * 0x1000000)+"_"+ Math.floor((1 + Math.random()) * 0x1000000)};
      
      for (var i in this.config.config.headercolumns)
      {
        var item=this.config.config.headercolumns[i];
        newRec["_source"][item.field]=item.value;
      }
      newRec["_source"]["@timestamp"]=moment();
      this.$getLocation({
        enableHighAccuracy: false
        ,timeout:5000
      }).then(coordinates => {
          newRec._source.location=[coordinates["lng"],coordinates["lat"]];
          //alert(JSON.stringify(this.$store.getters.creds.user));
          newRec._source.user=this.$store.getters.creds.user.user;
          //alert(JSON.stringify(newRec));   
          this.$store.commit({
            type: "updateRecord",
            data: newRec
          });
          this.$alert('Your record has been saved.', 'Message', {
          confirmButtonText: 'OK',

        });
          this.commitunderway=false;       
        }).catch(error => {
        alert(error);
      });;
     
         
    }
  },
  created: function() {}
};
</script>

<style>
</style>