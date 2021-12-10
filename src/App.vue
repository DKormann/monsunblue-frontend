<template>
  <div id="nav" class ="nav">
    <router-link to="/">Start </router-link>
    <router-link to="/login">Login   </router-link>
    <router-link to="/about">About</router-link>
  </div>
  <div class="spacer">

  </div>
  <router-view/>

</template>


<style scoped src="@/css/master.css"></style>
<style scoped src="@/css/app.css"></style>
