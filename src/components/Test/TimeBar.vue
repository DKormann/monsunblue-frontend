<template >
  <div class = 'bar'>
    <div class="inner_bar">
    </div>
  </div>



</template>

<script>
export default {
  mounted(){
    this.createStyle()
  },
  unmounted(){
    // clearTimeout(this.timer)
  },
  methods:{
    data(){
      return{
        progress:20,
      }
    },

    createStyle(){
      // this.timer = setTimeout(()=>alert('time'), 3000)
    }
  }
}
</script>
<style media="screen">
  .bar{
    /* background-color: var(--beta); */
    position:absolute;
    left:50%;
    transform: translateX(-50%);
    bottom:2em;
    width:60vw;
    padding: .2em;
    /* border-radius: 2em; */

  }
  .inner_bar{
    margin:.5em;
    height:.2em;
    border-radius: 1em;
    /* background: linear-gradient(90deg, white 100%, #0000 0); */
    background: white;
    left:0;
    width:0%;
    box-shadow: 0px 0px .2em .2em  #22f;
    animation-name: bar;
    animation-duration: 600000ms;
    animation-timing-function: linear;
  }
  @keyframes bar {
    0%{width:100%}
    /* 100%{box-shadow:0 #000} */
  }
</style>
