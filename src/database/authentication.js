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
}
