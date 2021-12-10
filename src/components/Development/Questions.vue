<template>

  <h2>Fragen</h2>
  <input type="text" ref = "search" placeholder="🔎" @keyup="keyup"><br>
  <button id = "deleteAll" @click = "delAll">Alle Löschen</button>



  <div v-for="question in questions" :key="question">
    <div class="element">
      <h2>
        Frage: {{question.title}} <button class= "delButton" @click = "deleteQuestion(question.id)">x</button><br>
        Lösung: {{question.solution}}<br>
        Rating: {{question.rating}}
      </h2>

    </div>

  </div>



</template>

<script>
let utils = require("../../utils.js")
export default {
  name : 'Questions',
  components: {

  },

  mounted(){
    // this.search("")
  },
  data(){
    return {
      questions:[],
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

      utils.apiRequest(text,'search',(response)=>{
        this.questions = JSON.parse(response)
      })

    },
    deleteQuestion(id){
      utils.deleteQuestion(JSON.stringify(id))
    },
    delAll(){
      if(localStorage.username == undefined){
        alert('Error: Du musst dich Anmelden, um Fragen zu löschen.')
        return 
      }
      if(confirm("Willst du wirklich "+this.questions.length+" Fragen löschen?")){
        this.questions.forEach(q=>{
          utils.deleteQuestion(JSON.stringify(q.id))
        })
      }
    },

  },

}
</script>

<style scoped src = "../../css/development.css"></style>
