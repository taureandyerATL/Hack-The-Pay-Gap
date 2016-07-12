var request = require('request');
var app = module.parent.exports.app;

app.post('/project/jobdata', function (req, res, next) {
  console.log("inside project job data:::::")
  insertjobfulldata(req, res, function(response){
     return res.json(200, response);
  });
});

module.exports = {

/*
1. Upload drafts
2. upload jobs
3. upload candidates
4. randomly upload workers (not all, just some)

*/

insertjobfulldata: function( req, res, callback){  
  console.log("inside insertjobfulldata:::" + req);
  console.log("jobCategory" + req.body.jobCategory);
  console.log("applicants" + req.body.applicants.length);
  
 // var draftid;
 // if(req.body.drafts.length > 0)
  // var draftid = req.body.drafts[0].draftId;

    //form the request data for new job    
    var jsonNewJob= {
                   "jobCategory": req.body.jobCategory, //Must be the same for all jobs with the JobId
                    "jobProject": req.body.jobProject, //Must be the same for all jobs with the JobId
                    "jobDescription": req.body.jobDescription, //must match 
                    "markets": "upwork",
                    "jobId": req.body.jobId, //this internal job ID can be anything for HTPG ONLY testing
                    "userId": "XYZ", //This can be anything
                    "skills": req.body.skills, //You can keep this static if you want
                    "roleName": req.body.roleName, //This can be anything, but must be the same for all applicants for this job and jobId
                    "externalProficiency": req.body.externalProficiency,
                    "internalProficiency": req.body.internalProficiency,
                    "draftId": req.body.drafts[0].draftId//must match drafts from textio
                 };
                 console.log(jsonNewJob);

    request({
        url: 'https://atl-htpg-taureandyeratl.c9users.io:8081/api/Jobs/newJob', //URL to hit        
        method: 'POST',        
        json: jsonNewJob,
        headers: {
          "content-type": "application/json",
        },  
      }, function(error, response, body){
             
        if(error) {
            console.log(error);
        } 
        else 
        {
          console.log("new job added successfully::");
        
        //insert drafts for the job
      if(req.body.drafts!=null)
      {
        for(var i = 0;i < req.body.drafts.length; i++)
                {
          console.log("Inserting draft for Job::::" +  req.body.userName);
          var jsondraft = 
                          {
                    "jobDescription": req.body.drafts[i].jobDescription,
                                "marketSource": req.body.drafts[i].marketSource,
                                "jobCategory": req.body.jobCategory,
                                "roleName": req.body.roleName,
                                "draftId": req.body.drafts[i].draftId, //must remain static to the job, as it will be used to get the jobId associated with the drafts
                                "userId": "XYZ",
                                "userName": req.body.userName,
                                "draftSource": req.body.drafts[i].draftSource,
                                "jobId": req.body.jobId
                };

          request({
              url: 'https://atl-htpg-taureandyeratl.c9users.io:8081/api/DraftChecks/checkDraft', //URL to hit        
              method: 'POST',        
              json: jsondraft,
              headers: {
              "content-type": "application/json",
              },  
            }, function(error, response, body){
                 
              if(error) {
                console.log("ERROR WHILE  INSERTING DRAFT ::::" + error);
              } 
              else 
              {

              console.log("Draft inserted.");
              }
            });
        }

      }
        
              //insert the aapplicants
              if(req.body.applicants != null)
              {
                for(var i = 0;i < req.body.applicants.length; i++)
                {
                  //form the request data for new applicants
                  var jsonNewApplicant = {
                    "name": req.body.applicants[i].name, //can be anything but please try to be gender specific
                    "picURL":req.body.applicants[i].picURL, //pick a picture that matches the gender
                    "source": req.body.applicants[i].source, //static
                    "sourceId": req.body.applicants[i].sourceId, //can be anything
                    "userId": req.body.applicants[i].userId, //can be anything but once create the history of the user is tied to that userId
                    "laborMarket": req.body.applicants[i].laborMarket, //just use upwork for now
                    "city": req.body.applicants[i].city, //pick a city
                    "country": req.body.applicants[i].country, //Static value.  Please do not change 
                    "jobId": req.body.jobId, //should match job                   
                     "jobCategory": req.body.jobCategory, //must match job
                    "jobCategoryGroup": req.body.jobCategoryGroup, //must match job
                    "wageRequested": req.body.applicants[i].wageRequested, //hourly wage number, can change
                    "timezone": req.body.applicants[i].timezone, //can be anything for nowu
                  };
                  console.log("print val i:::"+ i);
                  var count = i;

                  request({
                          url: 'https://atl-htpg-taureandyeratl.c9users.io:8081/api/BaseApplicants/genderize', //URL to hit        
                          method: 'POST',        
                          json: jsonNewApplicant,
                          headers: {
                            "content-type": "application/json",
                          },  
                          }, function(error, response, body){
                               
                          if(error) {
                              console.log(error);
                          } 
                          else 
                          {
                            console.log("print again:::"+ count);
                            console.log("Applicant added. Name::::" +  req.body.applicants[count].name);
                            //insert job applicant mapping
                            //form new request data form job to applicant mapping
                            var jsonJobapplicant = {
                              "progress": req.body.applicants[count].progress, //progress will be either dropped, shortlisted, offered, or hired. Applied will be au static value because there is an application
                              "userId": req.body.applicants[count].userId, //Must match a user that applied for a job/jobId
                              "jobId": req.body.jobId //must match JobId applicant is applying for

                              };

                              request({
                                      url: 'https://atl-htpg-taureandyeratl.c9users.io:8081/api/BaseApplicant/updateProgress', //URL to hit        
                                      method: 'POST',        
                                      json: jsonJobapplicant,
                                      headers: {
                                        "content-type": "application/json",
                                      },  
                                    }, function(error, response, body){
                                           
                                      if(error) {
                                          console.log("job applicant mapping error::::" + error);
                                      } 
                                      else 
                                      {
                                            console.log("job applicant mapped successfully");
                                      }
                                    }); 


                          }
                        });
                }
              }
        }
      
    });
   
   res.send("Success");
            
 }
}

/*
{ 
  "jobCategory": "Web & Mobile Design",
  "jobCategoryGroup": "Web Development",
  "jobProject": "Aman’s cool stuff",
  "jobDescription": "Cool job for Aman’s project",
  "jobId": "5780820cac9d85d8c08922a8",
  "skills": "javascript,node.js,angularjs",
  "externalProficiency": "expert",
  "internalProficiency": "Intermediate",
  "roleName":"java developer",
  "userName": "test",

  "drafts":[
    {
      "jobDescription": "Sixth Ave Studios is headquartered in downtown Tacoma, WA. In the last 3 years we had the opportunity to work with notable clients such as Cartier, Gap, Levis, Mazda, Mercedes, Microsoft and Oreo. Our focus is primarily modern web software and enterprise level applications",
      "marketSource": ["dtb","upwork"],
      "draftId": "ycKMwxz",
      
      "draftSource": "CTSP"
    },
  
    {
      "jobDescription": "Sixth Ave Studios is headquartered in downtown Tacoma, WA. In the last 3 years we had the opportunity to work with notable clients such as Cartier, Gap, Levis, Mazda, Mercedes, Microsoft and Oreo.",
      "marketSource": ["dtb","upwork"],
      "draftId": "ycKMwxz",
      
      "draftSource": "CTSP"
    }
  ],

"applicants":[{
    "name": "Shahsi",
    "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
    "source": "CTSP",
    "sourceId": "test",
    "userId": "~01a504f664f35894de",
    "laborMarket": "Upwork",
    "city": "San Jose",
    "country": "US",
    "wageRequested": 30,
    "timezone": "GMT+05:30",
    "progress":"Applied"
  },
  {
    "name": "Tyra",
    "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
    "source": "CTSP",
    "sourceId": "test",
    "userId": "~01a504f664f35894df",
    "laborMarket": "Upwork",
    "city": "San Jose",
    "country": "US",
    "wageRequested": 30,
    "timezone": "GMT+05:30",
    "progress":"Applied"
  }];
}*/


var jobs= [{ 
    "jobCategory": "Web & Mobile Design",
    "jobCategoryGroup": "Web Development",
    "jobProject": "Cool job for Aman’s project",
    "jobDescription": "Sixth Ave Studios is headquartered in downtown Tacoma, WA. In the last 3 years we had the opportunity to work with notable clients such as Cartier, Gap, Levis, Mazda, Mercedes, Microsoft and Oreo. Our focus is primarily modern web software and enterprise level applications.\nJob Description\nThe Web Developer is an experienced developer that uses JavaScript , HTML, and CSS to build dynamic, responsive web applications. Our developers are deep problem solvers.\nResponsibilities\n\t• Produce and maintain enterprise quality Javascript applications utilizing industry standard patterns and best practices using MV* (MVVM, MVC) client side architecture.\n\t• Implement designs and prototypes using modern HTML and CSS\n\t• Use modern JavaScript based build tools (NodeJS, Gulp, etc.)\n\t• Collaborate with Designers and Information Architects to identify development constraints\n\t• Participate in agile development process\n\t• Participate in design and code reviews\n",
    "jobId": "job1",
    "skills": "javascript,node.js,angularjs",
    "externalProficiency": "expert",
    "internalProficiency": "Intermediate",
    "roleName":"java developer",
    "userName": "poster1",
    "draftId":"ycKMwxz"
  },
  { 
    "jobCategory": "Web & Mobile Design",
    "jobCategoryGroup": "Web Development",
    "jobProject": "Chris's Code Work Project",
    "jobDescription": "Sixth Ave Studios is headquartered in downtown Tacoma, WA. In the last 3 years we had the opportunity to work with notable clients such as Cartier, Gap, Levis, Mazda, Mercedes, Microsoft and Oreo. Our focus is primarily modern web software and enterprise level applications.\nJob Description\nThe Web Developer is an experienced developer that uses JavaScript , HTML, and CSS to build dynamic, responsive web applications. Our developers are deep problem solvers.\nResponsibilities\n\t• Produce and maintain enterprise quality Javascript applications utilizing industry standard patterns and best practices using MV* (MVVM, MVC) client side architecture.\n\t• Implement designs and prototypes using modern HTML and CSS\n\t• Use modern JavaScript based build tools (NodeJS, Gulp, etc.)\n\t• Collaborate with Designers and Information Architects to identify development constraints\n\t• Participate in agile development process\n\t• Participate in design and code reviews\n",
    "jobId": "job2",
    "skills": "javascript,node.js,angularjs",
    "externalProficiency": "expert",
    "internalProficiency": "advanced",
    "roleName":"java developer",
    "userName": "poster1",
    "draftId":"ycKMwxz"
  },
  
];

var drafts= [
  {"job1":[
      {
        "jobDescription": "Sixth Ave Studios is headquartered in downtown Tacoma, WA. In the last 3 years we had the opportunity to work with notable clients such as Cartier, Gap, Levis, Mazda, Mercedes, Microsoft and Oreo. Our focus is primarily modern web software and enterprise level applications",
        "marketSource": ["dtb","upwork"],
        "draftId": "ycKMwxz",
        
        "draftSource": "CTSP"
      },
      {
        "jobDescription": "Sixth Ave Studios is headquartered in downtown Tacoma, WA. In the last 3 years we had the opportunity to work with notable clients such as Cartier, Gap, Levis, Mazda, Mercedes, Microsoft and Oreo.",
        "marketSource": ["dtb","upwork"],
        "draftId": "ycKMwxz",
        
        "draftSource": "CTSP"
      }
    ]}
  ];

var applicants= [
  {
      "name": "Shahsi",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker1",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 15,
      "timezone": "GMT+05:30",
      "progress":"Applied"
    },
    {
      "name": "Tyra",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker2",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 35,
      "timezone": "GMT+05:30",
      "progress":"Applied"
    },
    {
      "name": "Vertika Srivastava",
      "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker3",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 25,
      "timezone": "GMT+05:30",
      "progress":"Applied"
    }
  ];
