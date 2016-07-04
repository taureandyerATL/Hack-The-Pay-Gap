var btoa = require("btoa");
var unirest = require('unirest');
var merge = require("merge");
var userName = "chris.hawkins@accenture.com";
var password = "password1";

var local = {
    log: (message) => {
        console.log(message);
    }
};


//copied from textio.min.js
function generateUUID() {
    var e = Date.now(),
        t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
            var n = (e + 16 * Math.random()) % 16 | 0;
            return e = Math.floor(e / 16),
                ("x" === t ? n : 3 & n | 8).toString(16)
        });
    return t
}

// var authPayLoad = {
//     sessionId: sessionId,
//     authorization: "Basic " + btoa(concatedUserNamePassword),
//     original: true,
//     version: version,
//     queue: "default"
// }

var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
// console.log(authPayLoad);

var loginPromise = (userName, password) => {
    return new Promise(function(resolve, reject) {
        // this is how username password should look
        //e = "chris.hawkins@accenture.com:password1"
        var concatedUserNamePassword = userName + ":" + password;
        var version = "10108";
        var sessionId = generateUUID();
        var firstAuthPayLoad = {
            sessionId: sessionId,
            authorization: "Basic " + btoa(concatedUserNamePassword),
            original: true,
            version: version,
            queue: "default"
        };
        local.log(firstAuthPayLoad);
        unirest
            .post('https://api.textio.com/auth/login')
            .headers(headers)
            .send(firstAuthPayLoad)
            .end(function(response) {
                // console.log(response.body.token);
                if (response.code === 200) {
                    firstAuthPayLoad.authorization = "Basic " + btoa(response.body.token);
                    firstAuthPayLoad.original = false;
                    // console.log(authPayLoad);
                    resolve(firstAuthPayLoad);
                    return;
                }
                reject(response);
            });
    });
};

// to list all document of a user, what i think happens is, if you submit a document is created,
// that can be used later to get the results
var listPromise = (authObj) => {
    return new Promise((resolve, reject) => {
        var data = {
            limit: 50,
            offset: 0,
            owned: true,
            shared: false,
            sort_descend: true,
            sort_by: "edit_time",
            search: "",
            search_targets: [
                "score",
                "title",
                "location"
            ],
            include_history: false,
           sessionId:authObj.sessionId,
           authorization:authObj.authorization,
           queue:authObj.queue,
           version:authObj.version
        };

        local.log(data);
        unirest
            .post('https://api.textio.com/talent/document/list')
            .headers(headers)
            .send(data)
            .end((response) => {
                if (response.code === 200) {
                    local.log(' Listing documents success ');
                    // local.log(response);
                    // console.log(response.body);
                    resolve(response.body);
                    return;
                }
                reject(response);
            });
    });
};

loginPromise(userName, password)
    .then((authObj) => {
        local.log("login sucessfully");
        // local.log(authObj);
        return listPromise(authObj);
    })
    .then((listResponse) => {
        local.log('After listing');
        local.log(listResponse);
    })
    .catch((rejectDetails) => {
        local.log("Something went wrong");
        // local.log(rejectDetails);
    });
