<template>
  <div class="facetext">

    <div class="title" >

      <h3>wilkommen bei</h3>
      <h1>Monsunblue</h1>
      <h3>Die moderne Mathe - </h3>
      <h3>Lernplattform</h3>

      <div class="spacer">
      <button >
        <h3 class = "startbutton" @click = "start">jetzt kostenfrei loslegen</h3>
      </button>
    </div>

    </div>

    <div class="opttext">
      <h2>Optimierte Fragestellungen</h2>
      <div class="spacer">
      </div>
      <h3>Nutze unsere Datenbank mit tausenden Fragestellungen um automatisch
      eine Aufgabe zu finden die den optimalen Schwierigkeitsgrad hat</h3>
    </div>
    <div class="balancetext">
      <h2>Learn-Life Balance</h2>
      <h3>Monsunblue fördert ein ausgeglichenes Lernverhalten mit regelmäßigen Pausen </h3>
    </div>
  </div>
  <img id = "pagode" src="@/../assets/pagode.svg" alt="">

  <div class="footer">
    <div class="info">
      <!-- <p>about</p> -->

      <a href="#/terms">
        Nutzungsbedingungen
      </a>
      <p></p>
      <a href="#/kontakt">
        Kontakt
      </a>
    </div>
  </div>
  <!-- <div id = "pagode"> </div>-->

</template>

<script>
import router from '@/router'
export default {
  data(){
    return{
      questionCount:"über 1000"
    }
  },
  methods:{
    start(){
      router.push('/')
    }
  }
}
</script>

<style scoped src = "@/css/welcome.css">
</style>
