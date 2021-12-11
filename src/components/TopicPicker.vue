<template>

  <div class ='scrollbox'>

    <h2 v-if = "this.progress.length != 0">Deine Themen</h2>
    <div v-for= "row  in this.progress" :key = "row">
      <TopicButton v-bind:topic = "[row.topics.title,row.rating]"  />
    </div>

    <div class="spacer">

    </div>




    <div v-if="newTopics.length != 0">

      <h2>Neues Thema Entdecken</h2>

      <div class="boxes element" >
        <div class="box element" v-for = "topic in newTopics" :key = "topic">

          <router-link :to="{name:'Test', params:{id:topic}}">
          <h3>{{topic}}</h3>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// let utils = require("../utils.js")
import {supabase} from "../database/backend"
import TopicButton from './TopicButton.vue'
export default{
    components:{
      TopicButton,
    },

    data(){
      return {

        oldTopics : [],
        newTopics : [],
        topics:[],
        progress:{},

      }
    },
    mounted(){


      if (localStorage.progress == undefined){
        localStorage.progress = '{}'
      }
      if (localStorage.oldTopics == undefined){
        localStorage.oldTopics = []
      }
      try {
        this.progress = JSON.parse(localStorage.progress)
        this.oldTopics = JSON.parse(localStorage.oldTopics)
      } catch (e) {
        console.log(e);
      }


      this.getAllTopics()
      .then(data=>{
        this.topics = data
        console.log(data);
        this.getProgress()
        .then(data=>{
          // console.log(data);
          this.oldTopics = []
          data.forEach((item) => {
            this.oldTopics = this.oldTopics.concat(item.topics.title)
          });

          this.progress = data
          console.log(this.progress);
          this.progress.sort((a,b)=>a.rating-b.rating)
          this.topics.forEach((item) => {
            if(!this.oldTopics.includes(item.title)){
              this.newTopics = this.newTopics.concat(item.title)
            }
          });
          localStorage.oldTopics = JSON.stringify(this.oldTopics)
          localStorage.progress = JSON.stringify(this.progress)
        })
      })





    },
    methods:{
      async getAllTopics(){
        let {data,error} = await supabase.from('topics').select('title')
        if (error){
          throw(error)
        }
        return data

      },
      async getProgress(){

        if (localStorage.userID == undefined){
          if (localStorage.anonymProgress){

            var anonymProgress = JSON.parse(localStorage.anonymProgress)
            return Object.keys(anonymProgress).map(title=>{
              return {
                rating:anonymProgress[title].rating,
                topics:{
                  title:title
                }
              }
            })

          }else{
            return []
          }
        }

        let {data,error} = await supabase.from('progress_table')
        .select(
          `rating,
          topics(title)`)
        .eq('userID',localStorage.userID)
        if (error){
          throw(error)
        }
        return data
      }
    },


  }
</script>
<style scoped src = "../css/topicPicker.css">

</style>
