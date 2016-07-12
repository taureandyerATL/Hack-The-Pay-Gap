'use strict';
var https = require("https");
var request = require('request');
var _ = require('lodash');
var stateFinder = require('./StateFinder');

module.exports = function(BaseApplicant) {

    /*
    
    TODO
    DONE- 1. Get base applicant data
    2. check and see if you have seen this applicant before
        DONE- a) if yes, get gender and locationinformation and add to database
        b) if no, update the applicant if needed
    3. check to see if this applicant has applied to this job before by looking ath their applications
        DONE- a)  if no, add a new entry into the Project Application
            i. relate applicant to application
            ii. relate application to Job
        b) if yes, make updates to application if necessary
    4. Send wage and gender info for analysis
    */
    BaseApplicant.genderize = function(name, picURL, source, sourceId, userId, laborMarket, city, country, jobId, jobCategoryGroup, jobCategory, wageRequested, timezone, progress, next) {
        console.log(name, picURL, source, userId);
        BaseApplicant.app.models.Job.findOne({
            where: {
                "jobPostSourceId": jobId
            }
        }, function(err, job) {
            if (err) {
                console.log("Error looking up Associated Job:" + err);
                next(err);
            }
            else {
                if (job) {
                    console.log(job);
                    BaseApplicant.find({
                        where: {
                            "userId": userId
                        }
                    }, function(err, applicant) {
                        if (err) {
                            console.log("Error looking up Applicants:" + err);
                            next(err, null);
                        }
                        //TODO there is something wrong here.  we want to add an applicant where there is none.
                        else if (applicant){
                            if(applicant.length === 0) {
                                buildApplicant(job, name, picURL, source, sourceId, userId, laborMarket, city, country, jobId, jobCategoryGroup, jobCategory, wageRequested, timezone, next);
                                return;
                            }else {
                                let application = applicationObj(job, name, picURL, source, sourceId, userId, laborMarket, city, country, jobId, jobCategoryGroup, jobCategory, wageRequested, timezone, next);
                                updateApplicant(job, applicant, jobId, jobCategoryGroup, jobCategory, wageRequested, application, progress, next);
                            }
                        }
                    });
                }
                else {
                    var error = "no jobs found";
                    next(error, null)
                }
            }
        });
    };
    let progressObj = (progress, application) => {
        if(progress == "applied"){
            application.applied= 1
        }else if(progress == "shortlisted" || progress == "merit"){
            application.shortlisted= 1
        }else if(progress == "offered"){
            application.offered= 1
        }else if(progress == "hired"){
            application.hired= 1
        }else if(progress == "dropped"){
            application.dropped= 1
        }
        return application;
    }
    /*let progressObj = (progress) => {
        if(progress == "applied"){
            return{
                applied: 1
            }
        }else if(progress == "shortlisted" || progress == "merit"){
            return{
                shortlisted: 1
            }
        }else if(progress == "offered"){
            return{
                offered: 1
            }
        }else if(progress == "hired"){
            return{
                hired: 1
            }
        }else if(progress == "dropped"){
            return{
                dropped: 1
            }
        }
    }*/
    let applicationObj = (job, name, picURL, source, sourceId, userId, laborMarket, city, country, jobId, jobCategoryGroup, jobCategory, wageRequested, timezone) => {
        return {
            name: name,
            city: city,
            country: country,
            state_longname: "NA",
            state_shortname: "NA",
            sourceJobId: jobId,
            jobId: job.id,
            sourceId: sourceId,
            source: source,
            userId: userId,
            jobCategory: jobCategory,
            wageRequested: wageRequested,
            timezone: timezone,
            laborMarket: source,
            applied: 1
        };

    }

    let buildApplicant = function(job, name, picURL, source, sourceId, userId, laborMarket, city, country, jobId, jobCategoryGroup, jobCategory, wageRequested, timezone, next) {
        var firstName = name.split(/[ ,]+/); //HTPG
        var path = 'https://api.genderize.io/?name=' + firstName[0];
        var profile = {
            sourceId: sourceId,
            source: source,
            name: name,
            firstName: firstName[0],
            userId: userId,
            picURL: picURL,
            state_longname: "NA",
            state_shortname: "NA",
            laborMarket: laborMarket,
            country: country,
            city: city
        };
        let application = applicationObj(job, name, picURL, source, sourceId, userId, laborMarket, city, country, jobId, jobCategoryGroup, jobCategory, wageRequested, timezone);
        console.log(profile);
        console.log(path);
        //send HTTP request and get the data
        https.get(path, function(response) {
            //debugger;
            //console.log(response);
            var body = ""
            response.on('data', function(data) {
                body += data;
            });
            response.on('end', function() {
                var resp = JSON.parse(body);
                console.log('response made for: ' + resp.length);
                //debugger;
                debugger;
                console.log("adding company data");
                console.dir(resp);
                var genderInfo = resp;
                if (resp.probability > .97) {
                    createApplicant(genderInfo, profile, application, next);
                }
                else {
                    if (picURL) {
                        getGenderByFace(picURL, returnObj => {
                            if (returnObj.code)
                                genderInfo.photo = null
                            else
                                genderInfo.photo = returnObj;
                            createApplicant(genderInfo, profile, application, next);
                        });
                    }
                    else {
                        genderInfo.gender = "unknown";
                        createApplicant(genderInfo, profile, application, next);
                    }
                }
            });
        });
    };

    let updateApplicant = function(job, applicant, jobId, jobCategoryGroup, jobCategory, wageRequested, application, progress, next) {
            // at this point, we know the applicant is there and we know that job is valid as well.
            // now we have to check that have the applicant, has applied to this job earlier, 
            // if he has then just return, applicant already applied to the job
            
            let createApplication = () => {
                application.applicantId = applicant.id;
                BaseApplicant.app.models.ProjectApplication.create(application, function(err, projectApp) {
                    if (err) {
                        console.log(err)
                        next(err);
                        return;
                    }
                    //projectApp.Applicant(applicant);
                    //applicant.ProjectApplication = projectApp;
                    next(null, projectApp);
                });
            };
            let applicationFound = () => {
                
                //TODO: Upsert progression into found application
                let progression = progressObj(progress,application)
                BaseApplicant.app.models.ProjectApplication.upsert(progression, function(err, projectApp) {
                    if (err) {
                        console.log(err)
                        next(err);
                        return;
                    }
                    //projectApp.Applicant(applicant);
                    //applicant.ProjectApplication = projectApp;
                    next(null, applicant);
                });
                next(null, "Updates have been applied");
            };
            let postFindApplication = application => {
                if (application != null) {
                    applicationFound(application);
                    return;
                }
                createApplication();

            };

            let errorHandler = err => {
                next(err)
            };
            BaseApplicant.app.models.ProjectApplication.findOne({
                    where: {
                        applicantId: applicant.id,
                        jobId: job.id
                    }
                })
                .then(postFindApplication)
                .catch(errorHandler)
            next(null, "Method not implemented");
        }
        /*
            Author: Jerrid
            Method: getGenderByFace(photoUrl, cb)
            -- photoURL: Url to an online photo
            -- cb: Callback function that takes in one status
            Description: Finds a person's gender given the URL of an online photo
        */
    function getGenderByFace(photoUrl, cb) {
        if (!photoUrl) {
            cb && cb({
                code: 422,
                message: "no data"
            });
            return;
        }

        var apiSecret = "qoGxWmMc7p6-7D05ekcyf9sXGfymP20V";
        var apiKey = "e48b6dfc4a74a7098aa61085a4c1e1e3";
        var facesPlusPlusUrl = "https://apius.faceplusplus.com/v2/detection/detect?url=" + encodeURI(photoUrl) + "&api_secret=" + apiSecret + "&api_key=" + apiKey + "&attribute=gender,age,race,smiling";

        var options = {
            method: 'GET',
            url: facesPlusPlusUrl
        };

        request(options, function callback(error, response, body) {
            if (error) {
                console.log("getGenderByFace() Error: " + JSON.stringify(error));
                cb({
                    code: 422,
                    message: "getGenderByFace() Error: " + JSON.stringify(error)
                });
                return;
            }

            if (response.statusCode !== 200) {
                console.log("getGenderByFace() response code: " + response.statusCode + " Body: " + JSON.stringify(body));
                cb({
                    code: 422,
                    message: "getGenderByFace() response code: " + response.statusCode + " Body: " + JSON.stringify(body)
                });
                return;
            }

            //Valid data
            var faces = JSON.parse(body).face;
            console.log("Response Data: " + JSON.stringify(faces) + "\n\n");
            if (faces.length > 1) {
                console.log("Multiple faces detected. Do something else like use name validation. We don't know who's who.");
                cb({
                    code: 422,
                    message: "Multiple faces detected. Do something else like use name validation. We don't know who's who."
                });
                return;
            }

            _.map(faces, function(face) {
                console.log("Face: " + JSON.stringify(face));
                cb({
                    gender: face.attribute.gender.value,
                    confidence: face.attribute.gender.confidence
                });
            });
        });
    }

    /* //Photo of Tyra Banks
     var url = "http://images4.fanpop.com/image/photos/16500000/Smoke-eyes-pic-tyra-banks-16534918-450-450.jpg";
     //Call above method
     getGenderByFace(url, function(result) {
         if (result.code) {
             console.log("getGenderByFace() Error occurred: " + result.message);
             return;
         }

         //Do what thou wilt with the result. It'll be a JSON obj
         console.log(JSON.stringify(result));
     });*/

    function createApplicant(genderInfo, profile, application, next) {
        profile.gender = genderInfo.gender;
        profile.genderNameConfidence = genderInfo.probability;
        if (genderInfo.photo) {
            if (!genderInfo.photo.code) {
                profile.genderPictureConfidence = genderInfo.photo.confidence;
                profile.gender = genderInfo.photo.gender;
            }
        }
        var finalFunc = () => {
            console.log("COUNTRY USED: " + profile.country);
            // BaseApplicant.app.models.ProjectApplication
            BaseApplicant.create(profile, function(err, applicant) {
                if (err) {
                    next(err);
                    return;
                }
                application.applicantId = applicant.id;
                console.log('-----------------');
                console.log(applicant);
                console.log('------------------');
                //BaseApplicant.app.models.ProjectApplication.create(application, function(err, projectApp) {
                BaseApplicant.app.models.ProjectApplication.create(application, function(err, projectApp) {
                    if (err) {
                        console.log(err)
                        next(err);
                        return;
                    }
                    //projectApp.Applicant(applicant);
                    //applicant.ProjectApplication = projectApp;
                    BaseApplicant.app.models.Job.findOne({where: {"sourceJobId": applicant.jobId}}, function(err, job){
                        if (err) {
                            next(err);
                            return;
                        }else{
                            //state, job, and stats aren't needed
                            BaseApplicant.app.models.Economics.getPercentile(projectApp.wageRequested, applicant.gender, job.internalProficiency, job.externalProficiency, undefined, job.id, undefined,  projectApp.id, function(err, percentile){
                                if (err) {
                            next(err);
                            return;
                        }else{
                            return next(null, applicant);
                            }
                            
                                
                            });
                            
                      
                        }
                    });
                    
                });
            });
        };
        if (profile.country !== 'us' && profile.country !== 'US' && profile.country !== 'USA' && profile.country !== 'usa') {
            console.log("Not the US Country");
            finalFunc();
            return;
        }
        stateFinder(profile.city).then(state => {
                profile.state_shortname = state.short_name;
                profile.state_longname = state.long_name;
                finalFunc();
            })
            .catch(next);
    }
    BaseApplicant.updateProgress = function(userId, jobId, progress, next){
        BaseApplicant.app.models.ProjectApplication.findOne({where: {and: [{"sourceJobId": jobId}, {"userId": userId}]}}, function(err, projectApp){
            if(err){
                console.log("Error finding Application");
                console.log(err);
                next(err);
            }else{
                var updates = progressObj(progress, projectApp);
                BaseApplicant.app.models.ProjectApplication.upsert(updates, function(err, updated){
                    if(err){
                        console.log("Error updating Application");
                        console.log(err);
                        return next(err);
                    }else{
                        console.log("Applicant updated");
                        console.log(updated);
                        return next(null, updated);
                    }
                });
            }
        });
    }
    
    BaseApplicant.remoteMethod(
        'genderize', {
            http: {
                path: '/genderize',
                verb: 'Post'
            },
            accepts: [{
                arg: 'name',
                type: 'string'
            }, {
                arg: 'picURL',
                type: 'string'
            }, {
                arg: 'source',
                type: 'string'
            }, {
                arg: 'sourceId',
                type: 'string'
            }, {
                arg: 'userId',
                type: 'string'
            }, {
                arg: 'laborMarket',
                type: 'string'
            }, {
                arg: 'city',
                type: 'string'
            }, {
                arg: 'country',
                type: 'string'
            }, {
                arg: 'jobId',
                type: 'string'
            }, {
                arg: 'jobCategoryGroup',
                type: 'string'
            }, {
                arg: 'jobCategory',
                type: 'string'
            }, {
                arg: 'wageRequested',
                type: 'string'
            }, {
                arg: 'timezone',
                type: 'string'
            }, {
                arg: 'progress',
                type: 'string'
            }],
            returns: {
                root: true,
                type: 'object'
            }
        }
    );
    BaseApplicant.remoteMethod(
        'updateProgress', {
            http: {
                path: '/updateProgress',
                verb: 'Post'
            },
            accepts: [{
                arg: 'userId',
                type: 'string'
            }, {
                arg: 'jobId',
                type: 'string'
            }, {
                arg: 'progress',
                type: 'string'
            }],
            returns: {
                root: true,
                type: 'object'
            }
        }
    );
}
