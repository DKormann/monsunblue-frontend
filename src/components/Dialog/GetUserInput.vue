<template>
  <div id="body" @click.self = "exit()">
    <div id="display">
      <h2>{{title}}</h2>
      <input ref="input" @keyup = "keyup" value="">

    </div>
  </div>

</template>

<script>
export default {
  name:"GetUserInput",
  props:[
    "title",
    "callback",
    "exit",
  ],
  mounted(){
    this.$refs.input.focus()
  },
  methods:{
    keyup(event){
      if (event.key == "Enter"){
        this.callback(this.$refs.input.value)
        this.exit()
      }
      if (event.key == "Escape"){
        this.exit()
      }
    }
  }
}
</script>

<style lang="css" scoped>
  #body{
    position: fixed;
    top:0;
    width:100%;
    height: 100%;
    background: #9999;
    justify-content: center;
  }
  #display{
    pointer-events: visible;
    position: relative;
    margin:auto;
    padding:1em;
    border-radius:1em;
    top: 10vh;
    background: var(--alpha);
    width:60vw;
  }
  h2{
    color:white;
  }
</style>
