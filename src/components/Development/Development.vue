<template>
  <div class="nav">
    <!-- <button class = "developmentCategory" @click = "category = 'questions'">
      Fragen
    </button> -->
    <button class = "developmentCategory" @click = "category = 'members'">
      Nutzer
    </button>
    <button class = "developmentCategory" @click = "category = 'topics'">
      Themen
    </button>
  </div>

  <h1>Development  </h1>

  <!-- <Questions v-if="category=='questions'"/> -->
  <Members v-if="category=='members'"/>
  <Topics v-if="category=='topics'"/>

</template>

<script>
// import Questions from "./Questions"
import Members from "./Members"
import Topics from "./Topics"
export default {
  name : 'Development',
  components: {
    // Questions,
    Members,
    Topics,
  },

  mounted(){
    // this.search("")
  },
  data(){
    return {
      category:"questions",
      questions:[],
    }
  },
  methods:{
    switchCategory(category){
      this.category = category
    },
    keyup(event){
      if (event.key == "Enter"){
        this.search(this.$refs.search.value)
      }
    },


  },

}
</script>

<style scoped src = "@/css/development.css"></style>
