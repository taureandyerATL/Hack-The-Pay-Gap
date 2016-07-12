/*
        JobStats
            -maleCount
            -femaleCount
            -ExpectedJobCategoryPercent
            -maleMin
            -maleMax
            -femaleMin
            -femaleMax
            -maleAve
            -femaleAve
            -industryAve
            -expertise?
            -skills
            -relJob
            -applicantCount
            -lastUpdate
        */
module.exports = function(JobStats) {
    JobStats.newApplicant= function(percentile, jobId, gender){
        console.log(jobId);
        JobStats.findOne({where: {"jobId": jobId}}, function(err, stats){
            if(err){
                console.log("Error finding JobStats:");
                console.log(err);
                return;
            }else{
                //use gender to determine stats
                console.log(stats)
                if(gender == "male"){
                    if(percentile < stats.maleMin){
                        stats.maleMin = percentile;
                    }
                    if(percentile > stats.maleMax){
                        stats.maleMax = percentile;
                    }
                    stats.maleAve = ((stats.maleAve*stats.maleCount)+percentile)/(stats.maleCount+1) //new average
                    stats.maleCount += 1;
                    stats.applicantCount += 1;
                }else if(gender == "female"){
                    if(percentile < stats.femaleMin){
                        stats.femaleMin = percentile;
                    }
                    if(percentile > stats.femaleMax){
                        stats.femaleMax = percentile;
                    }
                    stats.femaleAve = ((stats.femaleAve*stats.femaleCount)+percentile)/(stats.femaleCount+1) //new average
                    stats.femaleCount += 1;
                    stats.applicantCount += 1;
                }else{
                    console.log("no gender, no updates");
                }
                JobStats.upsert(stats, function(err, updatedStats){
                    if(err){
                        console.log("bad update of JobStats: ");
                        console.log(err)
                        return;
                    }else{
                        console.log("updated app");
                        console.log(updatedStats);
                        return;
                    }
                });
            }
        });
    }
    
    JobStats.getApplicantStats= function(jobId, next){
    }
    JobStats.getJSON = function(jobId, next){
        /*
        1. get female stats
        2. get male stats
        3. save to data in json Object formed to Sankey json
        */
        var stats = {}
        var genders= ["male","female"];
        var progress = ["applied", "shortlisted", "offered", "hired"];
        //build sankey
        var sankeyJson = {};
        sankeyJson.links = [];
        sankeyJson.nodes = [];
        //initial applications
        sankeyJson.nodes.push({"name": "applications"});
        genders.forEach(function(gender){
            var lastState = "";
            var lastProgress = "";
            progress.forEach(function(state){
                if(state == "applied"){
                    lastProgress = "Applications";
                }
                var getProgress = {};
                getProgress[state] = 1;
                JobStats.app.models.ProjectApplication.Count({where: {and:[{"sourceJobId": jobId}, {"gender": gender},getProgress]}}, function(err, count){
                    if(err){
                        console.log("Error getting " + gender + " who " + state);
                        console.log(err);
                        next(err)
                        return;
                    }else{
                        if(!count){
                            
                        }else{
                            var name = state + " ("+gender+")";
                            var node = {"name": name};
                            sankeyJson.nodes.push(node);
                            sankeyJson.links.push({ "source": lastProgress, "target": state + " ("+gender+")", "value": count });
                        }
                        //get last info
                        
                        
                        lastProgress = state + " ("+gender+")";
                        lastState = state;
                    }
                });
            });
        });
        console.log(sankeyJson);
        next(null, sankeyJson);
        
                        /*if(state != "hired"){
                            var whenDropped = {}
                            whenDropped[progress[progress.indexOf(state)+1]] = null;
                            JobStats.app.models.ProjectApplication.Count({where: {and:[{"sourceJobId": jobId}, {"gender": gender},getProgress, whenDropped, {"dropped": 1}]}}, function(err, gone){
                                if(err){
                                    console.log("Error getting withdrawn of " + gender + " who " + state);
                                    console.log(err);
                                    next(err)
                                    return;
                                }else{
                                    sankeyJson.nodes.push({"name": "withdrawn after: "+ state});
                                    sankeyJson.links.push({ "source": lastProgress, "target": "withdrawn after: "+ state, "value": count });
                                }
                            });
                        }*/
            /*JobStats.app.models.ProjectApplication.Count({where: {and:[{"sourceJobId": jobId}, {"gender": gender},{"applied": 1}]}}, function(err, count){
                if(err){
                    console.log("Error getting " + gender + " who applied")
                }
            });
                
            JobStats.app.models.ProjectApplication.Count({where: {and:[{"sourceJobId": jobId}, {"gender": gender},{"shortlisted": 1}]}}, function(err, droppedApplied){
                console.log("Error getting " + gender + " who applied")
            });
            JobStats.app.models.ProjectApplication.Count({where: {and:[{"sourceJobId": jobId}, {"gender": gender},{"offered": 1}]}}, function(err, droppedApplied){
                
            });
            //Get those who were dropped
            JobStats.app.models.ProjectApplication.Count({where: {and:[{"sourceJobId": jobId}, {"gender": gender},{"applied": 1},{"shortlisted": null}, {"dropped": 1}]}}, function(err, droppedApplied){
                
            });
            JobStats.app.models.ProjectApplication.Count({where: {and:[{"sourceJobId": jobId}, {"gender": gender},{"shortlisted": 1},{"offered": null}, {"dropped": 1}]}}, function(err, droppedApplied){
                
            });
            JobStats.app.models.ProjectApplication.Count({where: {and:[{"sourceJobId": jobId}, {"gender": gender},{"offered": 1},{"hired": null}{"dropped": 1}]}}, function(err, droppedApplied){
                
            });*/
        
        
    }
    JobStats.getSankey= function(jobId, next){
        var sankey = {
            "links": [
                { "source": "Applications", "target": "Applicants (Unknown Gender)", "value": "200" },
                { "source": "Applications", "target": "Applicants (Male)", "value": "600" },
                { "source": "Applications", "target": "Applicants (Female)", "value": "300" },
                
                { "source": "Applicants (Unknown Gender)", "target": "Merit Shortlist (Unknown Gender)", "value": "150" },
                { "source": "Applicants (Male)", "target": "Merit Shortlist (Male)", "value": "300" },
                { "source": "Applicants (Female)", "target": "Merit Shortlist (Female)", "value": "160" },

                { "source": "Applicants (Unknown Gender)", "target": "Dropped Phase One", "value": "50" },
                { "source": "Applicants (Male)", "target": "Dropped Phase One", "value": "300" },
                { "source": "Applicants (Female)", "target": "Dropped Phase One", "value": "140" },
    
                { "source": "Merit Shortlist (Unknown Gender)", "target": "Dropped Phase Two", "value": "20" },
                { "source": "Merit Shortlist (Male)", "target": "Dropped Phase Two", "value": "120" },
                { "source": "Merit Shortlist (Female)", "target": "Dropped Phase Two", "value": "70" },
        
                { "source": "Merit Shortlist (Unknown Gender)", "target": "Offered (Unknown Gender)", "value": "20" },
                { "source": "Merit Shortlist (Male)", "target": "Offered (Male)", "value": "90" },
                { "source": "Merit Shortlist (Female)", "target": "Offered (Female)", "value": "50" },
        
                { "source": "Offered (Unknown Gender)", "target": "Hired (Unknown Gender)", "value": "10" },
                { "source": "Offered (Male)", "target": "Male Hires", "value": "60" },
                { "source": "Offered (Female)", "target": "Female Hires", "value": "30" },
        
                { "source": "Offered (Unknown Gender)", "target": "Dropped Phase Three", "value": "20" },
                { "source": "Offered (Male)", "target": "Dropped Phase Three", "value": "20" },
                { "source": "Offered (Female)", "target": "Dropped Phase Three", "value": "10" },
        
                { "source": "Hired (Unknown Gender)", "target": "Hired Total", "value": "10" },
                { "source": "Male Hires", "target": "Hired Total", "value": "40" },
                { "source": "Female Hires", "target": "Hired Total", "value": "20" }
            ],
            "nodes": [
                { "name": "Applications" },
                { "name": "Hired Total" },
                { "name": "Applicants (Male)" },
                { "name": "Applicants (Female)" },
                { "name": "Applicants (Unknown Gender)" },
                { "name": "Merit Shortlist (Male)" },
                { "name": "Merit Shortlist (Female)" },
                { "name": "Merit Shortlist (Unknown Gender)" },
                { "name": "Offered (Male)" },
                { "name": "Offered (Female)" },
                { "name": "Offered (Unknown Gender)" },
                { "name": "Male Hires" },
                { "name": "Female Hires" },
                { "name": "Hired (Unknown Gender)" },
                { "name": "Dropped Phase One" },
                { "name": "Dropped Phase Two" },
                { "name": "Dropped Phase Three" }
            ]
        };
        next(null, sankey);
        return;
    }
    JobStats.buildSankey = function(stats){
        var sankey = {
            "links": [
                { "source": "Applications", "target": "Applicants (Unknown Gender)", "value": "200" },
                { "source": "Applications", "target": "Applicants (Male)", "value": "600" },
                { "source": "Applications", "target": "Applicants (Female)", "value": "300" },
                
                { "source": "Applicants (Unknown Gender)", "target": "Merit Shortlist (Unknown Gender)", "value": "150" },
                { "source": "Applicants (Male)", "target": "Merit Shortlist (Male)", "value": "300" },
                { "source": "Applicants (Female)", "target": "Merit Shortlist (Female)", "value": "160" },

                { "source": "Applicants (Unknown Gender)", "target": "Dropped Phase One", "value": "50" },
                { "source": "Applicants (Male)", "target": "Dropped Phase One", "value": "300" },
                { "source": "Applicants (Female)", "target": "Dropped Phase One", "value": "140" },
    
                { "source": "Merit Shortlist (Unknown Gender)", "target": "Dropped Phase Two", "value": "20" },
                { "source": "Merit Shortlist (Male)", "target": "Dropped Phase Two", "value": "120" },
                { "source": "Merit Shortlist (Female)", "target": "Dropped Phase Two", "value": "70" },
        
                { "source": "Merit Shortlist (Unknown Gender)", "target": "Offered (Unknown Gender)", "value": "20" },
                { "source": "Merit Shortlist (Male)", "target": "Offered (Male)", "value": "90" },
                { "source": "Merit Shortlist (Female)", "target": "Offered (Female)", "value": "50" },
        
                { "source": "Offered (Unknown Gender)", "target": "Hired (Unknown Gender)", "value": "10" },
                { "source": "Offered (Male)", "target": "Male Hires", "value": "60" },
                { "source": "Offered (Female)", "target": "Female Hires", "value": "30" },
        
                { "source": "Offered (Unknown Gender)", "target": "Dropped Phase Three", "value": "20" },
                { "source": "Offered (Male)", "target": "Dropped Phase Three", "value": "20" },
                { "source": "Offered (Female)", "target": "Dropped Phase Three", "value": "10" },
        
                { "source": "Hired (Unknown Gender)", "target": "Hired Total", "value": "10" },
                { "source": "Male Hires", "target": "Hired Total", "value": "40" },
                { "source": "Female Hires", "target": "Hired Total", "value": "20" }
            ],
            "nodes": [
                { "name": "Applications" },
                { "name": "Hired Total" },
                { "name": "Applicants (Male)" },
                { "name": "Applicants (Female)" },
                { "name": "Applicants (Unknown Gender)" },
                { "name": "Merit Shortlist (Male)" },
                { "name": "Merit Shortlist (Female)" },
                { "name": "Merit Shortlist (Unknown Gender)" },
                { "name": "Offered (Male)" },
                { "name": "Offered (Female)" },
                { "name": "Offered (Unknown Gender)" },
                { "name": "Male Hires" },
                { "name": "Female Hires" },
                { "name": "Hired (Unknown Gender)" },
                { "name": "Dropped Phase One" },
                { "name": "Dropped Phase Two" },
                { "name": "Dropped Phase Three" }
            ]
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
        'getJSON', {
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
}