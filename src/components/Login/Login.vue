<template>
<div>
  <h2>Login</h2>
    <div class="login-form">
      <div class="buffer">


      </div>
      <label for="name">Email: </label>
      <p></p>
      <p class = 'error' ref = 'nameerror'></p>
      <p></p>
      <input type="text" ref = "email" id = "email">
      <p></p>
      <label for="password">Passwort:</label>
      <p></p>
      <p class = 'error' ref = 'passworderror'></p>
      <p></p>
      <input type="password" ref = "password" id="password" value=""><br>
      <p></p>
      <p class = 'error' ref = 'error'></p>
      <p></p>
      <button id = 'loginbutton' type="button" name="button" @click = "login">login</button>
      <p></p>
      <div class="buffer">

      </div>
      <router-link  class = "router-link" to="/register">Neuen Account erstellen</router-link>

    </div>


  <div class="buffer">

  </div>
</div>
</template>

<script>
// let utils = require("../utils.js")
let auth  = require("@/database/authentication.js")
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

      login(){
        var email = this.$refs.email.value
        var password = this.$refs.password.value
        if (email == ""){
          this.$refs.nameerror.innerHTML = "Die Email wird benötigt"
          return
        }else{
          this.$refs.nameerror.innerHTML = ""

        }
        if (password == ""){
          this.$refs.passworderror.innerHTML = "Passwort wird benötigt"
          return
        }else{
          this.$refs.passworderror.innerHTML = ""
        }

        this.email = email

        auth.login(email,password)
        .then(cred=>{
          console.log(cred);
          console.log('logged in');
          alert("Willkommen, "+localStorage.username)
          this.$refs.error.innerHTML = ""
          router.go(-1)
        })
        .catch(error=>{
          console.error(error.message);

          this.$refs.error.innerHTML = "Email oder Passwort inkorrekt"
        })

        console.log(email,password);
      },


    }
  }
</script>
<style scoped src = "@/css/login.css">
</style>
