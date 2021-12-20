<template>
    <div class="question">
      <div class="spacer"></div>

      <h2 ><Formula :text = "title"/></h2>
      <h2>{{result}}</h2>
      <div  onselectstart='return false;' class="spacer"></div>
      <input onpaste='return false' v-if="showInput" ref="input" class="test" type="text" v-model='input' @keyup="keyup" >
      <br>
      <button class="test" type="button" name="button" ref="action" @click='action' >
        {{buttonMsg}}
      </button>

    </div>

</template>

<script>
import Formula from './Formula.vue'
  export default{
    props:[
      'content',
    ],
    components:{
        Formula,
    },
    watch:{
      content(newTitle){
        this.title=newTitle.title
      }
    },

    data(){
      return {
        title:this.content.title,
        showInput:true,
        result:"",
        input:"",
        buttonMsg:"keine Ahnung",
        rounding: 0.01,
      }
    },
    created(){

      (function () {
        var script = document.createElement('script');
        script.async = true;
        document.head.appendChild(script);
      })();


      this.action=this.go
      this.$nextTick(()=>{
        this.$refs.input.focus()
      })
    },
    methods:{

      check(input){

        console.log(input);

        var solution = this.round(this.content.solution)
        input = this.round(input)

        return solution == input


      },
      round(input){
        input = this.parseGerman(input)
        return Math.round(input/this.rounding)*this.rounding
      },

      parseGerman(input){
        input = input.replace(',','.')
        return parseFloat(input)
      },

      germanify(input){
        input = String(input)
        input = input.replace('.',',')
        return input
      },

      go(){
        if (this.input==""){

          return
        }
        if ( this.check(this.input) ){
          this.$emit('solved')
          this.input=""
          var glow=parseFloat(localStorage.energy)
          glow+=0.1
          document.documentElement.style.setProperty('--glow',glow)
          localStorage.energy=glow
          this.$emit('next')
          return
        }else{
          this.$emit('failed')
          this.result=this.input+" ist leider Falsch. "+this.germanify(this.round(this.content.solution))+' ist die richtige Antwort.'
          this.input=""
          this.action=this.next
          this.buttonMsg="weiter"
          this.showInput=false
          this.$refs.action.focus()
        }


      },
      next(){

        this.$emit('next')
        this.buttonMsg="aufgeben"
        this.action=this.go
        this.input=""
        this.showInput=true
        this.$nextTick(()=>{
          this.$refs.input.focus()
        })

      },
      keyup(k){
        if (k.key=="Enter"){
          this.action()
        }else{
          this.buttonMsg="fertig"
        }
      },

      start(){

        (function () {
          var script = document.createElement('script');
          script.async = true;
          document.head.appendChild(script);
        })();

        this.result=""
        this.$forceUpdate()
      }
    },
  }
</script>
<style  scoped src = "@/css/question.css"></style>
