// Make-Sankey JS
// http://bl.ocks.org/d3noob/5028304
/*global $*/
/*global d3*/
/*global CanvasJS*/
// Resize to Fit Screen Event Listener
window.addEventListener("resize", getData);

// Call for Resizes
function getData() {
    var token = window.location.search.substr("?token=".length);

    // Clears
    document.getElementById('wage').innerHTML = "";

    // adding wages visualization
    // showWages('/wages/' + jobId + '/wageChart','wage');
    postServerAndShowWages(
        //'https://atl-htpg-taureandyeratl.c9users.io/api/JobStats/shareWage', 
        'api/JobStats/shareWage',
        token);
}

getData(); // init build

function showWages(pathJson, wageId) {
    // alert(pathJson);
    // load the data
    d3.json(pathJson, function(error, data) {

        //alert(data);
        //var datajson = JSON.parse(data);
        //alert("data:"+datajson);
        //console.log(datajson);

        var chart = new CanvasJS.Chart("wage", data);
        chart.render();
    });
}

function postServerAndShowWages(apiEndPoint, token) {
    d3.xhr(apiEndPoint).header("Content-Type", "application/json")
        .post(
            JSON.stringify({
                token: token
            }),
            function(err, rawData) {
                if (!err) {
                    var data = JSON.parse(rawData.response);
                    //console.log("got response", data);
                    var chart = new CanvasJS.Chart("wage", data);
                    chart.render();
                }else{
                    console.log(err)
                }
            }
        );
}
    