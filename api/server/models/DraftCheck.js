var https = require("https");
var request = require('request');
var unirest = require("unirest");
var _ = require('lodash');
var jobDescription = 'Accenture helps leading Automotive and Industrial companies drive superior performance in their global and complex supply chains to deliver products to their customers.  We offer a comprehensive suite of capabilities in the supply chain space including defining and implementing operating capabilities across the long, medium and short term planning horizons as well as demonstrating advanced technologies to enable these complex yet integrated functions. ';


module.exports = function(DraftCheck) {
  DraftCheck.checkDraft = function(jobDescription, userId, userName, draftSource, draftId, jobCategory, roleName, marketSource, next) {
    console.log(jobDescription);
    

    var postAnalysisFunc = (draftAnalysis) => {

      var draftScoring = {
        overall_score: draftAnalysis.overall_score,
        phrasing_score: draftAnalysis.phrasing_score,
        phrasing_pos: draftAnalysis.phrasing_pos,
        phrasing_neg: draftAnalysis.phrasing_neg,
        factors_score: draftAnalysis.factors_score,
        factors_pos: draftAnalysis.factors_pos,
        factors_neg: draftAnalysis.factors_neg,
        genderscore: draftAnalysis.genderscore,
        jargon: draftAnalysis.jargon,
        attributes: draftAnalysis.strengthsAndWeaknesses
      };
      console.log(draftAnalysis.strengthsAndWeaknesses)
      var genderscore = parseInt(draftAnalysis.masculineTerms) - parseInt(draftAnalysis.feminineTerms)
      console.log(genderscore);
      if (genderscore > 0) { //Gets female bias
        if (genderscore < 2) {
          draftScoring.genderscore = "Slightly Female Biased"
        }
        else if (genderscore < 4) {
          draftScoring.genderscore = "Female Biased"
        }
        else {
          draftScoring.genderscore = "Very Female Biased"
        }
      }
      else if (genderscore < 0) { //gets male bias
        if (genderscore > -2) {
          draftScoring.genderscore = "Slightly Male Biased"
        }
        else if (genderscore > -4) {
          draftScoring.genderscore = "Male Biased"
        }
        else {
          draftScoring.genderscore = "Very Male Biased"
        }
      }
      else { //gender neutral
        draftScoring.genderscore = "Gender Neutral"
      }
      DraftCheck.create({
        jobDescription: jobDescription,
        draftSource: draftSource,
        marketSource: marketSource,
        draftId: draftId,
        draftSourceUserId: userId,
        draftSourceUser: userName,
        foundStrenghtsandWeaknesses: draftAnalysis.strengthsAndWeaknesses,
        jobCategory: jobCategory,
        roleName: roleName
      }, function(err, draftPost) {
        if (err) {
          next(err);
        }
        else {
          console.log(draftPost);
          next(err, draftScoring);
        }

      });
    }
    request.post(
            {
                url: "https://job-post-analyzer-taureandyeratl.c9users.io/",
                body: {"description": jobDescription},
                json: true,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
            },
            function(error, response, body) {
            
                if (error) {
                    response.status(400).send(error);
                } else {
                    console.log(response.body);
                    postAnalysisFunc(response.body);
                }
            });
  };


  DraftCheck.remoteMethod(
    'checkDraft', {
      http: {
        path: '/checkDraft',
        verb: 'Post'
      },
      accepts: [{
        arg: 'jobDescription',
        type: 'string'
      }, {
        arg: 'userId',
        type: 'string'
      }, {
        arg: 'userName',
        type: 'string'
      }, {
        arg: 'draftSource',
        type: 'string'
      }, {
        arg: 'draftId',
        type: 'string'
      }, {
        arg: 'jobCategory',
        type: 'string'
      }, {
        arg: 'roleName',
        type: 'string'
      }, {
        arg: 'marketSource',
        type: 'array'
      }],
      returns: {
        arg: 'scores',
        type: 'string'
      }
    }
  );
}