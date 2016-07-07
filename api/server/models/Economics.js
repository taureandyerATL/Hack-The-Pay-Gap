var MIDAAS_quantile = "https://api.commerce.gov/midaas/quantiles?";
var MIDAAS_distribution = "https://api.commerce.gov/midaas/distribution?";
var querystring= require('querystring');
var request = require("request");
/**MIDAAS API KEY**/
var MIDAAS_API_KEY = "Xlu19QS9DBy29a7gj8DN0tTSKmfRmTv3ewDV1yD6";


module.exports = function(Economics) {

    Economics.getQuantile = function(gender, state, age, compare, race, next){ //parameters, next){
        //var postData = "{\"year\": \"2015\", \"state\": \"CA\", \"race\": \"white\", \"sex\":\"F\", \"agegroup\": \"30 to 40\"," + 
    	//			  "\"compare\": false," + "\"api_key\": \"Xlu19QS9DBy29a7gj8DN0tTSKmfRmTv3ewDV1yD6\", \"id\": 0}";
        
        //if agerang
        var postData = {
            year: "2014",
            state: state,
            agerange: "25-30",
            compare: compare,
            race: race,
            api_key: MIDAAS_API_KEY
        }
        console.log(postData);
        postData = querystring.stringify(postData)
        console.log(MIDAAS_quantile+postData);
        request.get(
            {
                url: MIDAAS_quantile + postData,
                body: postData,
                json: true,
                headers: { "Content-Type": "application/json" }
            },
            function(err, response, body) {
            
                if (err) {
                    console.log(err)
                    //response.status(400).send(error);
                } else {
                    console.log(body);
                    next(err, body);
                }
            }
        );
    }
    Economics.getDist = function(gender, state, age, compare, race, next){ //parameters, next){
        //var postData = "{\"year\": \"2015\", \"state\": \"CA\", \"race\": \"white\", \"sex\":\"F\", \"agegroup\": \"30 to 40\"," + 
    	//			  "\"compare\": false," + "\"api_key\": \"Xlu19QS9DBy29a7gj8DN0tTSKmfRmTv3ewDV1yD6\", \"id\": 0}";
        var postData = {
            year: "2014",
            state: state,
            agerange: "25-30",
            compare: compare,
            race: race,
            api_key: MIDAAS_API_KEY
        }
        console.log(postData);
        postData = querystring.stringify(postData)
        console.log(MIDAAS_distribution+postData);
        request.get(
            {
                url: MIDAAS_distribution + postData,
                body: postData,
                json: true,
                headers: { "Content-Type": "application/json" }
            },
            function(err, response, body) {
            
                if (err) {
                    console.log(err)
                    //response.status(400).send(error);
                } else {
                    console.log(body);
                    next(err, body);
                }
            }
        );
    }
    
    Economics.remoteMethod(
        'getQuantile', 
        {
          http: {path: '/getQuantile', verb: 'Post'},
          accepts: [{arg: 'gender', type: 'string'}, {arg: 'state', type: 'string'}, {arg: 'age', type: 'string'}, {arg: 'compare', type: 'string'}, {arg: 'race', type: 'string'}],
          returns: {arg: 'MIDAAS DATA:', type: 'string'}
        }
    );
    Economics.remoteMethod(
        'getDist', 
        {
          http: {path: '/getDist', verb: 'Post'},
          accepts: [{arg: 'gender', type: 'string'}, {arg: 'state', type: 'string'}, {arg: 'age', type: 'string'}, {arg: 'compare', type: 'string'}, {arg: 'race', type: 'string'}],
          returns: {arg: 'MIDAAS DATA:', type: 'string'}
        }
    );
};

