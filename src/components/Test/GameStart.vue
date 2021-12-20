<template lang="html">
  <div class="fill">

    <div ref = "main" tabindex="0" class="bubble">
        <h1 >{{points}} Punkte</h1>
        <!-- <router-link  :to="{name:'Game'}">

          <h2>Play Game</h2>
        </router-link> -->
        <!-- <h2 class = "game" @click = "game">start game</h2> -->
        <a href="/pong/index.html">
          <h2 class ="game">Start Game</h2>
        </a>
        <h2 class = 'goon' @click = "goon">exit</h2>

    </div>
  </div>

</template>

<script>
import router from '@/router'
export default {
  props:[
    "points"
  ],
  mounted(){
    this.$refs.main.focus()
  },
  methods:{
    goon(){
      router.push({path:"/"})
    },
    game(){
      router.push({path:'chess/dist'})
    }
  }
}
</script>

<style scoped src = '@/css/gamestart.css'>

</style>
