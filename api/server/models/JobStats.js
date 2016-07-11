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
    
    function getApplicantStats(wage, gender, state, jobCategory, sourcejobId){
        /*var stats= {
            maleCount: 0,
            femaleCount: 0,
            ExpectedJobCategoryPercent: 0,
            maleMin: 0,
            maleMax: 0,
            femaleMin: 0,
            femaleMax: 0,
            maleAve: 0,
            femaleAve: 0,
            industryAve: 0,
            internalProficiency: "",
            externalProficiency: "",
            skills: 
            applicantCount
            lastUpdate
        }
        findOrCreate*/
    }
}