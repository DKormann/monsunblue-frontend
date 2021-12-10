<template>
      <Question :content="question" ref="question" @failed="failed" @solved="solved" @next="next"/>

</template>

<script>

import Question from '../components/Question.vue'
let matchmaker = require("../matchmaker.js")

export default {
  name: 'Test',
  components: {
    Question,
  },
  data(){
    return {
      question:{title:"",},
      data:[],
      index:1,
      topic:this.$route.params.id,

      hist:[-1],
      diffscale:0.2,//how much does the difference in difficulty get accounted for
      reward:1,
      penalty:0.8,
    }
  },

  async mounted(){

    await matchmaker.start(this.topic)


    if (localStorage[this.topic]==null){
      localStorage[this.topic]=0
    }

    this.getNewQuestion()
  },

  methods:{


    async getNewQuestion(){
      this.question = await matchmaker.getNewQuestion()
      
    },
    solved(){
      matchmaker.solved()
    },
    failed(){
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
