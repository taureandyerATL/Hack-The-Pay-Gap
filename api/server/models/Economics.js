var MIDAAS_quantile = "https://api.commerce.gov/midaas/quantiles?";
var MIDAAS_distribution = "https://api.commerce.gov/midaas/distribution?";
var querystring= require('querystring');
var _ = require('lodash');
var request = require("request");
var math = require('mathjs');
/**MIDAAS API KEY**/
var MIDAAS_API_KEY = "Xlu19QS9DBy29a7gj8DN0tTSKmfRmTv3ewDV1yD6";


module.exports = function(Economics) {
    /*var numberOfCalls = 0;
    var numberOfUserRateLimitError = 0;
    var numberOfRequestPerFolder = {};
    
    
    var apiResponseHandler = (err, response, sucessCallback, errorCallback, subsequentCallBack) => {
        var milliSecondsInASecond = 1000;
        var randomTimeInMs = math.randomInt(milliSecondsInASecond);
        var baseTimeInMs = 0;
    
        if (err) {
            console.log(err, ' error returened ');
            if (err.code === 403 && err.errors[0].reason === "userRateLimitExceeded") {
                if (baseTimeInMs === 17) {
                    // console.log('#########################################');
                    errorCallback(err);
                }
                numberOfUserRateLimitError++;
                console.log(' Kicking off the setTimeout ');
                setTimeout(subsequentCallBack, (++baseTimeInMs * milliSecondsInASecond) + randomTimeInMs, sucessCallback, errorCallback)
                return;
            }
            errorCallback(err);
        }
    
        // promise is resolved here
        sucessCallback(response);
    }

    var getQuantiles = (fileId) => {
        //----------HARD CODED STUFF HERE -----------
        var gender = {male:'male',female:'female'};
        var states = ["AL", "AK", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
        var age = '25-30';
        var jobCategory = 'Computer Scientist';
        var wage = 20.00;//$ per hour
        var standardWorkHours = 2080;//There's 2080 work hours in a calendar year
        
        var annualSalary = wage * standardWorkHours;
        var industryAvg = 0;
        //-------------------
    
        var serviceGetFiles = (successCallback, errorCallback) => {
            numberOfCalls++;
            if (!numberOfRequestPerFolder[fileId])
                numberOfRequestPerFolder[fileId] = 0;
    
            numberOfRequestPerFolder[fileId]++;
    
            service.files.get({
                auth: oauth2Client,
                fileId: fileId.trim(),
                orderBy: 'modifiedDate'
            }, (err, response) => {
                log.info('Get Files Response recd');
                apiResponseHandler(err, response, successCallback, errorCallback, serviceGetFiles);
            });
    
        };
    
        return new Promise((resolve, reject) => {
            serviceGetFiles(resolve, reject);
        });
    };*/
    
    Economics.getStatistics = function(age, wage, next){
        var genders = {male:'male', female:'female'};      
        var standardWorkHours = 2080;//There's 2080 work hours in a calendar year
        var annualSalary = wage * standardWorkHours;
        
        var output = {
            wage:wage,
            salary:annualSalary,
            data:{
                male:[],
                female:[]
            }
        };
        
        Economics.getStatisticsByGender(age, genders.male, wage,function(response1){
            output.data.male.push(response1.data);
            Economics.getStatisticsByGender(age, genders.female, wage,function(response2){
                output.data.female.push(response2.data);
                next(null, output);
            });
        });
    };
    
    Economics.getStatisticsByGender = function(age, gender, wage, next){
        //----------HARD CODED STUFF HERE -----------
        var states = ["AL", "AK"];//, "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
        //var age = '25-30';
        //var wage = 20.00;//$ per hour
        var standardWorkHours = 2080;//There's 2080 work hours in a calendar year
        var race = 'white';
        var annualSalary = wage * standardWorkHours;
        var apiInvokeDelay = 1000;
        //-------------------
        
        var output = {
            gender:gender,
            wage:wage,
            salary:annualSalary,
            compare:[]
        };
        
        //console.log("Input --\n"+ gender.male + " (Hard coded) " + " Age: " + age + " hourly wage: " + wage + " Annual Salary: " + annualSalary + "\n\n");
        
            states.forEach(function(state ,index){
                setTimeout(function(){
                    var options = {
                       method:"POST",
                       headers: {
                          'Accept': 'application/json',
                          'Content-Type' : 'application/x-www-form-urlencoded'
                        },
                       url: 'https://atl-htpg-taureandyeratl.c9users.io:8081/api/Economics/getQuantile',
                       form:{
                          gender:gender,
                          state:state,
                          age:age,
                          race:race
                       }
                    };
        
                    request(options, function callback(error, response, midaasData) {
                        if(error){
                            console.log("quantile() Error: " + JSON.stringify(error));
                            next(error);
                            return;
                        }
                                
                        if(response.statusCode !== 200){
                            
                            next(error);
                            console.log("quantile() response code: "+ response.statusCode + " Body: " + JSON.stringify(midaasData));
                            return;
                        }
                        
                        //Taureen you'll have to change hte vars to represent their true names;
                        function linearInterpolation( a,  b,  f) { 
                            return (a * (1.0 - f)) + (b * f);
                            
                        }
                        
                        _.map(JSON.parse(midaasData), function(overall){
                            _.map(overall, function(overallObject){
                                var data={state:state};
                                var priorData = {
                                    percentile: 0,
                                    salary: 0
                                };//stores the previous quantile data
                                _.map(overallObject, function(val, key){
                                        
                                        //NOTE: Taureen: Do linear Interpolation Here. 
                                     if(data.salary === undefined){
                                         
                                        data.percentile = linearInterpolation(Number(key.substring(0, key.length-1), priorData.percentile, 1));
                                        data.salary = linearInterpolation(Number(val), priorData.salary, 1);
                                        priorData = data;
                                    }else if( annualSalary >= val){
                                        data.salary = linearInterpolation(Number(val), priorData.percentile, 1);
                                        data.percentile = linearInterpolation(Number(key.substring(0, key.length-1)), priorData.percentile, 1);
                                        priorData = data;
                                    }
                                });
                                output.compare.push(data);
                            });
                            
                            //console.log(JSON.stringify(output));
                          if(index === states.length - 1){
                              next(null,output);
                              return;
                          }
                        });
                    });
                }, apiInvokeDelay);
            });
    };
    
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
        'getStatistics',{
        http: {path: '/getStatistics', verb: 'GET'},
          accepts: [ {arg: 'age', type: 'string'}, {arg: 'wage', type: 'number'}],
          returns: {arg: 'MIDAAS DATA:', type: 'string'}
        }
    );
    
    Economics.remoteMethod(
        'getStatisticsByGender',{
        http: {path: '/getStatisticsByGender', verb: 'GET'},
          accepts: [ {arg: 'age', type: 'string'}, {arg: 'gender', type: 'string'}, {arg: 'wage', type: 'number'}],
          returns: {arg: 'MIDAAS DATA:', type: 'string'}
        }
    );
    
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

