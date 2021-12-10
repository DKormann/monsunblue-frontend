import {supabase} from "./database/backend.js"


var session = {userID : localStorage.userID}
if (!localStorage.userID){
  if (localStorage.anonymProgress){
    var anonymProgress = JSON.parse(localStorage.anonymProgress)
  }else{
    anonymProgress = {}
    console.log('new',{anonymProgress});
  }
  console.log({anonymProgress});
}

async function start(topic){
  session.topic = topic

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
  .eq('userID','fd8897d0-82e6-4327-8974-e852147c96e8')
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

}
function close(){
  console.log("closing matchmaking on topic:",session.topic);
}
async function saveNew(){
  if (!localStorage.userID){
    anonymProgress[session.topic] = {
      rating:session.rating,
      topicID: session.topicID
    }
    localStorage.anonymProgress = JSON.stringify(anonymProgress)
  }else{
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
}
async function save(){
  if (localStorage.userID == undefined){
    // anonym user
    console.log('anonym save');
    anonymProgress[session.topic]={rating:session.rating,topicID : session.topicID}
    console.log(JSON.stringify(anonymProgress));
    localStorage.anonymProgress = JSON.stringify(anonymProgress)
  }else{

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
}

async function getNewQuestion(){

  let res = await supabase.from('question_ratings')
  .select(`
    questionID`)
  .eq('topicID',session.topicID)
  .order('rating',{ascending:true})
  .gte('rating',session.rating)
  .limit(10)
  session.questionCandidates = res.data

  for (var i = 0; i < session.questionCandidates.length; i++) {

    let id = session.questionCandidates[i].questionID
    if (!session.solved.includes(id)){
      session.questionID = id
      break
    }
  }


  let question = (
    await supabase.from('questions').select('title,solution').eq('id',session.questionID)
  ).data[0]

  return question
}
function solved() {

  session.rating += 1
  session.solved.push(session.questionID)

  if (session.solved.length>10){
    session.solved = session.solved.splice(10)
  }
  save()
}
function failed() {
  session.rating -= 3
  session.failed.push(session.questionID)
  if(session.failed.length>10){
    session.failed = session.failed.splice(10)
  }
  save()
}

export{start,close,getNewQuestion, solved, failed}
