'use strict';
var https = require("https");
var request = require('request');
var _ = require('lodash');
var stateFinder = require('./StateFinder');

module.exports = function(BaseApplicant) {

    /*
    TODO
    1. Get base applicant data
    2. check and see if you have seen this applicant before
        a) if yes, get gender and locationinformation and add to database
        b) if no, update the applicant if needed
    3. check to see if this applicant has applied to this job before by looking ath their applications
        a)  if no, add a new entry into the Project Application
            i. relate applicant to application
            ii. relate application to Job
        b) if yes, make updates to application if necessary
    4. Send wage and gender info for  
    */
    BaseApplicant.genderize = function(name, picURL, source, sourceId, userId, laborMarket, city, country, jobId, jobCategoryGroup, jobCategory, wageRequested, timezone, next) {
        console.log(name, picURL, source, userId);
        BaseApplicant.find({
            userId: userId
        }, function(err, applicant) {
            if (err) {
                console.log("Error looking up Applicants:" + err);
                next(err);
            }
            if (applicant.length === 0) {
                buildApplicant(name, picURL, source, sourceId, userId, laborMarket, city, country, jobId, jobCategoryGroup, jobCategory, wageRequested, timezone, next)
                return;
            }

            updateApplicant(applicant, jobId, jobCategoryGroup, jobCategory, wageRequested, next);

        });
    };

    let buildApplicant = function(name, picURL, source, sourceId, userId, laborMarket, city, country, jobId, jobCategoryGroup, jobCategory, wageRequested, timezone, next) {
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
            laborMarket:laborMarket
        };
        var application = {
            name: name,
            city: city,
            country: country,
            state_longname: "NA",
            state_shortname: "NA",
            jobId: jobId,
            sourceId:sourceId,
            source:source,
            userId:userId,
            jobCategory: jobCategory,
            wageRequested: wageRequested,
            timezone: timezone,
            laborMarket: source
        }
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

    let updateApplicant = function(applicant, jobId, jobCategoryGroup, jobCategory, wageRequested, next) {
            next("Method not implemented",{});
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
            BaseApplicant.create(profile, function(err, applicant) {
                if (err) {
                    next(err);
                    return;
                }
                console.log(applicant);
                application.applicantId = applicant.id;
                BaseApplicant.app.models.ProjectApplication.create(application, function(err, projectApp) {
                    if (err) {
                        console.log(err)
                        next(err);
                        return;
                    }
                    applicant.ProjectApplication = projectApp;
                    next(null, applicant);
                });
            });
        };
        if (profile.country !== 'us')
            finalFunc();

        stateFinder(profile.city).then(state => {
                profile.state_shortname = state.short_name;
                profile.state_longname = state.long_name;
                finalFunc();
            })
            .catch(next);
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
            }],
            returns: {
                root: true,
                type: 'object'
            }
        }
    );
}
