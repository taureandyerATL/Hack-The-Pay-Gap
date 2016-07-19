var async = require("async");

module.exports = function(JobStats) {
    JobStats.newApplicant = function(percentile, jobId, gender, next) {
        console.log("ENTERING JOB STATS FOR " + jobId);
        console.log(jobId);
        JobStats.findOne({
            where: {
                "jobId": jobId
            }
        }, function(err, stats) {
            if (err) {
                console.log("Error finding JobStats:");
                console.log(err);
                return;
            }
            else {
                //use gender to determine stats
                console.log(stats)
                if (gender == "male" || gender == "Male") {
                    if (percentile < stats.maleMin) {
                        stats.maleMin = percentile;
                    }
                    if (percentile > stats.maleMax) {
                        stats.maleMax = percentile;
                    }
                    stats.maleAve = ((stats.maleAve * stats.maleCount) + percentile) / (stats.maleCount + 1) //new average
                    stats.maleCount += 1;
                    stats.applicantCount += 1;
                }
                else if (gender == "female" || gender == "Female") {
                    if (percentile < stats.femaleMin) {
                        stats.femaleMin = percentile;
                    }
                    if (percentile > stats.femaleMax) {
                        stats.femaleMax = percentile;
                    }
                    stats.femaleAve = ((stats.femaleAve * stats.femaleCount) + percentile) / (stats.femaleCount + 1) //new average
                    stats.femaleCount += 1;
                    stats.applicantCount += 1;
                }
                else {
                    console.log("no gender, no updates");
                }
                JobStats.upsert(stats, function(err, updatedStats) {
                    if (err) {
                        console.log("bad update of JobStats: ");
                        console.log(err)
                        console.log("LEAVING JOB STATS");
                        return next(err);
                    }
                    else {
                        console.log("updated app");
                        console.log(updatedStats);
                        console.log("LEAVING JOB STATS");
                        return next(null, stats);
                    }
                });
            }
        });
    }

    JobStats.getApplicantStats = function(jobId, next) {}

    JobStats.getSankey = function(jobId, next) {
        /*
        1. get female stats
        2. get male stats
        3. save to data in json Object formed to Sankey json
        */
        jobId = "job1";
        var stats = {}
        var jobstats = {};
        var genders = ["male", "female"];
        var progress = ["applied", "shortlisted", "offered", "hired"];
        //build sankey
        var sankeyJson = {};
        sankeyJson.links = [];
        sankeyJson.nodes = [];
        //initial applications
        sankeyJson.nodes.push({
            "name": "applications"
        });
        async.eachSeries(genders, function(gender, genderFinish) {
            //genders.forEach(function(gender) {
            var lastState = "";
            var lastProgress = "";
            async.forEachOfSeries(progress, function(state, key, stateFinish) {
                console.log(state);
                if (state == "applied") {
                    lastProgress = "applications";
                }
                var getProgress = {};
                getProgress[state] = 1;
                console.log('$$$$$$$$$$$$$$$$$$');
                console.log(jobId);
                console.log(getProgress);
                console.log('$$$$$$$$$$$$$$$$$$');
                JobStats.app.models.ProjectApplication.count({

                    and: [{

                        "sourceJobId": jobId

                    }, {

                        "gender": gender

                    }, getProgress]

                }, function(err, count) {
                    if (err) {
                        console.log("Error getting " + gender + " who " + state);
                        console.log(err);
                        next(err)
                        return;
                    }
                    else {
                        console.log("Got count");
                        console.log(count)
                        if (!count) {
                            console.log("NOT FOUND for ");
                            console.log(getProgress);
                            stateFinish(null, sankeyJson);
                        }
                        else {
                            var statename = gender + state;
                            jobstats[statename] = count;
                            var name = state + " (" + gender + ")";
                            var node = {
                                "name": name
                            };
                            sankeyJson.nodes.push(node);
                            sankeyJson.links.push({
                                "source": lastProgress,
                                "target": state + " (" + gender + ")",
                                "value": count
                            });
                            console.log(sankeyJson);
                            if (state != "hired") {
                                var nextProgress = {};
                                nextProgress[progress[key + 1]] = {};
                                nextProgress[progress[key + 1]].exists = false;
                                JobStats.app.models.ProjectApplication.count({

                                    and: [{

                                        "sourceJobId": jobId

                                    }, {

                                        "gender": gender

                                    }, getProgress, nextProgress, {

                                        "dropped": 1

                                    }]

                                }, function(err, count) {
                                    if (err) {
                                        console.log("Error getting dropped" + gender + " who " + state);
                                        console.log(err);
                                        next(err)
                                        return;
                                    }
                                    else {
                                        console.log("Got dropped count");
                                        console.log(count)
                                        if (!count) {
                                            console.log("NOT FOUND for DROPPED at ");
                                            console.log(getProgress);
                                        }
                                        else {
                                            var name = "Dropped at " + state;
                                            var node = {
                                                "name": name
                                            };
                                            //will add the node if it doesn't exist
                                            console.log(node)
                                            if (sankeyJson.nodes.indexOf(node) < 0) {
                                                sankeyJson.nodes.push(node);
                                            }
                                            sankeyJson.links.push({
                                                "source": state + " (" + gender + ")",
                                                "target": name,
                                                "value": count
                                            });

                                        }
                                        //get last info
                                        lastProgress = state + " (" + gender + ")";
                                        lastState = state;
                                        //console.log(sankeyJson);
                                        stateFinish(null, sankeyJson);

                                    }

                                });
                            }

                            else {
                                //at hired, we won't go further!
                                stateFinish(null, sankeyJson);
                            }
                        }
                    }
                });
                //console.log(sankeyJson);
            }, function(err) {
                if (err) {
                    next(err);
                    return;
                }

                else {
                    //console.log("sankey made uploaded");
                    //console.log(sankeyJson);
                    console.log("updated Sankey")
                    return genderFinish(null, sankeyJson);
                }
            });
        }, function(err) {
            if (err) {
                next(err);
                return;
            }
            else {
                console.log("sankey made uploaded");
                    //console.log(sankeyJson);
                JobStats.findOne({
                    where: {
                        "sourceJobId": jobId
                    }
                }, function(err, Stats) {
                    if (err) {
                        next(err);
                        return; 
                    }
                    else {
                        //console.log("sankey made uploaded");
                        //console.log(sankeyJson);
                        console.log("updated Sankey")
                            //ladies first
                        Stats.femaleapplied = jobstats.femaleapplied;
                        Stats.femaleshortlisted = jobstats.femaleshortlisted;
                        Stats.femaleoffered = jobstats.femaleoffered;
                        Stats.femalehired = jobstats.femalehired;
                        //now the males
                        Stats.maleapplied = jobstats.maleapplied;
                        Stats.maleshortlisted = jobstats.maleshortlisted;
                        Stats.maleoffered = jobstats.maleoffered;
                        Stats.malehired = jobstats.malehired;
                        JobStats.upsert(Stats, function(err, updated) {
                            if (err) {
                                next(err);
                                return;
                            }
                            else {
                                next(null, sankeyJson);
                                return;
                            }
                        });
                    }

                });
                //return sankeyJson;
            }
        });
    }
    
    JobStats.getWage = function(jobId, next) {
        //jobId = "job1";
        console.log("in get wage")
        var demoStat = {
            "maleCount": 3,
            "femaleCount": 3,
            "ExpectedJobCategoryPercent": 0,
            "maleMin": 53.666666666666664,
            "maleMax": 76.36363636363636,
            "femaleMin": 53.666666666666664,
            "femaleMax": 76.36363636363636,
            "maleAve": 68.79797979797979,
            "femaleAve": 61.23232323232323,
            "industryAve": 0,
            "internalProficiency": "advanced",
            "externalProficiency": "expert",
            "applicantCount": 6,
            "lastUpdatedBy": "System",
            "lastUpdatedOn": "2016-07-12T22:56:43.594Z",
            "createdBy": "System",
            "createdOn": "2016-07-12T22:56:38.755Z",
            "id": "578575a6774bae8f556942d7",
            "jobId": "578575a6774bae8f556942d6",
            "jobCategory": "Web & Mobile Design",
            "industrySalary": 0,
            "sourceJobId": "job2"
        }
        JobStats.findOne({
            where: {
                "sourceJobId": jobId
            }
        }, function(err, stats) {
            if (err) {
                console.log("Error getting JobStats");
                console.log(err);
                next(err)
                return;
            }
            else {
                //var stats = demoStat;
                //build json for wage viewer

                var view = {
                    colorSet: "shades",
                    title: {
                        text: "Wage Percentiles of Applicants for This Job by Gender ",
                    },
                    axisY: {
                        includeZero: false,
                        title: "National Income Percentile",
                        interval: 10,
                        gridThickness: 0,
                        minimum: 0,
                        maximum: 100,
                        stripLines: [{
                            value: stats.industryAve,
                            color: "rgb(242,171,116)",
                            label: "Indusry Average: " + stats.industryAve + "%",
                            labelFontColor: "black",
                            showOnTop: true
                        }]
                    },
                    axisX: {
                        interval: 10,
                    },
                    data: [{
                        type: "rangeBar",
                        showInLegend: true,
                        yValueFormatString: "#0",
                        legendText: "Wage Percentiles by Gender",
                        dataPoints: [{
                            x: 10,
                            y: [stats.femaleMin, stats.femaleMax]
                        }, {
                            x: 10,
                            y: [stats.femaleAve - .5, stats.femaleAve + .5],
                            label: "Female"
                        }, {
                            x: 20,
                            y: [stats.maleMin, stats.maleMax]
                        }, {
                            x: 20,
                            y: [stats.maleAve - .5, stats.maleAve + .5],
                            label: "Male"
                        }]
                    }]
                }
                console.log(view);
                next(null, view);
            }
        })
    }

    JobStats.shareWage = function(token, next) {
        console.log("in get share wage")

        var info = new Buffer(token, 'base64').toString();
        info = info.split(",")
        var userId = info[0];
        var jobId = info[1];

        JobStats.findOne({
            where: {
                "sourceJobId": jobId
            }
        }, function(err, stats) {
            if (err) {
                console.log("Error getting JobStats");
                console.log(err);
                next(err)
                return;
            }
            else {
                //var stats = demoStat;
                //build json for wage viewer
                JobStats.app.models.ProjectApplication.findOne({

                    where: {

                        and: [{

                            "sourceJobId": jobId

                        }, {

                            "userId": userId

                        }]

                    }

                }, function(err, applicant) {
                    if (err) {
                        console.log("Error getting JobStats");
                        console.log(err);
                        next(err)
                        return;
                    }
                    else {
                        console.log(stats);

                        var view = {
                            colorSet: "shades",
                            title: {
                                text: "Wage Percentiles of Applicants for This Job by Gender ",
                            },
                            axisY: {
                                includeZero: false,
                                title: "National Income Percentile",
                                interval: 10,
                                gridThickness: 0,
                                minimum: 0,
                                maximum: 100,
                                stripLines: [{
                                    value: stats.industryAve,
                                    color: "rgb(242,171,116)",
                                    label: "Indusry Average: " + stats.industryAve + "%",
                                    labelFontColor: "black",
                                    showOnTop: true
                                }]
                            },
                            axisX: {
                                interval: 10,
                            },
                            data: [{
                                type: "rangeBar",
                                showInLegend: true,
                                yValueFormatString: "#0",
                                legendText: "Wage Percentiles by Gender",
                                dataPoints: [{
                                    x: 10,
                                    y: [stats.femaleMin, stats.femaleMax]
                                }, {
                                    x: 10,
                                    y: [stats.femaleAve - .5, stats.femaleAve + .5],
                                    label: "Female"
                                }, {
                                    x: 20,
                                    y: [stats.maleMin, stats.maleMax]
                                }, {
                                    x: 20,
                                    y: [stats.maleAve - .5, stats.maleAve + .5],
                                    label: "Male"
                                }]
                            }]
                        };
                        if (applicant.gender == "female" || applicant.gender == "Female") {
                            var x = 10;
                        }

                        else {
                            var x = 20
                        }
                        view.data[0].dataPoints.push({
                            x: x,
                            y: [applicant.percentile - .5, applicant.percentile + .5],
                        });
                        view.data[0].dataPoints.push({
                            x: 30,
                            y: [applicant.percentile - .5, applicant.percentile + .5],
                            label: applicant.name + " at " + applicant.wageRequested
                        })
                        console.log(view);
                        next(null, view);
                    }
                })

            }
        });
    };
    JobStats.createWageShare = function(jobId, userId, next) {
        //FOR PRODUCTION CODE: THIS IS ALL YOU NEED.  
        /* 
        var token = new Buffer(userId + ","+jobId).toString('base64');
        var genURL = 'https://atl-htpg-taureandyeratl.c9users.io/?token=' + token;
        next(null, genURL)
        */

        //FOR DEMO ONLY, ALWAYS SEND A JOBID & USERID  "job1" ONLY WORKS IF DEMOUPLOAD HAPPENED
        if (jobId == null) {
            jobId = "job1";
        }
        if (userId == null) {
            JobStats.app.models.ProjectApplication.find({

                where: {

                    "sourceJobId": jobId

                }

            }, function(err, foundUser) {
                if (err) {
                    console.log("bad update of JobStats: ");
                    console.log(err)
                    console.log("LEAVING JOB STATS");
                    return next(err);
                }
                else {
                    var randomUser = JobStats.app.models.DemoUpload.getRandomInt(0, foundUser.length - 1);

                    userId = foundUser[randomUser].userId;
                    //userId = foundUser.userId;
                    var token = new Buffer(userId + "," + jobId).toString('base64');
                    var genURL = 'https://atl-htpg-taureandyeratl.c9users.io/?token=' + token;
                    next(null, genURL);
                }
            })
        }

        else {
            var token = new Buffer(userId + "," + jobId).toString('base64');
            var genURL = 'https://atl-htpg-taureandyeratl.c9users.io/?token=' + token;
            next(null, genURL)
        }

    }

    JobStats.remoteMethod(
        'getSankey', {
            http: {
                path: '/getSankey',
                verb: 'Post'
            },
            accepts: [{
                arg: 'jobId',
                type: 'string'
            }],
            returns: {
                root: true,
                type: 'object'
            }
        }
    );

    JobStats.remoteMethod(
        'getSankeyJSON', {
            http: {
                path: '/getJSON',
                verb: 'Post'
            },
            accepts: [{
                arg: 'jobId',
                type: 'string'
            }],
            returns: {
                root: true,
                type: 'object'
            }
        }
    );
    JobStats.remoteMethod(
        'getWage', {
            http: {
                path: '/getWage',
                verb: 'Post'
            },
            accepts: [{
                arg: 'jobId',
                type: 'string'
            }],
            returns: {
                root: true,
                type: 'object'
            }
        }
    );
    JobStats.remoteMethod(
        'shareWage', {
            http: {
                path: '/shareWage',
                verb: 'Post'
            },
            accepts: [{
                arg: 'token',
                type: 'string'
            }],
            returns: {
                root: true,
                type: 'object'
            }
        }
    );
    JobStats.remoteMethod(
        'createWageShare', {
            http: {
                path: '/createWageShare',
                verb: 'Post'
            },
            accepts: [{
                arg: 'jobId',
                type: 'string'
            }, {
                arg: 'userId',
                type: 'string'
            }],
            returns: {
                root: true,
                type: 'object'
            }
        }
    );
}