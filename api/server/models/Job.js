/*
TODO
1. get job data
2. save job data
3. associate jobs and project
4. ensure that you can search for jobs and assocaite people and skills

we have to go form this:

{ jobCategory: 'Web & Mobile Design',
  jobProject: 'Aman\'s cool stuff',
  jobDescription: 'Cool job for Aman\'sproject',
  markets: 'dtb',
  jobId: '5780820cac9d85d8c08922a9',
  userId: 'test',
  skills: 'javascript,node.js,angularjs',
  roleName: 'Back end' }

to this:
{
  "jobCategory": "Web & Mobile Design",
  "jobProject": "Aman's cool stuff",
  "postedJobDescription": "Cool job for Aman's project",
  "postedMarkets": [
    "dtb"
  ],
  "jobId": "5780820cac9d85d8c08922a9",
  "posterId": "test",
  "skillsRequired": [
    "javascript",
    "node.js",
    "angularjs"
  ],
  "roleName": "Back end"
}
*/
module.exports = function(Job) {
    Job.formJob = function(jobCategory, jobProject, jobDescription, markets, jobId, userId, skills, roleName, internalProficiency, externalProficiency, next){
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
            externalProficiency: externalProficiency
        }
        Job.create(jobData, function(err, posted){
            if(err){
                console.log("error in saving job data: "+err);
                next(err,null);
            }else{
                console.log("Job data saved: "+ posted);
                var stats= {
                    maleCount: 0,
                    femaleCount: 0,
                    jobCategory: posted.jobCategory,
                    ExpectedJobCategoryPercent: 0,
                    maleMin: 0,
                    maleMax: 0,
                    femaleMin: 0,
                    femaleMax: 0,
                    maleAve: 0,
                    femaleAve: 0,
                    industrySalary: 0,//TODO: get BLS data on industry ave
                    industryAve: 0, 
                    internalProficiency: posted.internalProficiency,
                    externalProficiency: posted.externalProficiency,
                    skills: posted.sourceSkills,
                    applicantCount: 0,
                    jobId: posted.id
                }
                Job.app.models.JobStats.create(stats, function(err, jobstats) {
                    if (err) {
                        console.log(err)
                        next(err);
                        return;
                    }
                    //projectApp.Applicant(applicant);
                    //applicant.ProjectApplication = projectApp;
                    console.log(jobstats);
                    return;
                });
                //Write function to relate draftchecks to job
                next(null, posted);
            }
        })
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
            }],
            returns: {arg: 'Job transmitted:', type: 'string'}
        }
    );
}
