<template>

  <h2>Members</h2>
  <input type="text" ref = "search" placeholder="🔎" @keyup="keyup">



  <div v-for="member in members" :key="member">

    <div class="element">
      <h2>{{member.username}} <button class = "delButton" @click = "deleteUser(member.username)">x</button></h2>

      <!-- <h2>{{question.solution}}</h2> -->
    </div>

  </div>



</template>

<script>
let utils = require("../../utils.js")
export default {
  name : 'Members',
  components: {

  },

  mounted(){
    // this.search("")
  },
  data(){
    return {
      members:[],
    }
  },
  methods:{
    keyup(event){
      if (event.key == "Enter"){
        this.search(this.$refs.search.value)
      }
    },
    search(text){
      console.log('searching',text);

      utils.apiRequest(text,'searchMembers',(response)=>{
        this.members = JSON.parse(response)
      })

    },
    deleteUser(userName){
      utils.deleteUser(userName)
    }

  },

}
</script>

<style scoped src = "../../css/development.css"></style>
