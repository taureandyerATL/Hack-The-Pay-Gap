// Sankey JS
// http://bl.ocks.org/d3noob/5028304

// Sankey Viz
//var CanvasJS =require("http://canvasjs.com/assets/script/canvasjs.min.js");
window.onload = function () {
	CanvasJS.addColorSet("shades",
                [//colorSet Array

                "#F59AF2",
                "#9AC4F5",
                "#2E8B57",
                "#3CB371",
                "#90EE90"                
                ]);
	var chart = new CanvasJS.Chart("wage", sharedData
	/*{
  "colorSet": "shades",
  "title": {
    "text": "Wage Percentiles of Applicants for This Job by Gender "
  },
  "axisY": {
    "includeZero": false,
    "title": "National Income Percentile",
    "interval": 10,
    "gridThickness": 0,
    "minimum": 0,
    "maximum": 100,
    "stripLines": [
      {
        "value": 0,
        "color": "rgb(242,171,116)",
        "label": "Indusry Average: 0%",
        "labelFontColor": "black",
        "showOnTop": true
      }
    ]
  },
  "axisX": {
    "interval": 10
  },
  "data": [
    {
      "type": "rangeBar",
      "showInLegend": true,
      "yValueFormatString": "#0",
      "legendText": "Wage Percentiles by Gender",
      "dataPoints": [
        {
          "x": 10,
          "y": [
            53.666666666666664,
            76.36363636363636
          ]
        },
        {
          "x": 10,
          "y": [
            64.51515151515152,
            65.51515151515152
          ],
          "label": "Female"
        },
        {
          "x": 20,
          "y": [
            53.666666666666664,
            76.36363636363636
          ]
        },
        {
          "x": 20,
          "y": [
            64.51515151515152,
            65.51515151515152
          ],
          "label": "Male"
        }
      ]
    }
  ]
}*/
	);
	chart.render();
	
	

}