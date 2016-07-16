module.exports = function(Job) {
    Job.formJob = function(jobCategory, jobProject, jobDescription, markets, jobId, userId, skills, roleName, internalProficiency, externalProficiency, draftId, source, next){
        var sourceMarkets = markets.split(",");
        var sourceSkills = skills.split(",");
        var jobData =
        {
            jobCategory: jobCategory,
            jobProject: jobProject,
            postedJobDescription: jobDescription,
            postedMarkets: sourceMarkets,
            jobPostSourceId: jobId,
            posterId: userId,
            skillsRequired: sourceSkills,
            roleName:roleName,
            internalProficiency: internalProficiency,
            externalProficiency: externalProficiency,
            source: source,
            draftId: draftId
        }
        Job.app.models.DraftCheck.checkDraft(jobDescription, userId, null, source, draftId, jobCategory, roleName, null, function(err, check){
            if(err){
                console.log("error")
                return next(err);
            }else{
                
                Job.create(jobData, function(err, posted){
                    if(err){
                        console.log("error in saving job data: "+err);
                        next(err);
                    }else{
                        console.log("Job data saved: ");
                        console.log(posted);
                        var stats= {
                            jobDescriptionScore: check.overall_score,
                            genderBias: check.genderscore,
                            strengthsAndWeaknesses: check.strengthsAndWeaknesses,
                            maleCount: 0,
                            femaleCount: 0,
                            jobCategory: posted.jobCategory,
                            ExpectedJobCategoryPercent: 0,
                            maleMin: 99999,
                            maleMax: 0,
                            femaleMin: 99999,
                            femaleMax: 0,
                            maleAve: 0,
                            femaleAve: 0,
                            industrySalary: 0,//TODO: get BLS data on industry ave
                            industryAve: 0, 
                            internalProficiency: posted.internalProficiency,
                            externalProficiency: posted.externalProficiency,
                            skills: posted.sourceSkills,
                            applicantCount: 0,
                            sourceJobId: posted.jobPostSourceId,
                            jobId: posted.id
                        }
                        Job.app.models.JobStats.create(stats, function(err, jobstats) {
                            if (err) {
                                console.log(err)
                                return next(err);
                            }else{
                                console.log(jobstats);
                                Job.app.models.DraftCheck.updateAll({where: {"draftId": draftId}}, {"jobId": posted.id}, function(err, drafts){
                                    if (err) {
                                        console.log(err)
                                        return next(err);
                                    }else{
                                        console.log(drafts);
                                        return next(null, posted);
                                    }
                                })
                            }
                        });
                        
                        //Write function to relate draftchecks to job
                        //next(null, posted);
                    }
                })
            }
        });
        
    },
    
    
    Job.remoteMethod(
        'formJob', {
            http: {
                path: '/newJob',
                verb: 'Post'
            },
            accepts: [{
                arg: 'jobCategory',
                type: 'string'
            }, {
                arg: 'jobProject',
                type: 'string'
            },{
                arg: 'jobDescription',
                type: 'string'
            }, {
                arg: 'markets',
                type: 'string'
            }, {
                arg: 'jobId',
                type: 'string'
            }, {
                arg: 'userId',
                type: 'string'
            }, {
                arg: 'skills',
                type: 'string'
            }, {
                arg: 'roleName',
                type: 'string'
            }, {
                arg: 'internalProficiency',
                type: 'string'
            }, {
                arg: 'externalProficiency',
                type: 'string'
            }, {
                arg: 'draftId',
                type: 'string'
            }, {
                arg: 'source',
                type: 'string'
            }],
            returns: {arg: 'Job transmitted:', type: 'string'}
        }
    );
}
