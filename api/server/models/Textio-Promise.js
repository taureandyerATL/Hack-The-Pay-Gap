var btoa = require("btoa");
var unirest = require('unirest');
var merge = require("merge");
var wordcount = require('wordcount');
var userName = "a@thakral.in";
var password = "password1";

var local = {
    log: message => {
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
        var version = "10224";
        var sessionId = generateUUID();
        var firstAuthPayLoad = {
            sessionId: sessionId,
            authorization: "Basic " + btoa(concatedUserNamePassword),
            original: true,
            version: version,
            queue: "default"
        };
        // local.log(firstAuthPayLoad);
        unirest
            .post('https://api.textio.com/auth/login')
            .headers(headers)
            .send(firstAuthPayLoad)
            .end(function(response) {
                // console.log(response.body.token);
                if (response.code === 200) {
                    firstAuthPayLoad.authorization = "Basic " + btoa(response.body.token + ":");
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
var listPromise = authObj => {
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
        };
        var requestData = merge(data, authObj);
        // local.log(JSON.stringify(authObj));
        unirest
            .post('https://api.textio.com/talent/document/list')
            .headers(headers)
            .send(requestData)
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

var submitRequestPromise = (authObj, description) => {
    return new Promise((resolve, reject) => {
        var requestData = {
            title: "Accenture Doc",
            description:description,
            changeNum: 0,
            docSessionID: generateUUID(),
            document_id: generateUUID(),
            jobType: "",
            client_word_count: wordcount(description) ,
            location: {
                fullText: "",
                placeId: "",
                shortText: ""
            },
            document_type: "jobListing",
            factor_override: null,
        };

        unirest
            .post('https://api.textio.com/talent/submit')
            .headers(headers)
            .send(merge(requestData, authObj))
            .end((response) => {
                if (response.code === 200) {
                    local.log(' Submited request for the document sucessfully ');
                    // local.log(response);
                    // console.log(response.body);
                    resolve(response.body);
                    return;
                }
                reject(response);
            });
    });
};


var pollForResultsPromise = (authObj, job_id) => {
    return new Promise((resolve, reject) => {

        var requestData = {
            job_id: job_id
        };

        unirest
            .post('https://api.textio.com/results')
            .headers(headers)
            .send(merge(authObj, requestData))
            .end((response) => {
                if (response.code === 200) {
                    local.log(' attempt for results ');
                    if (response.body.metadata.status === 'pending') {
                        local.log("result is pending");
                        setTimeout(() => {
                            pollForResultsPromise(authObj, job_id)
                                .then(returnedData => resolve(returnedData))
                                .catch(error => reject(error));
                        }, 2000);
                    }
                    else if (response.body.metadata.status === 'complete') {
                        resolve(response.body);
                    }
                    // local.log(response);
                    // console.log(response.body);
                    return;
                }
                reject(response);
            });
    });
};

var coreFunc = (description) => {
    return new Promise((resolve, reject) => {
        var authObj = {};
        loginPromise(userName, password)
            .then(postLoginAuthObj => {
                local.log("login sucessfully");
                authObj = postLoginAuthObj;
                // local.log(authObj);
                return listPromise(authObj);
            })
            .then(listResponse => {
                local.log('After listing');
                // local.log(listResponse);
                return submitRequestPromise(authObj, description);
            })
            .then(submitResponse => {
                local.log('After successful request submission');
                // local.log(listResponse);
                return pollForResultsPromise(authObj, submitResponse.job_id);
            })
            .then(resultData => {
                local.log('After completed result');
                local.log(resultData);
                resolve(resultData);
            })
            .catch((rejectDetails) => {
                local.log("Something went wrong");
                local.log(rejectDetails);
                reject(rejectDetails);
            });
    });

};

var selfTest = () => {
    coreFunc("Accenture helps leading Automotive and Industrial companies drive superior performance in their global and complex supply chains to deliver products to their customers.  We offer a comprehensive suite of capabilities in the supply chain space including defining and implementing operating capabilities across the long, medium and short term planning horizons as well as demonstrating advanced technologies to enable these complex yet integrated functions. Another")
        .then(resultData => {
            local.log(resultData);
        }).catch(error => {
            local.log(error);
        });
};

if (require.main === module) {
    selfTest();
} else {
    module.exports = coreFunc;
}
