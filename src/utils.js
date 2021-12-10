function Hash(string) {

    var hash = 0;

    if (string.length == 0) return hash;

    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return String(hash);
}


function foo(){
  return 22
}
function apiRequest(data,dir='new',handler){
  var method = "post"
  var url = "https://www.monsunblue.de/api/"+dir;
  messageServer(method, data, url, handler)
}
function messageServer(method, data, url = '', handler=()=>{}){
  var body = JSON.stringify(data)
  var Http = new XMLHttpRequest()
  Http.onreadystatechange = ()=>{
    if (Http.readyState == 4){
      handler(Http.response)
    }
  }
  Http.open('post',url,true)
  Http.setRequestHeader('Content-Type','text/plain')
  Http.send(body)
}

//request general server functionality
function postOperation(operation, payload,protect = false, handler = ()=>{}){
  var data = {
    operation: operation,
    payload: payload,
    username: localStorage.username,
    passhash: localStorage.passhash,
    protected: JSON.stringify(protect)
  }
  messageServer('post',data,'https://www.monsunblue.de/api/operation',(response)=>{
    handler(response)
  })
}

function RandomString(){
  return Math.random().toString().substr(2,12)
}


function deleteUser(userName){
  postOperation("deleteUser",userName, true)
}
function deleteQuestion(id){
  postOperation("deleteQuestion",id, true)
}

export {foo, Hash,RandomString, apiRequest, deleteUser, deleteQuestion, postOperation}
