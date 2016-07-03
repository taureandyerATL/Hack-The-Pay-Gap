var MIDAAS_quantile = "https://api.commerce.gov/midaas/quantiles?";
var MIDAAS_distribution = "https://api.commerce.gov/midaas/distribution?";
var querystring= require('querystring');
var request = require("request");
/**MIDAAS API KEY**/
var MIDAAS_API_KEY = "Xlu19QS9DBy29a7gj8DN0tTSKmfRmTv3ewDV1yD6";


module.exports = function(Economics) {

    Economics.getMIDAAS = function(gender, state, agerange, compare, next){ //parameters, next){
        //var postData = "{\"year\": \"2015\", \"state\": \"CA\", \"race\": \"white\", \"sex\":\"F\", \"agegroup\": \"30 to 40\"," + 
    	//			  "\"compare\": false," + "\"api_key\": \"Xlu19QS9DBy29a7gj8DN0tTSKmfRmTv3ewDV1yD6\", \"id\": 0}";
        var postData = {
            year: "2014",
            state: "CA",
            agerange: "25-30",
            compare: "sex",
            api_key: MIDAAS_API_KEY
        }
        var postData = {
            year: "2014",
            state: state,
            agerange: "25-30",
            compare: compare,
            api_key: MIDAAS_API_KEY
        }
        /*var async = true;
        
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        
        var request = new XMLHttpRequest();
        
        request.onload = function (err, data){
            
            if(err){console.log(err);}
            else{
               var status = request.status; 
               var data = request.responseText;
               
               console.log('Response <' +data);
            }
            return(err, data);
        };
        
        console.log('before open');
        request.open(method, url, async);
        console.log('after open');
        
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        
        console.log('Data to be posted<' + postData);
        request.send(postData);
        console.log('after post data');*/
        console.log(postData);
        postData = querystring.stringify(postData)
        console.log(url+postData);
        request.get(
            {
                url: url + postData,
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
            });
    }
    
    Economics.remoteMethod(
        'getMIDAAS', 
        {
          http: {path: '/getMIDAAS', verb: 'Post'},
          accepts: [{arg: 'gender', type: 'string'}, {arg: 'state', type: 'string'}, {arg: 'agerange', type: 'string'}, {arg: 'compare', type: 'string'}],
          returns: {arg: 'MIDAAS DATA:', type: 'string'}
        }
    );
};

