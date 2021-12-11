export{login,register}
let utils = require("../utils.js")
import {supabase} from "./backend.js"



async function login(email, password) {
  const passhash = utils.Hash(password)
  const data = await supabase.auth.signIn({
  email: email,
  password: passhash,
  })
  if (data.error){
    throw(data.error)
  }
  localStorage.userID = data.user.id
  localStorage.username = data.user.user_metadata.username
}
async function register(username, email, password) {
  const passhash = utils.Hash(password)
  const data = await supabase.auth.signUp(
    {
      email: email,
      password: passhash,
    },
    {
      data: {
        username : username
      }
    }
  )
  if (data.error){
    throw(data.error)
  }
  if(localStorage.anonym){
    (
      supabase.from('progress_table')
      .update({userID:data.user.id})
      .match({userID:localStorage.userID})
    ).then(data=>{
      console.log('transfered data from',localStorage.userID,'to',data.user.id);

    })
  }
  delete localStorage.anonym
  localStorage.userID = data.user.id
  localStorage.username = data.user.user_metadata.username

  // if (localStorage.anonymProgress){
  //   var progress = JSON.parse(localStorage.anonymProgress)
  //   Object.keys(progress).forEach(async (topic) => {
  //     console.log('creating table',topic)
  //     var rating  = progress[topic].rating
  //     var topicID = progress[topic].topicID
  //     // console.log(data);
  //     var userID = data.user.id
  //     console.log({topicID,userID});
  //
  //     console.log(rating);
  //     let {error} = await supabase.from('progress_table')
  //     .insert({
  //       userID: userID,
  //       topicID:topicID,
  //       rating:rating,
  //       solved:[],
  //       failed:[],
  //     })
  //     if (error){
  //       console.log(error);
  //     }
  //     // .catch(error=>console.log(error))
  //   });
  // }
}
