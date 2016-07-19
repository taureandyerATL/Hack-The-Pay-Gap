'use strict';
var request = require('request');
var random = require('random-seed').create();
var async = require('async');
//var baseUrl= 'https://atl-htpg-taureandyeratl.c9users.io:8081/api/'; //URL to hit  
var baseUrl = 'https://atl-htpg-taureandyeratl.c9users.io/api/'; //URL to hit   
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

  DemoUpload.upload = function(cb) {
    //Kick of upload of file in in order (maybe using async?)
    async.series([
      draftsUpload,
      jobsUpload,
      applicantsUpload,
      progressUpload
    ], cb);


  };

  DemoUpload.drafts = function(cb) {
    draftsUpload(cb);
  };
  DemoUpload.jobs = function(cb) {
    jobsUpload(cb);
  };
  DemoUpload.applicants = function(cb) {
    //applicantsUpload(cb);
    oneJob(cb);
  };
  DemoUpload.progress = function(cb) {
    progressUpload(cb);
  };
  var draft = function(draftDesc, draftDone) {
    console.log("Draft");
    console.log(draftDesc);
    request({
      url: baseUrl + 'DraftChecks/checkDraft', //URL to hit        
      method: 'POST',
      json: draftDesc,
      headers: {
        "content-type": "application/json"
      }
    }, function(error, response, body) {
      if (error) {
        console.log("ERROR WHILE  INSERTING DRAFT ::::" + error);
        draftDone(error);
      }
      else {
        console.log("Draft inserted.");
        //console.log(body);
        return draftDone(null);

      }
    });
  };
  var draftJobs = function(job, doneCallback) {
    async.eachSeries(job, draft, function(draftErr) {
      console.log("job done");
      return doneCallback(null);
    });
  };

  function draftsUpload(next) {
    async.eachSeries(drafts, draftJobs, function(err) {
      if (err) {
        next(err);
        return;
      }else{
      console.log("drafts uploaded");
      return next(null);
      }
    });
  }
  var sendJobs = function(job, done) {
    console.log(job);
    request({
      url: baseUrl + 'Jobs/newJob', //URL to hit        
      method: 'POST',
      json: job,
      headers: {
        "content-type": "application/json"
      }
    }, function(error, response, body) {

      if (error) {
        console.log("ERROR WHILE INSERTING JOB ::::" + error);
        return done(error);
      }
      else {
        console.log("Job inserted.");
        console.log(body);
        return done(null);

      }
    });
  };

  function jobsUpload(next) {
    console.log("i'm in jobs upload");
    async.eachSeries(jobs, sendJobs, function(err) {
      if (err) {
        console.log("Error uploading job");
        console.log(err);
        return next(err);
      }
      else {
        console.log("Jobs finished uploading");
        return next(null);
      }

    });
  }

  var applyJob = [];
  var iterateJob = function(job, done) {
    //get randome numbes and applications
    var numApplications = getRandomInt(8, 19);
    console.log(numApplications);
    var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    var apps = shuffle(a);
    apps = apps.slice(0, numApplications);
    //applies order of shuffled applicants into the job queue
    applyJob.push(apps);
    console.log(applyJob);
    //interates thorugh the numbers in the sliced app array
    async.eachSeries(apps, function(app, doneCallback) {
        //Add job data
        console.log("application");
        console.log(app);
        console.log(applicants[app]);
        applicants[app].jobId = job.jobId;
        applicants[app].jobCategory = job.jobCategory;
        applicants[app].jobCategoryGroup = job.jobCategoryGroup;
        request({
          url: baseUrl + 'BaseApplicants/genderize', //URL to hit        
          method: 'POST',
          json: applicants[app],
          headers: {
            "content-type": "application/json",
          },
        }, function(error, response, body) {

          if (error) {
            console.log(error);
            return doneCallback(error);
          }
          else {
            console.log("uploaded");
            console.log(app);

            return doneCallback(null, body);
          }
        });
      },
      function(err) {
        if (err) {
          console.log("Error uploading job)");
          console.log(err);
          return done(err);
        }
        else {
          console.log("Applicantions for job ");
          return done(null);
        }
      });
  };

  var oneJob = function(done) {
    //get randome numbes and applications
    var numApplications = getRandomInt(8, 19);
    console.log(numApplications);
    var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    var apps = shuffle(a);
    var apps = apps.slice(0, numApplications);
    //applies order of shuffled applicants into the job queue
    applyJob.push(apps);
    console.log(applyJob);
    //interates thorugh the numbers in the sliced app array
    async.eachSeries(apps, function(app, doneCallback) {
        //Add job dataz
        console.log("application");
        console.log(app);
        //console.log(applicants[app]);
        applicants[app].jobId = jobs[0].jobId;
        applicants[app].jobCategory = jobs[0].jobCategory;
        applicants[app].jobCategoryGroup = jobs[0].jobCategoryGroup;
        console.log(applicants[app]);
        request({
          url: baseUrl + 'BaseApplicants/genderize', //URL to hit    
          method: 'POST',
          json: applicants[app],
          headers: {
            "content-type": "application/json",
          },
        }, function(error, response, body) {

          if (error) {
            console.log(error);
            return doneCallback(error);
          }
          else {
            console.log("uploaded");
            console.log(body);

            return doneCallback(null, body);
          }
        });
      },
      function(err) {
        if (err) {
          console.log("Error uploading job)");
          console.log(err);
          return done(err);
        }
        else {
          console.log("Applicantions for job ");
          return done(null);
        }
      });
  };

  function applicantsUpload(next) {
    //randomize which user in the array of applicants applies to the job
    //Will include progress as applicant array is needed for the jobs
    async.each(jobs, iterateJob, function(err) {
      if (err) {
        console.log("Error interating job)");
        console.log(err);
        return next(err);
      }
      else {
        console.log("done with applications upload");
        return next(null);
      }
    });
  }
  var runHired = function(app) {
    async.eachSeries(progress[0], function(progression, donePro) {
      progression.userId = applicants[app].userId;
      progression.jobId = applicants[app].jobId;
      console.log(progression);
      request({
        url: baseUrl + 'BaseApplicants/updateProgress', //URL to hit        
        method: 'POST',
        json: progression,
        headers: {
          "content-type": "application/json",
        },
      }, function(error, response, body) {

        if (error) {
          console.log(error);
          return donePro(error);
        }
        else {
          console.log("uploaded");
          console.log(app);

          return donePro(null);
        }
      });
    }, function(error, response, body) {

      if (error) {
        console.log(error);
        return;
      }
      else {
        console.log("uploaded");
        console.log(app);

        return;
      }
    });
  };

  var progressCandidate = function(apps, job, progressArr, progressDone) {
    //for each application...
    console.log("in progress of candidate");
    async.eachSeries(apps, function(app, appDone) {
      //for each progress state....
      async.eachSeries(progress[progressArr], function(progression, donePro) {
        progression.userId = applicants[app].userId;
        progression.jobId = jobs[job].jobId;
        console.log(progression);
        request({
          url: baseUrl + 'BaseApplicants/updateProgress', //URL to hit        
          method: 'POST',
          json: progression,
          headers: {
            "content-type": "application/json",
          },
        }, function(error, response, body) {

          if (error) {
            //console.log(error);
            return donePro(error);
          }
          else {
            console.log("uploaded");
            //console.log(body);

            return donePro(null);
          }
        });
      }, function(error, response, body) {

        if (error) {
          //console.log(error);
          return appDone(error);
        }
        else {
          //console.log("uploaded");
          //console.log(app);
          return appDone(null);
        }
      });
    }, function(error, response, body) {

      if (error) {
        console.log(error);
        return progressDone(error);
        //return;
      }
      else {
        console.log("uploaded");
        console.log(apps);
        return progressDone(null);
        //return;
      }
    });

  };

  var offeredProgress = function(progression) {

  };

  function progressUpload(next) {
    console.log("In progress");
    console.log(applyJob);
    if (applyJob.length <= 2) {
      async.forEachOfSeries(applyJob, function(appList, key, doneCallback) {
          //hire first on the list
          //runHired(appList[0])
          //offer next set of people
          var numOffers = getRandomInt(2, (appList.length / 4));
          //shortlist this set
          var numShortLists = getRandomInt(2, (appList.length / 3));
          //slice up list
          var hiring = [appList[0]];
          var offers = appList.slice(1, numOffers)
          var shortlist = appList.slice(numOffers, numOffers + numShortLists);
          var drop = appList.slice(numOffers + numShortLists, appList.length);
          console.log(appList);
          console.log(hiring);
          console.log(offers);
          console.log(shortlist);
          console.log(drop);
          async.series([
            function(cb) {
              progressCandidate(hiring, key, 0, cb);
            },
            function(cb) {
              progressCandidate(offers, key, 1, cb);
            },
            function(cb) {
              progressCandidate(shortlist, key, 2, cb);
            },
            function(cb) {
              progressCandidate(drop, key, 3, cb);
            }
          ]);
          return doneCallback(null);
        },
        function(err) {
          if (err) {
            //console.log("Error uploading progress)");
            //console.log(err);
            return next(err);
          }
          else {
            //console.log("Progress for applicants ");
            return next(null);
          }
        });
    }
    else {
      //runHired(applyJob[0])
      //offer next set of people
      var numOffers = getRandomInt(1, (applyJob.length / 4));
      //shortlist this set
      var numShortLists = getRandomInt(1, (applyJob.length / 3));
      //slice up list
      var hiring = [applyJob[0]];
      var offers = applyJob.slice(0, numOffers);
      var shortlist = applyJob.slice(numOffers, numOffers + numShortLists);
      var drop = applyJob.slice(numOffers + numShortLists-1, applyJob.length);
      console.log(applyJob);
      console.log(applyJob[0]);
      console.log(offers);
      console.log(shortlist);
      console.log(drop);
      async.series([
        function(cb) {
          progressCandidate(hiring, 0, cb);
        },
        function(cb) {
          progressCandidate(offers, 1, cb);
        },
        function(cb) {
          progressCandidate(shortlist, 2, cb);
        },
        function(cb) {
          progressCandidate(drop, 3, cb);
        }
      ]);
      return next(null);
    }
  }

  function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
    return (a);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  DemoUpload.getRandomInt = getRandomInt;

  DemoUpload.remoteMethod(
    'drafts', {
      http: {
        path: '/drafts',
        verb: 'Get'
      },
      returns: {
        arg: 'Done',
        type: 'string'
      }
    }
  );
  DemoUpload.remoteMethod(
    'jobs', {
      http: {
        path: '/jobs',
        verb: 'Get'
      },
      returns: {
        arg: 'Done',
        type: 'string'
      }
    }
  );
  DemoUpload.remoteMethod(
    'applicants', {
      http: {
        path: '/applicants',
        verb: 'Get'
      },
      returns: {
        arg: 'Done',
        type: 'string'
      }
    }
  );
  DemoUpload.remoteMethod(
    'progress', {
      http: {
        path: '/progess',
        verb: 'Get'
      },
      returns: {
        arg: 'Done',
        type: 'string'
      }
    }
  );
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
};

var jobs = [{
  "jobCategory": "Web & Mobile Design",
  "jobCategoryGroup": "Web Development",
  "jobProject": "Cool job for Aman’s project",
  "jobDescription": "Sixth Ave Studios is headquartered in downtown Tacoma, WA. In the last 3 years we had the opportunity to work with notable clients such as Cartier, Gap, Levis, Mazda, Mercedes, Microsoft and Oreo. Our focus is primarily modern web software and enterprise level applications.\nJob Description\nThe Web Developer is an experienced developer that uses JavaScript , HTML, and CSS to build dynamic, responsive web applications. Our developers are deep problem solvers.\nResponsibilities\n\t• Produce and maintain enterprise quality Javascript applications utilizing industry standard patterns and best practices using MV* (MVVM, MVC) client side architecture.\n\t• Implement designs and prototypes using modern HTML and CSS\n\t• Use modern JavaScript based build tools (NodeJS, Gulp, etc.)\n\t• Collaborate with Designers and Information Architects to identify development constraints\n\t• Participate in agile development process\n\t• Participate in design and code reviews\n",
  "jobId": "job1",
  "skills": "javascript,node.js,angularjs",
  "externalProficiency": "expert",
  "internalProficiency": "Intermediate",
  "roleName": "java developer",
  "userId": "poster1",
  "markets": "upwork",
  "source": "CTSP"
}, {
  "jobCategory": "Web & Mobile Design",
  "jobCategoryGroup": "Web Development",
  "jobProject": "Chris's Code Work Project",
  "jobDescription": "Sixth Ave Studios is headquartered in downtown Tacoma, WA. In the last 3 years we had the opportunity to work with notable clients such as Cartier, Gap, Levis, Mazda, Mercedes, Microsoft and Oreo. Our focus is primarily modern web software and enterprise level applications.\nJob Description\nThe Web Developer is an experienced developer that uses JavaScript , HTML, and CSS to build dynamic, responsive web applications. Our developers are deep problem solvers.\nResponsibilities\n\t• Produce and maintain enterprise quality Javascript applications utilizing industry standard patterns and best practices using MV* (MVVM, MVC) client side architecture.\n\t• Implement designs and prototypes using modern HTML and CSS\n\t• Use modern JavaScript based build tools (NodeJS, Gulp, etc.)\n\t• Collaborate with Designers and Information Architects to identify development constraints\n\t• Participate in agile development process\n\t• Participate in design and code reviews\n",
  "jobId": "job2",
  "skills": "javascript,node.js,angularjs",
  "externalProficiency": "expert",
  "internalProficiency": "advanced",
  "roleName": "java developer",
  "userId": "poster1",
  "markets": "upwork",
  "source": "CTSP"
}, ];

var drafts = [
  [{
    "jobDescription": "Sixth Ave Studios is headquartered in downtown Tacoma, WA. In the last 3 years we had the opportunity to work with notable clients such as Cartier, Gap, Levis, Mazda, Mercedes, Microsoft and Oreo. Our focus is primarily modern web software and enterprise level applications.\nJob Description\nThe Web Developer is an experienced developer that uses JavaScript , HTML, and CSS to build dynamic, responsive web applications. Our developers are deep problem solvers",
    "marketSource": ["dtb", "upwork"],
    "draftId": "job1drafts",

    "draftSource": "CTSP"
  }, {
    "jobDescription": "Sixth Ave Studios is headquartered in downtown Tacoma, WA. In the last 3 years we had the opportunity to work with notable clients such as Cartier, Gap, Levis, Mazda, Mercedes, Microsoft and Oreo. Our focus is primarily modern web software and enterprise level applications.\nJob Description\nThe Web Developer is an experienced developer that uses JavaScript , HTML, and CSS to build dynamic, responsive web applications. Our developers are deep problem solvers.\nResponsibilities\n\t• Produce and maintain enterprise quality Javascript applications utilizing industry standard patterns and best practices using MV* (MVVM, MVC) client side architecture.\n\t• Implement designs and prototypes using modern HTML and CSS\n\t• Use modern JavaScript based build tools (NodeJS, Gulp, etc.)\n",
    "marketSource": ["dtb", "upwork"],
    "draftId": "job1drafts",

    "draftSource": "CTSP"
  }]
];

var applicants = [{
  "name": "Shahsi Jain",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker1",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 15,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Jarrett Jack",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker2",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 64,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Michael Johnson",
  "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker3",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 21,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Kendal Jackson",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker4",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 25,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Kareen Johnson",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker5",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 26,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Carry Nachenburg",
  "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker6",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 69,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Kumar Sheik",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker7",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 17,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Eyun Kyu",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker8",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 64,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "James Jones",
  "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker9",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 51,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Henryk Gurskzy",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker10",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 75,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Mary Hamilton",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker11",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 29,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Vertika Srivastava",
  "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker12",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 23,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Shahsi Kapur",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker13",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 50,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Christina Milan",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker14",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 47,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Leyla Rose",
  "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker15",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 55,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Anna Rozaro",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker16",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 69,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Madyline Rose",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker17",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 66,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Sophia Gats",
  "picURL": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwji5LLnzuzNAhWELB4KHU7KBnAQjRwIBA&url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fvertika-srivastava-a9a389a1&psig=AFQjCNFQQO8FWGD_QC9gIXpeXdH-1c2juQ&ust=1468367894802635",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker18",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 19,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Olivia Beckett",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker19",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 29,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, {
  "name": "Jamie Campbell",
  "picURL": "http://media.bizj.us/view/img/8995932/mary-hamiltonaccenture*320xx3733-5616-0-0.jpg",
  "source": "CTSP",
  "sourceId": "test",
  "userId": "worker20",
  "laborMarket": "upwork",
  "city": "San Jose",
  "country": "US",
  "wageRequested": 35,
  "timezone": "GMT+05:30",
  "progress": "applied"
}, ];
var progress = [
  [{
    "progress": "shortlisted"
  }, {
    "progress": "offered"
  }, {
    "progress": "hired"
  }],
  [{
    "progress": "shortlisted"
  }, {
    "progress": "offered"
  }, {
    "progress": "dropped"
  }],
  [{
    "progress": "shortlisted"
  }, {
    "progress": "dropped"
  }],
  [{
    "progress": "dropped"
  }],

];
