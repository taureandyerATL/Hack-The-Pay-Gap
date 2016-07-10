var GlassDoor_jobsStats = "http://api.glassdoor.com/api/api.htm?";

var querystring= require('querystring');
var request = require("request");

/**GlassDoor API KEY**/
var GlassDoor_API_KEY = "hrgYyH9DTDG";

/**GlassDoor Partner_ID**/
var GlassDoor_Partner_ID = 76141;

var JSON_FORMAT = "json";
var GLASSDOOR_API_VERSION = 1;

/**
 * Following are the possible job categories in the format of Id	Job Category
1	Accounting / Finance        2	Administrative                  3	Analyst
4	Architecture / Drafting     5	Art / Design / Entertainment    6	Banking / Loan / Insurance
7	Beauty / Wellness           8	Business Development / Consulting   
9	Education                   10	Engineering (Non-software)      11	Facilities / General Labor      
12	Hospitality                 13	Human Resources                 14	Installation / Maintenance / Repair 
15	Legal                       16	Manufacturing / Production / Construction   
17	Marketing / Advertising/PR  18	Medical / Healthcare            19	Non-Profit / Volunteering
20	Product/Project Management  21	Real Estate                     22	Restaurant / Food Services
23	Retail                      24	Sales / Customer Care           25	Science / Research
26	Security / Law Enforcement  27	Senior Management               28	Skilled Trade
29	Software Development / IT   30	Sports / Fitness                31	Travel / Transportation
32	Writing/Editing/Publishing  33	Other
 * */
 //////////////////
 /*window.onload = function () {
     console.log('@ onload');
 }*/
 
 function getIP(json) {
  alert("My public IP address is: " + json.ip);
}

//src="http://api.ipify.org?format=jsonp&callback=getIP"></
function ip()
 {
        var requestData = {
            format : JSON_FORMAT,
            callback : getIP
        }

        console.log(requestData);
        requestData = querystring.stringify(requestData)
        console.log("http://api.ipify.org?" +requestData);
        request.get(
            {
                url: "http:api.ipify.org?" + requestData,
                body: requestData,
                json: true,
                headers: { "Content-Type": "application/json" }
            },
            function(err, response, body) {
            
                if (err) {
                    //console.log(err)
                } else {
                    //console.log(body);
                    //next(err, body);
                }
            });
    }
//////////////////////

module.exports = function(JobsStats) {
    JobsStats.getJobsStats = function(queryPhrase, city, state, jobCategory, next) {
        ip();
        //// GET http://api.glassdoor.com/api/api.htm?t.p=76141&t.k=hrgYyH9DTDG&format=json&v=1&action=employers&q=Accenture
        var requestData = {
            "t.p" : GlassDoor_Partner_ID,
            "t.k" :  GlassDoor_API_KEY,
            format : JSON_FORMAT,
            v: GLASSDOOR_API_VERSION,
            queryPhrase: queryPhrase,
            city: city,
            state: state,
            jobCategory: jobCategory
        }

        console.log(requestData);
        requestData = querystring.stringify(requestData)
        console.log(GlassDoor_jobsStats+requestData);
        request.get(
            {
                url: GlassDoor_jobsStats + requestData,
                body: requestData,
                json: true,
                headers: { "Content-Type": "application/json" }
            },
            function(err, response, body) {
            
                if (err) {
                    //console.log(err)
                } else {
                    //console.log(body);
                    next(err, body);
                }
            });
    }
    
    // GET http://api.glassdoor.com/api/api.htm?t.p=76141&t.k=hrgYyH9DTDG&format=json&v=1&action=employers&q=Accenture
    JobsStats.remoteMethod(
        'getJobsStats', 
        {
          http: {path: '/getJobsStats', verb: 'Get'},
          accepts: [{arg: 'queryPhrase', type: 'string'}, {arg: 'city', type: 'string'}, {arg: 'state', type: 'string'}, {arg: 'jobCategory', type: 'string'}],
          returns: {arg: 'GlassDoor JobsStats DATA:', type: 'string'}
        }
    );
};

