<template>
  <div class="about">
    <h1>Was ist Monsunblue</h1>
    <h3>Monsunblue versucht Lernen leichter zu machen.</h3>
    <div class="info">

      <h3>
        <p>Um Fragen mit dem richtigen Schwierigkeitsgrad zu stellen, speichern wir
           wie gut du in den einzelnden Themen bist in deinem Browser. Diese Daten werden von uns nicht gesammelt.</p>
        <p>wenn du ganz von vorne anfangen möchtest kannst du alle gespeicherten Daten löschen:</p>
      </h3>
    </div>

  <button type="button" name="button" @click="emptyStorage">lösche alle daten </button>

  <h3>
    <p>
      Du kannst mithelfen, Monsunblue besser zu machen indem du eine neue Fragen erstellst
    </p>
  </h3>

  <button type="button" name="button">
    <router-link to="editor" style="font-decoration:none">
      Neue Frage Erstellen
    </router-link>
  </button>
  <br/>
  <router-link to="development">entwickler tools</router-link>



  </div>
</template>

<style scoped src = "@/css/about.css">

</style>
<script>
  export default{
  methods:{
    emptyStorage(){
      var topics=["Plus","Minus","Ein mal eins","Geteilt"]
      for (var i in topics){
        localStorage[topics[i]]=0
      }
      alert("daten wurden gelöscht")
    }
  }
}

</script>
