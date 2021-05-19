
// Use D3 fetch to read the JSON file
d3.json("samples.json").then((importedData) => {
  //console.log(importedData);
  var data = importedData;

  // Get the list of sample ids
  var sampleid = data.samples.map(row=>row.id)
  //console.log(sampleid)

  // Insert the sample ids into the dropdown
  var sel = document.getElementById('selDataset');
  for(var i = 0; i < sampleid.length; i++) {
      var opt = sampleid[i];
      var el = document.createElement("option")
      el.textContent = opt;
      el.value = opt;
      sel.appendChild(el);
  };

// Call updatePlotly() when a change takes place to the DOM
 d3.selectAll("#selDataset").on("change", updatePlotly);
  //This function is called when a dropdown menu item is selected
 function updatePlotly() {
    // Use D3 to select the dropdown menu
   var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
   var dataset = dropdownMenu.property("value");
  
   // Create a loop to check through the list of sample id to get relevant x and y values
   for(var i=0; i<sampleid.length; i++){
   if(dataset === data.samples[i].id) {
     // Reverse and slice the data to get the first 10
     x = data.samples[i].sample_values.slice(0,10).reverse();
     yy = data.samples[i].otu_ids.slice(0,10).reverse()
     // Insert OTU in front of otu ids to use as labels
     y = yy.map(y => "OTU " + y)
     // Get otu ids and sample values for bubble chart
     x1 = data.samples[i].otu_ids
     y1 = data.samples[i].sample_values
     sample_values = data.samples[i].sample_values
     otuids = data.samples[i].otu_ids
     text = data.samples[i].otu_labels
     // Insert metadata into a variable
     metadata = data.metadata[i]
     // Insert wash frequncy into a variable
     wfreq = data.metadata[i].wfreq
      
    }
     }
    

  // Select the panel to insert the metadata information
  var panel = d3.select('#sample-metadata')
  // Clear html 
  panel.html("");
  // Get key value for the metadata panel
  Object.entries(metadata).forEach(([key, value]) => {
      var li = panel.append("div").text(`${key}: ${value}`);
  })

    
   
// Create trace1 for bar graph
  var trace1 = {
    y: y,
    x: x,
    text: text,
    type: "bar",
    orientation: "h"
 }

// Create trace2 for bubble graph
 var trace2 = {
  y: y1,
  x: x1,
  text : text,
  mode: "markers",
  marker : {
    size : sample_values,
    color: otuids,
    
  }
}

// Create trace for gauge chart
  var traceGauge = {
    type: 'pie',
    showlegend: false,
    hole: 0.4,
    rotation: 90,
    values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
    text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
    direction: 'clockwise',
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: ['#f8f3ec','#f4f1e4','#e9e6c9','#e5e8b0','#d5e59a','#b7cd8f','#8ac086','#89bc8d','#84b589','white'],
      labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
      
    }
  }

  // Create a needle for the gauge chart
  var angle = 180/(9/wfreq)
  var degrees = angle, radius = 0
  var radians = degrees * Math.PI / 180
  var x = -1*radius * Math.cos(radians)
  var y = radius * Math.sin(radians)

  // Create layout for gauge chart
  var gaugeLayout = {
    shapes: [{
      type: 'line',
      x0: 0.5,
      y0: 0.5,
      x1: x,
      y1: 0.5,
      line: {
        color: 'red',
        width: 3
      }
    }],
    title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
    xaxis: {visible: false, range: [-1, 1]},
    yaxis: {visible: false, range: [-1, 1]}
  }

// Assign traces into varaibles
  var dataGauge = [traceGauge]
  var chartData = [trace1];
  var chartData1 = [trace2];
 
//Plot the charts
  Plotly.newPlot("bar", chartData);
  Plotly.newPlot("bubble",chartData1 );
  Plotly.newPlot("gauge", dataGauge, gaugeLayout)




}});


  