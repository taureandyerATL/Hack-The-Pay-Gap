var https = require("https");
var request = require('request');
var _ = require('lodash');
var slimer = require('slimer');

/*FOR TEXTIO TO WORK*/
var steps=[];
var testindex = 0;
var loadInProgress = false;//This is set to true when a page is still loading
var sessionIdReceived = false, authorizationTokenReceived = false, versionReceived = false;
var documentIdReceived = false, changeNumReceived = false, docSessionIDReceived = false;
var SESSION_ID, AUTHORIZATION_TOKEN, VERSION, DOCUMENT_ID, CHANGE_NUM, DOC_SESSION_ID;
var jobDescription = 'Accenture helps leading Automotive and Industrial companies drive superior performance in their global and complex supply chains to deliver products to their customers.  We offer a comprehensive suite of capabilities in the supply chain space including defining and implementing operating capabilities across the long, medium and short term planning horizons as well as demonstrating advanced technologies to enable these complex yet integrated functions. ';
var textiourl = 'https://textio.com/signin.html';

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
        //var textioData = sendTextio(jobDescription, jobCategory, next);
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
            phrases_masculine: textioResponse.data.document.feature_metadata.phrases_masculine,
            phrases_feminine: textioResponse.data.document.feature_metadata.phrases_feminine,
            jargon: textioResponse.data.document.stats.phrases_jargon_freq,
            attributes: textioResponse.data.document.filtered_factors.generic_scorer
        };
        var genderscore = parseInt(textioResponse.data.document.feature_metadata.phrases_masculine) - parseInt(textioResponse.data.document.feature_metadata.phrases_feminine)
        console.log(genderscore);
        if(genderscore > 0){ //Gets female bias
            if(genderscore < 2){
                draftScoring.genderscore = "Slightly Female Biased"
            }else if(genderscore < 4){
                draftScoring.genderscore = "Female Biased"
            }else{
                draftScoring.genderscore = "Very Female Biased"
            }
        }else if(genderscore < 0 ){ //gets male bias
            if(genderscore > -2){
                draftScoring.genderscore = "Slightly Male Biased"
            }else if(genderscore > -4){
                draftScoring.genderscore = "Male Biased"
            }else{
                draftScoring.genderscore = "Very Male Biased"
            }
        }else { //gender neutral
            draftScoring.genderscore = "Gender Neutral"
        }
        
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
    function sendTextio(jobdescription, next){
        
        /**
        '{
        "title":"",
        "description":"We are looking for someone who has strong testing background, a great sense of humor",
        "changeNum":381,
        "docSessionID":"73617188-5f78-4fc9-b4ab-01ca2d5112ee",
        "document_id":"955a12e4-b7d5-4e28-af42-d381c4e526d1",
        "jobType":"Engineering",
        "client_word_count":52,
        "location":{"shortText":"","fullText":"","placeId":""},
        "document_type":"jobListing",
        "factor_override":null,
        "sessionId":"d4b3d02a-4963-45a4-8ebf-e603f50d989b",
        "queue":"default",
        "authorization":"Basic ZXlKcFlYUWlPakUwTmpVeU9EVXpOamtzSW1WNGNDSTZNVFEy=",
        "version":"9299"
        }';
        **/
        
        
        /*********SETTINGS*********************/
        var webPage = require('webpage');
        var page = webPage.create();
        var page1 = webPage.create();
        
        page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
        page.settings.javascriptEnabled = true;
        page.settings.loadImages = false;  //Script is much faster with this field set to false
        slimer.cookiesEnabled = true;
        slimer.javascriptEnabled = true;
        
        //var fs = require('fs');
        //fs.write('log.html','OPEN','a');
        
        /*********SETTINGS END*****************/
        
        page.onConsoleMessage = function(msg) {
            console.log(msg);
        };
        
        /**********DEFINE STEPS THAT SLIMERJS SHOULD DO***********************/
        steps = [
        	//Step 1 - Open Textio sign in page	
            function(){		
                page.viewportSize = {width: 1280, height: 1024};
        		page.open(textiourl, function (status) {
        				page.evaluate(function(){				
        				document.getElementById('email').value= 'srinivasan.sairam@accenture.com';
        				document.getElementById('password').value='@Accenture1';
        				document.getElementById('signInButton').click();
        			});
        		})
            },
        
        	function() {
        		/*page.open('https://www.textio.com/talent/', function(status) {
        		});*/
        	},
        	
        ];
        
        /**********END STEPS THAT SLIMERJS SHOULD DO***********************/
        
        function removeQuotesAndGetValue(input)
        {
        	// Note: This is not the correct or efficient way:-(
        	
        	// Input would be "version":"9634"} or "version":"9634"
        	// Return value would be 9634
        	var x =input.split(':')[1].substr(1);	//substr is to remove the "
        	var len = x.length;
        	if (x.endsWith('}'))
        		len--;	// to remove the }
        	
        	return(x.substr(0, len-1));	// remove the last "
        }
        
        function getSessionId()
        {		
        	page.onResourceRequested = function(requestData, networkRequest) 
        	{		
        		if (sessionIdReceived == true)
        		return;
        	
        		// get session ID
        		if(JSON.stringify(requestData).indexOf('sessionId') > -1)
        		{
        			var b = requestData.postData.split(',');
        			for (var i=0;i<b.length; i++) {
        				if (b[i].indexOf('sessionId') > -1) {
        					SESSION_ID = removeQuotesAndGetValue(b[i]);
        					sessionIdReceived = true;
        					console.log('Session id is : ' + SESSION_ID); 
        					return;
        				}
        			}
        		}
            };
        }
        
        function getChangeNum()
        {		
        	page.onResourceRequested = function(requestData, networkRequest) 
        	{			
        		if (changeNumReceived == true)
        		return;
        	
        		// get changeNum
        		if(JSON.stringify(requestData).indexOf('changeNum') > -1)
        		{
        			var b = requestData.postData.split(',');
        			for (var i=0;i<b.length; i++) {
        				if (b[i].indexOf('changeNum') > -1) {
        					CHANGE_NUM = removeQuotesAndGetValue(b[i]);
        					changeNumReceived = true;
        					console.log('Change Num is : ' + CHANGE_NUM); 
        					return;
        				}
        			}
        		}
            };
        }
        
        function getDocSessionId()
        {		
        	page.onResourceRequested = function(requestData, networkRequest) 
        	{		
        		if (docSessionIDReceived == true)
        		return;
        	
        		// get doc session ID
        		if(JSON.stringify(requestData).indexOf('docSessionID') > -1)
        		{
        			var b = requestData.postData.split(',');
        			for (var i=0;i<b.length; i++) {
        				if (b[i].indexOf('docSessionID') > -1) {
        					DOC_SESSION_ID = removeQuotesAndGetValue(b[i]);
        					docSessionIDReceived = true;
        					console.log('Doc Session id is : ' + DOC_SESSION_ID); 
        					return;
        				}
        			}
        		}
            };
        }
        
        function getAuthToken()
        {		
        	page.onResourceRequested = function(requestData, networkRequest) 
        	{		
        		if (authorizationTokenReceived == true)
        			return;
        		
        		// get authorization token
        		if(JSON.stringify(requestData).indexOf('authorization') > -1)
        		{			
        			var b = requestData.postData.split(',');
        			for (var i=0;i<b.length; i++) {
        				if (b[i].indexOf('authorization') > -1) {
        					AUTHORIZATION_TOKEN = removeQuotesAndGetValue(b[i]);
        					authorizationTokenReceived = true;
        					console.log('AUTHORIZATION_TOKEN is : ' + AUTHORIZATION_TOKEN);
        					return;
        				}
        			}
        		}
            };
        }
        
        function sendRequest2Textio()
        {
        	var requestPayload = constructRequestPayload();
        	console.log(requestPayload);
        }
        
        function constructRequestPayload()
        {
        	var requestPayload = ' {"title":"",' + 
        	'"description":"' + jobDescription + '",' +
        	'"changeNum":' + CHANGE_NUM + ',' +
        	'"docSessionID":"' + DOC_SESSION_ID +'",' +
        	'"document_id":"' + DOCUMENT_ID + '",' +
        	'"jobType":"Engineering",' +
        	'"client_word_count":52,' +
        	'"location":{"shortText":"","fullText":"","placeId":""},' +
        	'"document_type":"jobListing",' +
        	'"factor_override":null,' +
        	'"sessionId":"' + SESSION_ID + '",' +
        	'"queue":"default",' +
        	'"authorization":"' + AUTHORIZATION_TOKEN + '",' +
        	'"version":"' + VERSION + '"}';	
        	
        	return(requestPayload);
        }
        
        function getVersion()
        {
        	page.onResourceRequested = function(requestData, networkRequest) 
        	{		
        		if (versionReceived == true)
        			return;
        	
        		// get version
        		if(JSON.stringify(requestData).indexOf('version') > -1)
        		{
        			var b = requestData.postData.split(',');
        			for (var i=0;i<b.length; i++) {
        				if (b[i].indexOf('version') > -1) {
        					VERSION = removeQuotesAndGetValue(b[i]);
        					versionReceived = true;
        					console.log('VERSION is : ' + VERSION); 
        					return;
        				}
        			}
        		}
            };
        }
        
        function getDocumentId()
        {		
        	page.onResourceRequested = function(requestData, networkRequest) 
        	{		
        		if (getDocumentIdReceived == true)
        			return;
        	
        		// get version
        		if(JSON.stringify(requestData).indexOf('documentID') > -1)
        		{
        			var b = requestData.postData.split(',');
        			for (var i=0;i<b.length; i++) {
        				if (b[i].indexOf('documentID') > -1) {
        					DOCUMENT_ID = removeQuotesAndGetValue(b[i]);
        					documentIdReceived = true;
        					console.log('documentID is : ' + documentID); 
        					return;
        				}
        			}
        		}
            };
        }
        
        //Execute steps one by one
        interval = setInterval(executeRequestsStepByStep,2000);
        
        function executeRequestsStepByStep(){
            if (loadInProgress == false && typeof steps[testindex] == "function") {
                steps[testindex]();
                testindex++;
            }
        
            if (typeof steps[testindex] != "function") {
        
            }
        }
        
        page.onLoadStarted = function() 
        {
            loadInProgress = true;
        };
        
        page.onLoadFinished = function() 
        {
            loadInProgress = false;
        	
        	// get the session id
        	if (sessionIdReceived == false) 
        		getSessionId();
        	
        	// get the authorization (access) token
        	if (authorizationTokenReceived == false) 
        		getAuthToken();
        	
        	
        	// get version
        	if (versionReceived == false) 
        		getVersion();
        	
        	
        	// get docSessionID
        	if (docSessionIDReceived == false)
        		getDocSessionId();
        	
        	// get changeNum
        	if (changeNumReceived == false)
        		getChangeNum();
        };
        
        page.onResourceRequested = function(requestData, networkRequest) 
        {
        	//fs.write('log.html', 'onResourceRequested - requestData <' + JSON.stringify(requestData, undefined, 4),'a');
        	//fs.write('log.html', 'onResourceRequested - networkRequest <' + JSON.stringify(networkRequest, undefined, 4),'a');
        }
        	
        page.onResourceReceived = function(response) {
            //console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
        	//fs.write('log.html', 'onResourceReceived <' + JSON.stringify(response, undefined, 4),'a');
        	
        	//var mod = page.event.modifier.ctrl;
        	//page.sendEvent('keypress', page.event.key.V, null, null, mod);
        };
        
        page.onConsoleMessage = function(msg) {
            console.log(msg);
        };
    }
    

    DraftCheck.remoteMethod(
        'checkDraft', 
        {
          http: {path: '/checkDraft', verb: 'Post'},
          accepts: [{arg: 'jobDescription', type: 'string'},{arg: 'userId', type: 'string'},{arg: 'userName', type: 'string'},{arg: 'draftSource', type: 'string'},{arg: 'draftId', type: 'string'},{arg: 'jobCategory', type: 'string'},{arg: 'roleName', type: 'string'},{arg: 'marketSource', type: 'array'}],
          returns: {arg: 'scores', type: 'string'}
        }
    );
}