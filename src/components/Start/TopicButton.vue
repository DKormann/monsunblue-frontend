<template>
  <div class="element">
    <button :id ="ID"  class='topicButton'>

      <router-link  :to="{name:'Test', params:{id:ID}}">
        <h3>
          {{ID}}
          <span style="float:right">{{percenter()}}</span>
        </h3>
      </router-link>

    </button>
  </div>



</template>

<script>
  export default{
    props:[
      'topic'
    ],
    data(){
      return {
        input:"",
        ID : this.topic[0],

        // .replaceAll(" ","_"),
        progress: this.topic[1],
      }
    },
    mounted(){

      this.createStyle()

    },
    methods:{

      get_link(){
        var base="Test/"
        var tail="plusminus"
        var link=base+tail
        console.log(link);
        return "Test/"+this.title
      },
      percenter(){
        var perc = Math.round(this.progress)
        if (perc == 0){
          return ""
        }
        return JSON.stringify(perc)+" points"
      },

      createStyle(){


        // create an new style
        const style = document.createElement('style');

        // append to DOM
        document.head.appendChild(style);


        // insert CSS Rule

        var styleTag = this.ID.replaceAll(" ", "\\ ")

        style.sheet.insertRule(`
            #`+styleTag+` {
              background: linear-gradient(90deg, var(--active) `+this.progress+`%, #0000 0);
            }
        `);
      }
    },
  }
</script>
<style scoped src = "@/css/topicButton.css"></style>
