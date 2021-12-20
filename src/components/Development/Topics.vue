<template>

  <h2>Themen</h2>

  <div v-for="row in topicList" :key="row">
    <div class="element">
      <h2>
        {{row.title}}
      </h2>
      <button class = 'link' @click = "showquestions('hello')">
      <!-- {{topics[key].length}} Fragen -->
      </button>
    </div>

  </div>

  <!-- <button class = "link" @click = "createNew = true">neues Thema erstellen</button> -->

  <div v-if='createNew'>
    <GetUserInput title="Wie soll das Neue Thema heißen?" :callback  = "createTopic" :exit = "()=>{createNew = false}"/>
  </div>

</template>

<script>
import {supabase} from "@/database/backend.js"
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
      supabase.from('topics')
      .select('title')

      .then(result =>{
        let {data} = result
        console.log(data);
        this.topicList = data
      })
      .catch(error=>{
        console.log(error.message);
      })
      // db.getQuery(`overview/topics`)
      // .then((topics)=>{
      //   console.log(topics)
      //   this.topics = topics
      //   this.topicList = Object.keys(topics)
      // })

    },
    keyup(event){
      if (event.key == "Enter"){
        this.search(this.$refs.search.value)
      }
    },
    createTopic(){
      throw("not implemented")
      // const id = this.topicList.length +1
      // var topic = {
      //   id:id,
      //   length:0,
      // }
      // db.setQuery(`overview/topics/${name}/`,topic)
      // db.setQuery(`topics/${id}/`,{
      //   creator:localStorage.username,
      //   created:Date()
      // })
      // this.setup()
    },
    showquestions(){

    }
  },
}
</script>

<style scoped src = "../../css/development.css"></style>
