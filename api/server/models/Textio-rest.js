var btoa = require("btoa");
var unirest = require('unirest');
var merge = require("merge");
var userName = "chris.hawkins@accenture.com";
var password = "password1";
var jobDescription = 'Accenture helps leading Automotive and Industrial companies drive superior performance in their global and complex supply chains to deliver products to their customers.  We offer a comprehensive suite of capabilities in the supply chain space including defining and implementing operating capabilities across the long, medium and short term planning horizons as well as demonstrating advanced technologies to enable these complex yet integrated functions. ';
var concatedUserNamePassword = userName + ":" + password;


var version = "10108";
var local = {
    log: (message) => {
        console.log(message);
    }
};
// this is how username password should look
//e = "chris.hawkins@accenture.com:password1"


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
var sessionId = generateUUID();

var authPayLoad = {
    sessionId: sessionId,
    authorization: "Basic " + btoa(concatedUserNamePassword),
    version: version,
    queue: "default"
}

var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
// console.log(authPayLoad);

var loginPromise = new Promise(function(resolve, reject) {
    unirest
        .post('https://api.textio.com/auth/login')
        .headers(headers)
        .send(authPayLoad)
        .end(function(response) {
            // console.log(response.body.token);
            if (response.code === 200) {
                authPayLoad.authorization = "Basic " + btoa(response.body.token);
                // console.log(authPayLoad);
                resolve(authPayLoad);
                return;
            }
            reject(response);
        });
});

var mergeAuthInfo = (data) => {
    return merge(data, authPayLoad)
};

// to list all document of a user, what i think happens is, if you submit a document is created,
// that can be used later to get the results
var listPromise = new Promise((resolve, reject) => {
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
        include_history: false
    };

    unirest
        .post('https://api.textio.com/talent/document/list')
        .headers(headers)
        .send(mergeAuthInfo(data))
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


var submitRequestPromise = new Promise((resolve, reject) => {
    var requestData = {
        title: "Accenture Doc",
        description: "Accenture helps leading Automotive and Industrial companies drive superior performance in their global and complex supply chains to deliver products to their customers.  We offer a comprehensive suite of capabilities in the supply chain space including defining and implementing operating capabilities across the long, medium and short term planning horizons as well as demonstrating advanced technologies to enable these complex yet integrated functions. &nbsp;Another",
        changeNum: 33,
        docSessionID: generateUUID(),
        document_id: generateUUID(),
        jobType: "",
        client_word_count: 64,
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
        .send(mergeAuthInfo(requestData))
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

var resultRequestData = {
    job_id: ""
};

var getResultsPromise = () => {
    return new Promise((resolve, reject) => {

        var requestData = resultRequestData;

        unirest
            .post('https://api.textio.com/results')
            .headers(headers)
            .send(mergeAuthInfo(requestData))
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
loginPromise
    .then(() => {
        local.log("login sucessfully");
        local.log(authPayLoad);
        return listPromise;
    })
    .then((listResponse) => {
        local.log('After listing');
        // local.log(listResponse);
        return submitRequestPromise;
    })
    .then((submitRequestResponse) => {
        resultRequestData.job_id = submitRequestResponse.job_id;
        setTimeout(() => {
            getResultsPromise().then((resultData) => {
                local.log(resultData);
            }).catch((errorData) => {
                local.log(errorData);
            });
        }, 2000);
        // local.log(submitRequestResponse);   
        // return getResultsPromise; 
    })
    // .then((resultsData) => {
    //     local.log(resultsData);
    //     if(resultsData.metadata.status === 'pending') {
    //         setTimeout(()=>{
    //             getResultsPromise
    //         })
    //     }
    // })
    .catch((rejectDetails) => {
        local.log("Something went wrong");
        // local.log(rejectDetails);
    });