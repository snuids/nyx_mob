<template>
  <q-layout class="bg-grey-1">
    <div class="login-container">
      <q-input
        v-model="form.login"
        @blur="$v.form.login.$touch"
        @keyup.enter="submit"
        :error="$v.form.login.$error"
        class="login-input"
        float-label="Login"
        :disable="loading"
        clearable
      />

      <q-input
        v-model="form.password"
        type="password"
        @blur="$v.form.password.$touch"
        @keyup.enter="submit"
        :error="$v.form.password.$error"
        class="password-input"
        float-label="Password"
        :disable="loading"
        clearable
      />
      <q-btn 
        color="primary" 
        class="login-button"
        rounded
        size="lg"
        outline
        :loading="loading"
        @click="submit">Login</q-btn>
    </div>
  </q-layout>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import axios from "axios";





export default {
  data () {
    return {
      form: {
        login: 'amarchand@icloud.com',
        password: 'bagstage01'
      },
      loading: false
    }
  },
  validations: {
    form: {
      login: { required },
      password: { required }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()

      if (this.$v.form.$error) {
        this.$q.notify({
          message:'Unable to authenticate.',
          type: "negative",
          position: "bottom",
          closeBtn: true,
          timeout:500
        })
        this.loading = false
        return
      }

      this.validateUser()
      // ...
    },

    async validateUser() {
      this.loading = true

      try {
        console.log(this.$store.getters.apiurl)
        const response = await axios.post(
          //this.$store.getters.apiurl + "cred/login",
          this.$store.getters.apiurl + "cred/login",
          { login: this.form.login, password: this.form.password }
        );

        if (response.data.error == "") {
          this.authenticate(response);
        }
        else {
          this.$q.notify({
            message:response.data.error,
            type: "negative",
            position: "bottom",
            closeBtn: true,
            timeout:500
          })
          this.loading = false 
        }

      } catch (e) {
        
        this.loading = false 
        console.log(e);
      }
      this.loading = false 
    },
    authenticate(response) {
      this.$i18n.locale = response.data.cred.user.language;
      response.data.cred.user.user = this.form.login;
      this.$store.commit({
        type: "login",
        data: response.data
      });
      
      this.$router.push("/main/start");
      this.$q.notify({
        title: this.$t("notifications.message"),
        message:
          this.$t("notifications.welcome") +
          " v(" +
          response.data.version +
          ")",
        type: "positive",
        position: "bottom",
        timeout:500
      });
      this.form.login=""
      this.form.password=""
      this.$store.dispatch("privileges");
      this.$store.dispatch("filters");
    }
  },
  mounted: function() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    
    if (vars["api"]!=undefined)
    {  
      this.$store.state.apiurl=vars["api"].split('#')[0];
    }
    
    
  }
}
</script>
<style>
.login-container {
  position: absolute;
  top: 20%;
  width: 80%; 
  left: 10%;
  margin: 2px;
  border-radius: 5%;
}

.login-input {
  height: 50px;
  width: 100%;
  padding: 10px;
}

.password-input {
  margin-top: 10px;
  padding: 10px;
  height: 50px;
  width: 100%;
}

.login-button {
  margin-top: 50px;
  width: 90%;
  margin-left: 5%;
}
</style>

<style scoped>
.q-if-error {
  /*background-color: var(--q-color-dark) !important;*/
  /*border: solid 2px var(--q-color-negative);*/
  /*border: solid 1px var(--q-color-red);*/
}


</style>