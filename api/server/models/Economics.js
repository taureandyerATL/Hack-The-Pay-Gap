var MIDAAS_quantile = "https://api.commerce.gov/midaas/quantiles?";
var MIDAAS_distribution = "https://api.commerce.gov/midaas/distribution?";
var querystring= require('querystring');
var _ = require('lodash');
var request = require("request");
var math = require('mathjs');
/**MIDAAS API KEY**/
var MIDAAS_API_KEY = "<<you have to get your own key!>>";


module.exports = function(Economics) {
    //Taurean you'll have to change hte vars to represent their true names;
    function linearInterpolation( perLower,  perUpper,  salLower, salUpper, salary) {
        console.log(perLower,  perUpper,  salLower, salUpper, salary);
        var pec = (((salary-salLower)*(perUpper - perLower))/(salUpper-salLower))+perLower;
        return(pec);
    }
    
    /*Economics.getPercentile= function(wage, gender, intProf, extProf, state, job, stats, application, next){
        /***first get percentiles to compare***
        //get age group for proficiency
        var agegroup
        if (extProf == "Expert" || intProf == "advanced" || intProf == "expert"){
            agegroup= "45-54"; //seasoned talent
        }else if (extProf == "Intermediate" || intProf == "proficient" || intProf == "novice"){
            agegroup= "35-44"; //just starting job
        }else{
            agegroup= "25-34"; //just starting workforce
        }
        var sex = "male";
        var race = "white";
        var salary = wage * 2080;
        var percentile = 0;
        
        /////GET MIDAAS DATA/////////
         var postData = {
            //year: "2014",
            //state: state,
            //compare: compare,
            //race: "white",
            //sex: "male",
            agegroup: agegroup,
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
            function(err, response, midaasData) {
            
                if (err) {
                    console.log(err)
                    //response.status(400).send(error);
                } else {
                    console.log("Body: " + JSON.stringify(midaasData));
                    //console.log(midaasData);
                    var data={};
                    var priorData = {
                        percentile: 0,
                        salary: 0
                    }
                    for (var key in midaasData.overall) {
                      if (midaasData.overall.hasOwnProperty(key)) {
                        data.salary = midaasData.overall[key]
                        data.percentile = key
                        if(data.salary >= salary){
                            console.log("SALARY: " + salary + ", Upper Percentile " + data.percentile + " with Salary " + data.salary + 'Lower Percentile ' + priorData.percentile + " with Salary " + priorData.salary)
                            percentile = linearInterpolation(parseInt(priorData.percentile), parseInt(data.percentile), parseInt(priorData.salary), parseInt(data.salary), salary);
                            console.log("Applicant Percentile: "+ percentile)
                            Economics.app.models.ProjectApplication.findOne({where: {"id": application}}, function(err, projectApp){
                                if(err){
                                    console.log("no application found");
                                }else{
                                    console.log("original app:");
                                    console.log(projectApp);
                                    projectApp.percentile = percentile;
                                    Economics.app.models.ProjectApplication.upsert(projectApp, function(err, updated){
                                        if(err){
                                            console.log("bad update: ");
                                            console.log(err);
                                        }
                                        console.log("updated app");
                                        console.log(updated);
                                        Economics.app.models.JobStats.newApplicant(percentile, updated.jobId, gender);
                                        /*
                                        Economics.app.models.JobStats.findOne({where: {"sourceJobId": updated.jobId}}, function(err, stats){
                                            if(err){
                                                console.log("Error finding JobStats: ");
                                                console.log(err);
                                            }else{
                                                //use gender to determine stats
                                                if(gender == "male"){
                                                    if(percentile < stats.maleMin){
                                                        stats.maleMin = percentile;
                                                    }
                                                    if(percentile > stats.maleMax){
                                                        stats.maleMax = percentile;
                                                    }
                                                    stats.maleAve = ((stats.maleAve*stats.maleCount)+percentile)/(stats.maleCount+1) //new average
                                                    stats.maleCount += 1
                                                    stats.applicantCount += 1
                                                }else if(gender == "female"){
                                                    if(percentile < stats.femaleMin){
                                                        stats.femaleMin = percentile;
                                                    }
                                                    if(percentile > stats.femaleMax){
                                                        stats.femaleMax = percentile;
                                                    }
                                                    stats.femaleAve = ((stats.femaleAve*stats.femaleCount)+percentile)/(stats.femaleCount+1) //new average
                                                    stats.femaleCount += 1
                                                    stats.applicantCount += 1
                                                }else{
                                                    console.log("no gender, no updates");
                                                }
                                                Economics.app.models.JobStats.upsert(stats, function(err, updatedStats){
                                                    if(err){
                                                        console.log("bad update of JobStats: ");
                                                        console.log(err)
                                                    }else{
                                                        console.log("updated app");
                                                        console.log(updatedStats);
                                                    }
                                                });
                                            }
                                        });*
                                        if(next){
                                            next(undefined, updated);
                                            return;
                                        }else{
                                            return;
                                        }
                                    })
                                }
                            })
                            break;
                        }else{
                            console.log(key + " -> " + midaasData.overall[key]);
                            priorData.percentile = data.percentile;
                            priorData.salary = data.salary;
                            
                        }
                      }
                    }
                    //next(err, midaasData);
                    return;
                }
            }
        );
    };*/
    
    Economics.getPercentile= function(wage, gender, intProf, extProf, state, job, stats, application, next){
        /***first get percentiles to compare***/
        //get age group for proficiency
        var midaasData ={}
        if (extProf == "Expert" || intProf == "advanced" || intProf == "expert"){
            midaasData = {
                "overall": {        
                    "5%": 2500,
                    "10%": 8000,
                    "20%": 15900,
                    "30%": 24000,
                    "40%": 32000,
                    "50%": 40500,
                    "60%": 52000,
                    "70%": 69000,
                    "80%": 89000,
                    "90%": 125000,
                    "95%": 173000,
                    "99%": 455000
                }
            }
 //seasoned talent
        }else if (extProf == "Intermediate" || intProf == "proficient" || intProf == "novice"){
            midaasData = {
                "overall": {
                    "5%": 3500,
                    "10%": 9600,
                    "20%": 18000,
                    "30%": 25000,
                    "40%": 32000,
                    "50%": 40000,
                    "60%": 50000,
                    "70%": 61000,
                    "80%": 80000,
                    "90%": 110000,
                    "95%": 150000,
                    "99%": 393000
                }
            }//just starting job
        }else{
            midaasData = {
                "overall": {        
                    "5%": 800,
                    "10%": 5000,
                    "20%": 12000,
                    "30%": 17000,
                    "40%": 22200,
                    "50%": 29000,
                    "60%": 35000,
                    "70%": 45000,
                    "80%": 56000,
                    "90%": 80000,
                    "95%": 100000,
                    "99%": 166600
                }
            }; //just starting workforce
        }
        
        var salary = wage * 2080;
        var percentile = 0;
        
        var data={};
        var priorData = {
            percentile: 0,
            salary: 0
        }
        for (var key in midaasData.overall) {
          if (midaasData.overall.hasOwnProperty(key)) {
            data.salary = midaasData.overall[key]
            data.percentile = key
            if(data.salary >= salary){
                console.log("SALARY: " + salary + ", Upper Percentile " + data.percentile + " with Salary " + data.salary + 'Lower Percentile ' + priorData.percentile + " with Salary " + priorData.salary)
                percentile = linearInterpolation(parseInt(priorData.percentile), parseInt(data.percentile), parseInt(priorData.salary), parseInt(data.salary), salary);
                console.log("Applicant Percentile: "+ percentile)
                Economics.app.models.ProjectApplication.findOne({where: {"id": application}}, function(err, projectApp){
                    if(err){
                        console.log("no application found");
                    }else{
                        console.log("original app:");
                        //console.log(projectApp);
                        projectApp.percentile = percentile;
                        Economics.app.models.ProjectApplication.upsert(projectApp, function(err, updated){
                            if(err){
                                console.log("bad update: ");
                                console.log(err);
                            }else{
                                console.log("updated app");
                                //console.log(updated);
                                Economics.app.models.JobStats.newApplicant(percentile, updated.jobId, gender, function(err, stats){
                                    if(err){
                                        console.log("bad stats update: ");
                                        console.log(err);
                                    }else{
                                        console.log("updated stats");
                                        console.log(stats);
                                        return next(null, updated);
                                    }
                                });
                            }
                        })
                    }
                })
                break;
            }else{
                console.log(key + " -> " + midaasData.overall[key]);
                priorData.percentile = data.percentile;
                priorData.salary = data.salary;
                
            }
          }
        }
        //next(err, midaasData);
        return;
    };
    
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
        var states = ["AL", "AK", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
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
    
    Economics.getQuantile = function(gender, state, age, agegroup, compare, race, next){ //parameters, next){
        //var postData = "{\"year\": \"2015\", \"state\": \"CA\", \"race\": \"white\", \"sex\":\"F\", \"agegroup\": \"30 to 40\"," + 
    	//			  "\"compare\": false," + "\"api_key\": \"Xlu19QS9DBy29a7gj8DN0tTSKmfRmTv3ewDV1yD6\", \"id\": 0}";
        var postData = {
            year: "2014",
            state: state,
            //compare: compare,
            race: race,
            api_key: MIDAAS_API_KEY
        }
        //"18-24", "25-34", "35-44", "45-54", "55-64", "65+"
        if (age >= 45 || age <= 54){
            postData.agegroup= "45-54";
        }else if (age >= 35 || age <= 44){
            postData.agegroup= "30-44";
        }else if (age >= 25 || age <= 34){
            postData.agegroup= "25-34";
        }else if (age >= 18 || age <= 24){
            postData.agegroup= "18-24";
        }
        
        /*if (age >= 45 || age <= 54){
            postData.agegroup= "45-54";
        }else if (age >= 35 || age <= 44){
            postData.agegroup= "30-44";
        }else if(!age){
            postData.agegroup= null;
        }else{
            postData.agegroup= "25-34";
        }*/
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
          accepts: [{arg: 'gender', type: 'string'}, {arg: 'state', type: 'string'}, {arg: 'age', type: 'string'}, {arg: 'agegroup', type: 'string'}, {arg: 'compare', type: 'string'}, {arg: 'race', type: 'string'}],
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
    Economics.remoteMethod(
        'getPercentile', 
        {
          http: {path: '/getPercentile', verb: 'Post'},
          accepts: [{arg: 'wage', type: 'number'}, {arg: 'gender', type: 'string'}, {arg: 'intProf', type: 'string'}, {arg: 'extProf', type: 'string'},{arg: 'state', type: 'string'}, {arg: 'job', type: 'string'}, {arg: 'stats', type: 'string'}, {arg: 'application', type: 'string'}],
          returns: {arg: 'percentile', type: 'string'}
        }
    );
};
