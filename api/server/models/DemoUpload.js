'use strict';
var request = require('request');
var random = require('random-seed').create();
var Q = require('q');

module.exports = function(DemoUpload) {

/*
1. Upload drafts
2. upload jobs
3. randomly upload candidates
4. randomly upload application updates (not all, just some)
*/
/*function draftsUpload(next){
    drafts.forEach(function(job){
      console.log(job);
      
      function asyncFunction (item, cb) {
        setTimeout(() => {
          console.log('done with', item);
          cb();
        }, 100000);
      }
      
      let draftjobUpload = job.reduce((promiseChain, draft) => {
          return promiseChain.then(() => new Promise((resolve) => {
            asyncFunction(draft, resolve);
          }));
      }, Promise.resolve());
      
      draftjobUpload.then(() => console.log('done'))
    });
}*/

  DemoUpload.upload= function(next){
    //Kick of upload of file in in order (maybe using async?)
    var bodies = []
    var errors = []
    draftsUpload(bodies, errors, next);
    next(errors, bodies);
    return;
  }
  function draftsUpload(bodies, errors, next){
    var bodies = []
    var errors = []
    drafts.forEach(function(job){
      console.log(job);
      /*return Q.spread(job, function (a, b) {
        return a + b;
    }).then*/
    
      job.forEach(function(draft){
        console.log("made it here")
        console.log(draft);

        request({
              url: 'https://atl-htpg-taureandyeratl.c9users.io:8081/api/DraftChecks/checkDraft', //URL to hit        
              method: 'POST',        
              json: draft,
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
      });
      return(errors, bodies);
    });
    //console.log(next);
    return;
  }
  function jobsUpload(next){
    jobs.forEach(function(job){
      request({
              url: 'https://atl-htpg-taureandyeratl.c9users.io:8081/api/Jobs/newJob', //URL to hit        
              method: 'POST',        
              json: job,
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
    })
  }

DemoUpload.remoteMethod(
        'upload', {
            http: {
                path: '/upload',
                verb: 'Get'
            },
            returns: {
              arg: 'Done', 
              type: 'string'
            }
        }
    );
}

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
  [
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
    ]
  ];
//add 10 min & women
// worker id's 1-20
//Worker starts at Hired, offered & not hired (random)
function generateApplicantStatus(){
  var status = ['Applied','Hired','Offered','Not-Hired'];
  return status[random(status.length)];
}

var applicants= [
  {
      "name": "Shahsi Jain",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker1",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 15,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Jarrett Jack",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker2",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 35,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Michael Johnson",
      "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker3",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 25,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
      {
      "name": "Kendal Jackson",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker4",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 15,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Kareen Johnson",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker5",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 35,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Carry Nachenburg",
      "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker6",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 25,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
      {
      "name": "Kumar Sheik",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker7",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 15,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Eyun Kyu",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker8",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 35,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "James Jones",
      "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker9",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 25,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
      {
      "name": "Henryk Gurskzy",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker10",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 15,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Tyra Banks",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker11",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 35,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Vertika Srivastava",
      "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker12",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 25,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
      {
      "name": "Shahsi Kapur",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker13",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 15,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Christina Milan",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker14",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 35,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Leyla Rose",
      "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker15",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 25,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
      {
      "name": "Anna Rozaro",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker16",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 15,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Madyline Rose",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker17",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 35,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Sophia Gats",
      "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker18",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 25,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
  {
      "name": "Olivia Beckett",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker19",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 15,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
    {
      "name": "Jamie Campbell",
      "picURL": "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg",
      "source": "CTSP",
      "sourceId": "test",
      "userId": "worker20",
      "laborMarket": "Upwork",
      "city": "San Jose",
      "country": "US",
      "wageRequested": 35,
      "timezone": "GMT+05:30",
      "progress":"applied"
    },
  ];
var progress= [
  {
    "hired": [
      {
        "progress": "shortlisted"
    },
    {
      "progress": "offered"
    },
    {
      "progress": "hired"
    }]
  },
  {"offered": [
    {
      "progress": "shortlisted"
    },
    {
      "progress": "offered"
    },
    {
      "progress": "dropped"
    }]
  },
  {
    "shortlisted":[
      {
        "progress": "shortlisted"
      },
      {
        "progress": "dropped"
      }
    ]
  },
  {
    "applied": [
      {
        "progress": "dropped"
      }
    ],
  }
]
