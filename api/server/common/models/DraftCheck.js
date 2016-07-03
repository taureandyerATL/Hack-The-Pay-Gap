var https = require("https");
var request = require('request');
var _ = require('lodash');

/*FOR TEXTIO TO WORK*/
//var textio = require("./Textio");

module.exports = function(DraftCheck) {
    DraftCheck.checkDraft = function(jobDescription, userId, userName, draftSource, draftId, jobCategory, roleName, marketSource, next){
        /*
            [
                {arg: 'jobDescription', type: 'string'},
                {arg: 'userId', type: 'string'},
                {arg: 'userName', type: 'string'},
                {arg: 'draftSource', type: 'string'},
                {arg: 'draftId', type: 'string'},
                {arg: 'jobCategory', type: 'string'},
                {arg: 'roleName', type: 'string'},
                {arg: 'marketSource', type: 'array'}
            ]
        /*
        1. Create draft schema
        2. Post to textio using 
        */
        console.log(jobDescription);
        //var textioResponse2 = textio(jobDescription, jobCategory, next);
        //console.log(textioResponse2);
        var textioResponse = 
    {
          "metadata": {
            "status": "complete",
            "experience": {
              "level": 1,
              "experienceInLevel": 781
            }
          },
          "data": {
            "document": {
              "industry_index": -0.54,
              "filtered_factors": {
                "generic_scorer": [
                  {
                    "factor": "phrases_jargon_freq",
                    "string_help": "<p>Most people look at a listing for less than ten seconds before deciding whether to explore the listing in detail. During these quick scans, they often key off specific phrases in forming their impression.<\/p><p>Corporate cliches like &ldquo;outside the box&rdquo; and &ldquo;synergistic&rdquo; leave a negative impression with people as they scan job text. Listings like yours that avoid this kind of language have higher engagement and more applicants. Nice work!<\/p>",
                    "label": "positive",
                    "string": "Your job listing avoids corporate cliches. Job seekers are less likely to apply to a listing that's full of business jargon.",
                    "string_short": "Limited corporate cliches"
                  },
                  {
                    "factor": "ratio_2nd_person_pronouns_to_1st_person_pronouns",
                    "string_help": "<p>Great job listings achieve two goals. First, they clearly describe the job and any important hiring qualifications. Second, they tell people why the company is a great place to work. Listings that do both of these get the most attention from job seekers.<\/p><p>Your listing includes a good balance between &lsquo;we&rsquo; statements that describe your company and &lsquo;you&rsquo; statements that directly address job seekers. Applicants respond positively to the kind of balance in your listing. Great job!<\/p>",
                    "label": "positive",
                    "string": "Strong listings balance &lsquo;we&rsquo; statements that describe your company and &lsquo;you&rsquo; statements that directly address job seekers. Your listing strikes a good balance.",
                    "string_short": "Balances &lsquo;we&rsquo; statements and &lsquo;you&rsquo; statements"
                  },
                  {
                    "factor": "normalized_adjective_count",
                    "string_help": "<p>Writing style guides often warn against using too many adjectives, arguing that they make it harder for readers to process the content of sentences. While the jury is still out on this, it does appear that job listings that contain more than 15% adjectives get fewer applicants.<\/p><p>Your listing uses only a few adjectives. This may make it easier for readers to process your content and will get more people to apply for your job. Nice work!<\/p>",
                    "label": "positive",
                    "string": "Your job listing doesn't use too many adjectives. This makes it easier for job seekers to scan and read.",
                    "string_short": "Appropriate use of adjectives"
                  },
                  {
                    "factor": "normalized_verb_count",
                    "string_help": "<p>How you use verbs changes the appeal of your listing. Listings with the highest verb counts have the highest engagement&mdash;using at least 15% verbs is best.<\/p><p>Listings that are heavy on verbs may be more popular because they offer more detailed information about the job. High verb use is especially common in bulleted responsibilities lists.<\/p><p>Your listing has the right mix of verbs and other content. This causes people to spend more time reading your listing and drives up engagement. Nice work!<\/p>",
                    "label": "positive",
                    "string": "Your listing uses a lot of verbs. Listings with a lot of verbs usually offer more detailed information about responsibilities on the job, which causes more people to apply.",
                    "string_short": "Strong use of verbs"
                  },
                  {
                    "factor": "word_count",
                    "string_short": "Listing is too short",
                    "reason": "too_low",
                    "label": "very_negative",
                    "string_help": "<p>Your job listing is competing for the attention of the market's best candidates. With so many potential jobs to check out, some people don't take listings seriously unless they contain enough detail to really understand the job. Job listings that are shorter than 300 words see a significant drop-off in engagement.<\/p><p>Your listing is too short. Include more specifics about the job and more information about your company.<\/p>",
                    "string": "Your listing is too short. Ideal job listings are between 300-750 words.",
                    "string_override": "very_negative_too_low"
                  },
                  {
                    "factor": "bullets_prop",
                    "string_short": "Not enough bulleted content",
                    "reason": "too_low",
                    "label": "very_negative",
                    "string_help": "<p>People form impressions of job listings in just a few seconds and decide whether to read further. Nothing changes their initial impression of a listing more than its visual layout. One of the most important aspects of visual layout is how much of your content is in paragraphs and how much is in bullets.<\/p><p>People respond best to listings with about one third of the content in bulleted lists. To get more people to engage deeply with your listing, take some of your existing paragraph content and present it in bulleted lists. Job qualifications and responsibilities lend themselves especially well to bulleted formatting.<\/p>",
                    "string": "The most successful job postings use bulleted lists for about a third of their content. Your listing does not contain enough bulleted content.",
                    "string_override": "very_negative_too_low"
                  },
                  {
                    "factor": "eoe_statement",
                    "string_help": "<p>Including a strong equal opportunity statement that asserts your company's commitment to fairness and diversity in hiring significantly broadens the appeal of your job listings. Not only do overall applications go up, but strong statements especially drive up candidate diversity.<\/p><p>Even brief equal opportunity statements have an impact on listing engagement and candidate diversity.<\/p>",
                    "label": "negative",
                    "string": "Your job listing does not contain an equal opportunity statement that asserts your company's commitment to fair hiring practices. This narrows the appeal of your posting and drives down engagement.",
                    "string_short": "Missing equal opportunity statement"
                  }
                ],
                "gender_bias_scorer": [
                  
                ]
              },
              "textio_tone": 0,
              "feature_metadata": {
                "phrases_repeat": 0,
                "phrases_pos": 1,
                "phrases_neg": 0,
                "factors_neg": 3,
                "phrases_masculine": 0,
                "factors_pos": 4,
                "phrases_feminine": 0
              },
              "stats": {
                "phrases_jargon_freq": 0,
                "question_mark_count": 0,
                "sentence_count": 4,
                "word_count": 52,
                "phrases_personal_language_freq": 0,
                "ratio_2nd_person_pronouns_to_1st_person_pronouns": 1.5,
                "repeated_phrases_count": 0,
                "normalized_verb_count": 0.15384615384615,
                "bullets_prop": 0,
                "caps_count": 0,
                "exclamation_points_count": 0,
                "phrases_must_freq": 0,
                "phrases_candidate_language_freq": 0,
                "phrases_optimism_freq": 1,
                "normalized_adjective_count": 0.038461538461538,
                "words_per_sentence": 13
              },
              "textio_check": 35
            }
          }
        };
        /*
        TEXTIO SAMPLE RESPONSE
            score = textio_check
            label = 
            factors_score = feature_metadata.factors_pos- feature_metadata.factors_neg
                postive = feature_metadata.factors_pos
                negative = feature_metadata.factors_neg
            phrasing_score = feature_metadata.factors_pos- feature_metadata.factors_neg
                postive = feature_metadata.factors_pos
                negative = feature_metadata.factors_neg
            genderscore: feature_metadata.phrases_masculine - feature_metadata.phrases_feminine
            
            "feature_metadata": {
                "phrases_repeat": 0,
                "phrases_pos": 1,
                "phrases_neg": 0,
                "factors_neg": 3,
                "phrases_masculine": 0,
                "factors_pos": 4,
                "phrases_feminine": 0
              },
              "stats": {
                "phrases_jargon_freq": 0,
                "question_mark_count": 0,
                "sentence_count": 4,
                "word_count": 52,
                "phrases_personal_language_freq": 0,
                "ratio_2nd_person_pronouns_to_1st_person_pronouns": 1.5,
                "repeated_phrases_count": 0,
                "normalized_verb_count": 0.15384615384615,
                "bullets_prop": 0,
                "caps_count": 0,
                "exclamation_points_count": 0,
                "phrases_must_freq": 0,
                "phrases_candidate_language_freq": 0,
                "phrases_optimism_freq": 1,
                "normalized_adjective_count": 0.038461538461538,
                "words_per_sentence": 13
              },
              "textio_check": 35
        */
        var draftScoring = 
        {
            overall_score: textioResponse.data.document.textio_check,
            phrasing_score: textioResponse.data.document.feature_metadata.phrases_pos - textioResponse.data.document.feature_metadata.phrases_neg,
            phrasing_pos: textioResponse.data.document.feature_metadata.phrases_pos,
            phrasing_neg: textioResponse.data.document.feature_metadata.phrases_neg,
            factors_score: textioResponse.data.document.feature_metadata.factors_pos- textioResponse.data.document.feature_metadata.factors_neg,
            factors_pos: textioResponse.data.document.feature_metadata.factors_pos,
            factors_neg: textioResponse.data.document.feature_metadata.factors_neg,
            genderscore: textioResponse.data.document.feature_metadata.phrases_masculine - textioResponse.data.document.feature_metadata.phrases_feminine,
            jargon: textioResponse.data.document.stats.phrases_jargon_freq,
            attributes: textioResponse.data.document.filtered_factors.generic_scorer
        };
        
        DraftCheck.create({
            jobDescription: jobDescription,
            draftSource: draftSource,
            marketSource: marketSource,
            draftId: draftId,
            draftSourceUserId: userId,
            draftSourceUser: userName,
            jobCategory: jobCategory,
            roleName: roleName
        }, function(err, draftPost){
            if (err) {
                next(err);
            } else {
                console.log(draftPost);
                
            }
            next(err, draftScoring);
        });
    }

    DraftCheck.remoteMethod(
        'checkDraft', 
        {
          http: {path: '/checkDraft', verb: 'Post'},
          accepts: [{arg: 'jobDescription', type: 'string'},{arg: 'userId', type: 'string'},{arg: 'userName', type: 'string'},{arg: 'draftSource', type: 'string'},{arg: 'draftId', type: 'string'},{arg: 'jobCategory', type: 'string'},{arg: 'roleName', type: 'string'},{arg: 'marketSource', type: 'array'}],
          returns: {arg: 'scores!', type: 'string'}
        }
    );
}