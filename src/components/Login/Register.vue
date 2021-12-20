<template>

  <h2>Neuer Account</h2>
    <div class="login-form">
      <div class="spacer"></div>
      <label for="name">Wähle einen Nutzernamen:</label>
      <p></p>
      <p class = 'error' ref = 'nameerror'></p>
      <p></p>
      <input type="text" id = "username" ref = "name">
      <p></p>
      <label for="name">Email:</label>
      <p></p>
      <p class = 'error' ref = 'emailerror'></p>
      <p></p>
      <input type="text" id = "email" ref = "email">
      <p></p>
      <label for="password">Passwort:</label>
      <p></p>
      <p class='error' ref = "error"></p>
      <p></p>
      <input type="password" id="new-password" ref="password"><br>
      <p></p>
      <label for="password">Passwort wiederholen:</label>
      <p></p>
      <p class='error' ref = "error2"></p>
      <p></p>
      <input type="password" id="new-password2" ref="password2"><br>
      <p></p>
      <p class = "error" ref = "registererror"></p>
      <p></p>
      <button id = 'loginbutton' type="button" @click='register' >Account erstellen</button>
      <p></p>
      <div class="spacer">

      </div>
      <router-link  class = "router-link" to="/login">Statdessen Anmelden</router-link>

    </div>

  <div class="spacer"></div>

</template>

<script>
// let utils = require("../utils.js")
let auth = require("@/database/authentication.js")
import router from "@/router"

export default{
    name:'Login',
    components:{
    },
    data(){
      return {
        title:"",
      }
    },
    methods:{

      register(){
        var username = this.$refs.name.value
        var email = this.$refs.email.value
        var pass1 = this.$refs.password.value
        var pass2 = this.$refs.password2.value
        var data_is_valid = true

        if (username.length < 2){
          console.log("name",name);
          this.$refs.nameerror.innerHTML = "Du brauchst einen längeren Namen"
          data_is_valid = false
        }else{
          this.$refs.nameerror.innerHTML = ""
        }
        if(email.length<5 || !email.includes('@')){
          console.log(email);
          this.$refs.emailerror.innerHTML = "keine gültige Email"
          data_is_valid = false
        }else{
          this.$refs.emailerror.innerHTML = ""
        }
        console.log("pass",pass1);
        if (pass1.length < 6){
          this.$refs.error.innerHTML = "Das Passwort muss länger sein"
          data_is_valid = false
        }else{
          this.$refs.error.innerHTML = ""
        }
        if (pass1 != pass2){
          this.$refs.error2.innerHTML = "Das Zweite Passwort muss gleich sein"
          data_is_valid = false
        }else{
          this.$refs.error2.innerHTML = ""
        }
        if (data_is_valid){

          this.username = username

          auth.register(username,email,pass1)
          .then(cred => {
            console.log(cred);
            this.$refs.registererror.innerHTML = ""
            this.$refs.nameerror.innerHTML = ""
            alert("Willkommen, "+this.username)
            router.go(-2)
          })
          .catch(error =>{

            if (error.message == "User already registered"){
              this.$refs.registererror.innerHTML = "Email bereits registriert"
            }else{
              this.$refs.registererror.innerHTML = error.message

            }
          })
        }
      },
    }
  }
</script>
<style scoped src = "@/css/login.css">
</style>
