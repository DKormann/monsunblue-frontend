<template>
<div>

  </div>
  <h1>Gib eine neue Aufgabe ein</h1>
  <div class="spacer">

  <h2>Thema:
    <select v-model = "topic">
      <option v-for="tp in topics" v-bind:key="tp.value">
        {{tp.title}}
      </option>
    </select>
  </h2>
  <p class = "error" ref= "topicerror"></p>


  <div class="spacer"></div>

    <input type="checkbox" style="width:0.8em;height:0.8em" v-model="serial">
    <span> erstelle Serie</span>

  <div v-if="serial">

      <span>Variablen:</span>
      <button @click = "variables.push({name:'#'+variables.length,values:'1;2;3'})" style="color:green;">+</button>
      <button @click = "variables.pop()" style="color:red;">-</button><br>

    <div v-for = "variable in variables" :key = "variable">
      <div class="element" >
        <p></p>

        <p>
          <span >{{variable.name}}: </span>
          <input v-model = "variable.values"><br>
        </p>

      </div>
    </div>


    <div class="spacer"></div>


  </div>


  <h2>Frage:</h2>
  <textarea rows="8" cols="40" v-model='title'></textarea>
  <div class="spacer"></div>
  <p class = "error" ref= "titleerror"></p>

  <h2>Lösung:</h2>

  <textarea rows="3" cols="40" v-model='solution'></textarea><br>

  <p class = "error" ref= "solutionerror"></p>

  <span>Schwierigkeitsgrad ca 0-100: </span>

  <input type="text" v-model='rating'><br>


  <button @click='preview'> Vorschau</button>

  <button type="submit" name="button" @click='submit'>
    Speichern
  </button>

  <div class="spacer"></div>

  <div v-if="showPreview">
    <h2>Vorschau:</h2>
    <div class="spacer"></div>
    <div class="spacer"></div>
    <div v-for="q in questions" :key= "q">
      <Question :content = "q"/>
    </div>
  </div>
  <p ref = "prev"></p>
  <div class="spacer">

  </div>

  </div>
</template>

<script>
import {supabase} from "../database/backend.js"
import Question from "./Question.vue"
export default{
    name:'Editor',
    components:{
      Question,
    },
    data(){
      return {

        serial:false,
        variables:[

          {
            name:'#0',
            values:'1;2;3',
          },
          {
            name:'#1',
            values:'1;2;3',
          },

        ],
        topic:localStorage.editortopic,
        title:localStorage.editortitle,
        solution:localStorage.editorsolution,
        topics:[],
        rating:'0',
        questions:[],
        showPreview : false,
        html: "",
      }
    },
    mounted(){

      supabase.from('topics').select('id,title')
      .then(ret=>{
        this.topics = ret.data
      })

    },
    methods:{

      parseQuestion(){

        if (this.topic == ""){
          this.$refs.topicerror.innerHTML = "Wählen Sie ein Thema aus"
          return -1
        }
        if (this.title.length<3){
          this.$refs.titleerror.innerHTML = "Die Frage muss länger sein"
          return -1
        }
        if (this.title.length == 0){
          this.$refs.solutionerror.innerHTML = "Die Lösung kann nicht leer sein"
          return -1
        }
        this.$refs.titleerror.innerHTML = ""
        this.$refs.topicerror.innerHTML = ""
        this.$refs.solutionerror.innerHTML = ""

        if (this.serial){
          this.questions = this.buildSeries(this.variables)
        }else{
          this.questions = [{
            topicTitle:this.topic,
            title:this.title,
            solution:this.germanify(this.solution),
            rating:this.rating
          }]
        }
      },

      parseGerman(zahl){
        zahl.replaceAll(" ","")
        zahl.replaceAll(",",".")
        return Number(zahl)
      },
      germanify(number){
        var zahl = String(number)
        zahl = zahl.replaceAll(".",",")
        return zahl
      },

      buildSeries(variables){

        // turn string representation into array of name number pairs
        var listVars = variables.map(v => {
          var varArray = v.values.split(";")
          varArray = varArray.map(this.parseGerman)

          var arr = []
          varArray.forEach(num =>{
            arr.push([[v.name,num]])
          })
          return arr
        })

        console.log(listVars);

        function perm (arr1, arr2 ){
          if (arr2.length == 0){
            return arr1
          }
          var res = []
          for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
              res.push(arr1[i].concat(arr2[j]))
            }
          }
          return res
        }

        var permutations = listVars[0]

        for (var i = 1; i < listVars.length; i++ ){
          permutations = perm(permutations,listVars[i])
        }

        var questions = []
        permutations.forEach(permutation=>{

          var title = this.title
          var solution = this.solution
          var rating = this.rating
          permutation.forEach(variable=>{

            var varName = variable[0]
            var varValue = variable[1]
            title = title.replaceAll(varName,varValue)


            solution = solution.replaceAll(varName, varValue)
            rating = rating.replaceAll(varName, varValue)

          })
          // lets evaluate everything betwenn [ ]
          var head = title.split('[')
          var rest = head.splice(1)
          rest = rest.map(part=>{
            var splits = part.split(']')
            var inner = splits[0]
            inner = Function('return '+inner)()
            return inner + splits[1]
          })
          rest = rest.join('')
          title = head+rest


          try{
            console.log("rating:",rating);

            solution = Function("return "+solution)()
            rating = Function("return "+rating)()
            console.log("final ratin:",rating);
          }catch (error){
            console.log(error);
          }
          rating = parseInt(parseFloat(rating)+0.5)
          questions.push({
            title:title,
            solution:this.germanify(solution),
            rating:rating,
            topicTitle:this.topic,

          })
        })
        return questions
      },

      async submit(){

        this.parseQuestion()

        var topicTitle = this.questions[0].topicTitle
        console.log(topicTitle);
        var topicID = -1
        this.topics.forEach((item) => {
          if (item.title == topicTitle){
            topicID = item.id
          }
        });
        console.log(topicID);


        this.questions.forEach(async q=>{

          let {data} = await supabase
          .from('questions')
          .insert([
            {title:q.title,
            solution:q.solution}
          ])
          var questionID = data[0].id

          let{ error} = await supabase
          .from('question_ratings')
          .insert([
            {topicID:topicID,
            questionID:questionID,
            rating:q.rating}
          ])
          console.log(error);

        })
        alert(`${this.questions.length} Fragen wurden hinzugefügt.`)
      },

      preview(){
        this.parseQuestion()
        console.log(this.questions);
        this.showPreview = true
      },

    }
  }
</script>
<style scoped src = "../css/editor.css"></style>
