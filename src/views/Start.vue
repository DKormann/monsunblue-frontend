
<template>

    <h1>Monsunblue</h1>
    <TopicPicker/>
    <div class="spacer"></div>
    <router-link to="/editor" class ="router-link">neue Frage erstellen</router-link>
    <div class="spacer"></div>

</template>

<script>

import TopicPicker from '../components/TopicPicker'
// let auth = require("../database/authentication.js")
// let utils = require("../utils.js")
export default {
  name: 'Start',
  components: {
    TopicPicker,
  },
  data(){
    return {
      skillMap:{}
    }
  },
  mounted(){
  },
  methods:{

  }
}

</script>
