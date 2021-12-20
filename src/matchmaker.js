let auth = require("./database/authentication.js")
let util = require("./utils.js")
import {supabase} from "./database/backend.js"

var session

async function start(topic){

  if(!localStorage.userID){
    // create anonym userprofile
    let name = util.RandomString()
    let pwd = util.RandomString()
    let username = "anon_"+name
    let mail = username+"@mail"
    await auth.register(username,mail,pwd)
    localStorage.anonym = true
  }

  session = {
    rating:0,
    solved:[],
    failed:[],
    topic:topic,
    userID:localStorage.userID,
  }

  // find out topicID
  let {data,error} = await supabase.from('topics')
  .select('id')
  .eq('title',topic)
  session.topicID = data[0].id
  if (error){
    console.log (error)
  }
  var res = await supabase.from('progress_table')
  .select('rating,solved,failed')
  .eq('userID',session.userID)
  .eq('topicID',session.topicID)
  .maybeSingle()
  if (res.error){
    console.log('error getting table');
    console.log (res.error)
  }else{
    if (res.data == null){
      session.rating = 0
      session.solved = []
      session.failed = []
      session.questionID = -1
      saveNew()

    }else{
      session.rating = res.data.rating
      session.solved = res.data.solved
      session.failed = res.data.failed
      if (session.failed == null){
        session.failed = []
      }
      session.questionID = -1
    }
  }
  return session
}

function close(){
  console.log("closing matchmaking on topic:",session.topic);
}

async function saveNew(){

    let{error} = await supabase.from ('progress_table')
    .insert({
      topicID:session.topicID,
      userID:session.userID,
      rating:session.rating,
      solved:session.solved,
      failed:session.failed,
    })
    if (error){
      throw(error)
    }

}
async function save(){

  let {error} = await supabase.from('progress_table')
  .update({
    rating: session.rating,
    solved: session.solved,
    failed: session.failed,
  })
  .match({
    userID: session.userID,
    topicID:session.topicID,
  })
  if (error){
    throw(error);
  }

}

async function getNewQuestion(){
  console.log({session});
  let res = await supabase.from('question_ratings')
  .select(`
    questionID,
    rating`)
  .eq('topicID',session.topicID)
  .order('rating',{ascending:true})
  .gte('rating',session.rating)
  .limit(10)
  if (res.error){
    console.log(res.error);
  }
  session.questionCandidates = res.data
  console.log({candidates: session.questionCandidates});
  if (session.questionCandidates == null || session.questionCandidates.length == 0){
    console.error('no questions available');


    if (session.failed.length != 0){
      session.questionID = session.failed.shift()
    }else{

      return
    }
  }


  for (var i = 0; i < session.questionCandidates.length; i++) {

    let id = session.questionCandidates[i].questionID
    if (!session.solved.includes(id)){
      session.questionID = id
      session.questionRating = session.questionCandidates[i].rating
      break
    }
  }

  console.log("getting question on id",session.questionID);


  let question = (
    await supabase.from('questions')
    .select('title,solution')
    .eq('id',session.questionID)
  ).data[0]

  return question
}

function solved() {

  var change = 1 + (session.questionRating - session.rating) * 0.2
  change = Math.max(0,change) // cant loose points on solving question

  session.rating += change
  session.solved.push(session.questionID)

  if (session.solved.length>10){
    session.solved = session.solved.splice(10)
  }
  session.failed = session.failed.filter(id => id != session.questionID)
  save()
  tuneQuestionRating( - change)

}
function failed() {
  var change = 1 - (session.questionRating - session.rating) * 0.2
  change = Math.max(0,change)

  session.rating -= 3*change
  session.failed.push(session.questionID)
  if(session.failed.length>10){
    session.failed = session.failed.splice(10)
  }
  save()
  tuneQuestionRating(change)
  session.streak = Math.min(session.streak,)
}

async function tuneQuestionRating(delta){
  let {error} = await supabase.rpc('tune_question_rating',{
    topic_id:session.topicID,
    question_id:session.questionID,
    delta:delta,
  })
  if (error){
    console.log(error.message);
  }

}

export{start,close,getNewQuestion, solved, failed}
