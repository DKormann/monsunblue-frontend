<template>
  <GameStart v-if='startGame' :points='points'/>
  <div v-if="question">
    <h2 class = 'points' >
      points: {{Math.round(points)}}
      <span v-if='streak>0'>+</span><span v-if='streak!=0'>{{streak}}</span>

    </h2>
    <Question :content="question" ref="question" @failed="failed" @solved="solved" @next="next"/>

  </div>

  <h2 v-if="!question">Thema fertig</h2>

  <timeBar/>

</template>

<script>  

import Question from './Question.vue'
import TimeBar from './TimeBar.vue'
import GameStart from './GameStart.vue'

let matchmaker = require("@/matchmaker.js")

export default {
  name: 'Test',
  components: {
    Question,
    TimeBar,
    GameStart,
  },
  data(){
    return {
      question:{title:"",},
      data:[],
      index:1,
      topic:this.$route.params.id,

      hist:[-1],
      session:null,
      points:0,
      streak:0,
      startGame : false,
    }
  },

  async mounted(){

    this.prepareGame(1)

    this.session = await matchmaker.start(this.topic)

    if (localStorage[this.topic]==null){
      localStorage[this.topic]=0
    }

    this.getNewQuestion()
  },

  methods:{
    prepareGame(minutes){
      setTimeout(()=>{
        localStorage.lastTopic = this.topic
        this.startGame = true
        localStorage.points = this.points
      }, minutes*60000)
    },

    async getNewQuestion(){
      this.question = await matchmaker.getNewQuestion()
    },

    solved(){
      if(this.streak < 1)this.streak = 1
      else this.streak = 2
      this.points += this.streak
      matchmaker.solved()
    },

    failed(){
      if(this.streak>-1)this.streak = -1
      else this.streak = -2
      this.points += this.streak
      matchmaker.failed()
    },

    resetSkill(){
      localStorage[this.topic]=0
    },

    next(){
      this.hist.push(this.question.id)
      if (this.hist.length>10){
        this.hist=this.hist.slice(-10)
      }
      var rating=Math.round(localStorage[this.topic])
      this.getNewQuestion(this.topic,rating)
      this.$refs.question.start()
    },
  }
}
</script>

<style scoped src = "@/css/test.css" ></style>
