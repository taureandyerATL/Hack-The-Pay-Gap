var steps=[];
var testindex = 0;
var loadInProgress = false;//This is set to true when a page is still loading
var sessionIdReceived = false, authorizationTokenReceived = false, versionReceived = false;
var documentIdReceived = false, changeNumReceived = false, docSessionIDReceived = false;
var SESSION_ID, AUTHORIZATION_TOKEN, VERSION, DOCUMENT_ID, CHANGE_NUM, DOC_SESSION_ID;
var jobDescription = 'Accenture helps leading Automotive and Industrial companies drive superior performance in their global and complex supply chains to deliver products to their customers.  We offer a comprehensive suite of capabilities in the supply chain space including defining and implementing operating capabilities across the long, medium and short term planning horizons as well as demonstrating advanced technologies to enable these complex yet integrated functions. ';
var textiourl = 'https://textio.com/signin.html';
var slimer = require('slimer');

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
				document.getElementById('email').value= 'chris.hawkins@accenture.com';
				document.getElementById('password').value='password1';
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