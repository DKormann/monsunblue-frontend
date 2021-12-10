<template>

    <span ref = "div"> </span>

</template>

<script>

import katex from 'katex'
// import 'katex/dist/katex.min.css';

export default {
  props:[
    "text",
  ],
  components:{
  },
  watch:{
    text(){
      this.createRender()
    }
  },
  mounted(){

    this.createRender()
  },
  methods:{
    createRender(){
      var splits = this.text.split('$')
      splits.forEach((item, i) => {
        if (i%2 == 1){
          splits[i] = katex.renderToString(splits[i])
        }
      });
      this.$refs.div.innerHTML = splits.join("")

    }
  }
}
</script>

<style lang="css" scoped>
</style>
