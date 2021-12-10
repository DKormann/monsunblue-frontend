<template>

  <h2>Themen</h2>

  <div v-for="key in topicList" :key="key">
    <div class="element">
      <h2>
        {{key}}
      </h2>
      <button class = 'link' @click = "showquestions('hello')">
      {{topics[key].length}} Fragen
      </button>
    </div>

  </div>

  <button class = "link" @click = "createNew = true">neues Thema erstellen</button>

  <div v-if='createNew'>
    <GetUserInput title="Wie soll das Neue Thema heißen?" :callback  = "createTopic" :exit = "()=>{createNew = false}"/>
  </div>

</template>

<script>
let db = require("../../database/backend.js")
import GetUserInput from '../Dialog/GetUserInput.vue'
export default {
  name : 'Topics',
  components: {
    GetUserInput
  },
  data(){
    return {
      topics:[],
      topicList:[],
      createNew:false,
    }
  },
  mounted(){

    this.setup()

  },

  methods:{
    setup(){
      db.getQuery(`overview/topics`)
      .then((topics)=>{
        console.log(topics)
        this.topics = topics
        this.topicList = Object.keys(topics)
      })

    },
    keyup(event){
      if (event.key == "Enter"){
        this.search(this.$refs.search.value)
      }
    },
    createTopic(name){
      alert(`creating new topic ${name}`)
      const id = this.topicList.length +1
      var topic = {
        id:id,
        length:0,
      }
      db.setQuery(`overview/topics/${name}/`,topic)
      db.setQuery(`topics/${id}/`,{
        creator:localStorage.username,
        created:Date()
      })
      this.setup()
    },
    showquestions(){

    }
  },
}
</script>

<style scoped src = "../../css/development.css"></style>
