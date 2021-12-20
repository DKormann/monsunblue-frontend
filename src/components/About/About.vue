<template>
  <div class="about">
    <h1>Was ist Monsunblue</h1>
    <h3>Monsunblue versucht Lernen besser zu machen.</h3>

      <h3>
        <p>
          
        </p>
      </h3>
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
