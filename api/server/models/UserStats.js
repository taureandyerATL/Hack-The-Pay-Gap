var async = require("async");

module.exports = function(UserStats) {
    UserStats.updateUser = function(jobId, userId, next){
        UserStats.app.models.JobStats.findOne({where: {"sourceJobId": jobId}}, function(err, stats){
            stats.sourceUserId = userId;
            UserStats.app.models.JobStats.upsert(stats, function(err, updated){
                next(null, updated);
            
            })
        })
    }
    UserStats.fire = function(jobId, next){
        UserStats.app.models.ProjectApplication.findOne({where: {and: [{"sourceJobId": jobId}, {"hired": 1}]}}, function(err, application){
            application.hired = undefined;
            application.dropped = 1;
            UserStats.app.models.ProjectApplication.upsert(application, function(err, updated){
                next(null, updated);
            
            })
        })
    }
    UserStats.hire = function(jobId, next){
        UserStats.app.models.ProjectApplication.findOne({where: {and: [{"sourceJobId": jobId}, {"offered": 1}, {"gender": "female"}]}}, function(err, application){
            application.hired = 1;
            application.dropped = undefined;
            UserStats.app.models.ProjectApplication.upsert(application, function(err, updated){
                next(null, updated);
            
            })
        })
    }
    UserStats.updateIndustry = function(jobId, industryAve, next){
        UserStats.app.models.JobStats.findOne({where: {"sourceJobId": jobId}}, function(err, stats){
            stats.industryAve = industryAve;
            UserStats.app.models.JobStats.upsert(stats, function(err, updated){
                next(null, updated);
            
            })
        })
    }
    UserStats.getSankey = function(userId, next) {
        //userId = "poster1";
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
        var jobsArr = {};
        jobsArr.or =[];
        UserStats.app.models.JobStats.find({where: {"sourceUserId": userId}}, function(err, jobs){
            if(err){
                console.log(err);
            }else{
                console.log(jobs);
                //Add foreach loop and make them search by jobIds
                jobs.forEach(function(job){
                    console.log(job.sourceJobId);
                    jobsArr.or.push({"sourceJobId": job.sourceJobId})
                })
                async.eachSeries(genders, function(gender, genderFinish) {
                    //genders.forEach(function(gender) {
                    console.log("jobs array")
                    console.log(jobsArr);
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
                        console.log(userId);
                        console.log(getProgress);
                        console.log('$$$$$$$$$$$$$$$$$$');
                        UserStats.app.models.ProjectApplication.count({
        
                            and: [jobsArr, {
        
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
                                        UserStats.app.models.ProjectApplication.count({
        
                                            and: [
                                                jobsArr, {
        
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
                        next(null, sankeyJson);
                        return;
                    }
                });
            }
                    
        })
    }

    
    UserStats.remoteMethod(
        'getSankey', {
            http: {
                path: '/getSankey',
                verb: 'Post'
            },
            accepts: [{
                arg: 'userId',
                type: 'string'
            }],
            returns: {
                root: true,
                type: 'object'
            }
        }
    )
    UserStats.remoteMethod(
        'updateUser', {
            http: {
                path: '/updateUser',
                verb: 'Post'
            },
            accepts: [{
                arg: 'jobId',
                type: 'string'
            },{
                arg: 'userId',
                type: 'string'
            }],
            returns: {
                root: true,
                type: 'object'
            }
        }
    )
    UserStats.remoteMethod(
        'hire', {
            http: {
                path: '/hire',
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
    )
    UserStats.remoteMethod(
        'fire', {
            http: {
                path: '/fire',
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
    )
    UserStats.remoteMethod(
        'updateIndustry', {
            http: {
                path: '/updateIndustry',
                verb: 'Post'
            },
            accepts: [{
                arg: 'jobId',
                type: 'string'
            },{
                arg: 'industryAve',
                type: 'string'
            }],
            returns: {
                root: true,
                type: 'object'
            }
        }
    )
}