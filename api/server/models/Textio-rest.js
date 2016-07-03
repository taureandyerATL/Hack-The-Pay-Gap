var btoa= require("btoa");
var unirest = require('unirest');
var userName = "chris.hawkins@accenture.com";
var password = "password1";
var concatedUserNamePassword = userName+":"+ password;
// this is how username password should look
//e = "chris.hawkins@accenture.com:password1"


//copied from textio.min.js
function generateUUID() {
    var e = Date.now()
      , t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
        var n = (e + 16 * Math.random()) % 16 | 0;
        return e = Math.floor(e / 16),
        ("x" === t ? n : 3 & n | 8).toString(16)
    });
    return t
}
var sessionId = generateUUID();

var authPayLoad = {
    sessionId:sessionId,
    authorization: "Basic " + btoa(concatedUserNamePassword),
    version:"10108"
}

// console.log(authPayLoad);

unirest
.post('https://api.textio.com/auth/login')
.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
.send(authPayLoad)
.end(function (response) {
  console.log(response.body);
});