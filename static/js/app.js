// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata=data.metadata;

    // Filter the metadata for the object with the desired sample number
    nameSelection=metadata.filter(metadata=>metadata.id==sample);
    let name=nameSelection[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let sampleMetadata=d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for(let i=0;i<nameSelection.length;i++){
      let row=nameSelection[i];
      sampleMetadata.append("div").text(`ID: `+row.id);
      sampleMetadata.append("div").text(`ETHNICITY: `+row.ethnicity);
      sampleMetadata.append("div").text(`GENDER: `+row.gender);
      sampleMetadata.append("div").text(`AGE: `+row.age);
      sampleMetadata.append("div").text(`LOCATION: `+row.location);
      sampleMetadata.append("div").text(`BBTYPE: `+row.bbtype);
      sampleMetadata.append("div").text(`WFREQ: `+row.wfreq);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples=data.samples;

    // Filter the samples for the object with the desired sample number
    nameSelection=samples.filter(samples=>samples.id==sample);
    let name=nameSelection[0];

    // Get the otu_ids, otu_labels, and sample_values
    let idArray=name.otu_ids;
    let labelArray=name.otu_labels;
    let valueArray=name.sample_values;

    // Build a Bubble Chart
    let trace1={
      x:idArray,
      y:valueArray,
      text:labelArray,
      mode:'markers',
      marker:{
        size:valueArray,
        color:idArray
      }
    }
    let data1=[trace1];
    let layout1={
      title:"Bacteria Cultures per Sample"
    }

    // Render the Bubble Chart
    Plotly.newPlot("bubble",data1,layout1);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let IDStrings=idArray.map(object=>`OTU ${object}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let sortedValues=valueArray.sort((a,b)=>b-a);
    console.log(sortedValues);
    let slicedValues=sortedValues.slice(0,10);

    let trace2={
      x:IDStrings,
      y:slicedValues,
      text:name.otu_labels.slice(0,10),
      type:"bar"
    }
    let data2=[trace2];
    let layout2={
      title:"Top 10 Bacteria Cultures Found",
      orientation:"vertical"
    }    

    // Render the Bar Chart
    Plotly.newPlot("bar",data2,layout2);
  });
}

// Function to run on page load
function init() {
  let selector=d3.selectAll("#selDataset");
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field
    let names=data.names;

    // Use d3 to select the dropdown with id of `#selDataset`

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for(let i=0;i<names.length;i++){
      let name=names[i];
      selector.append("option").text(name);
    }

    // Get the first sample from the list
    let name=selector.property("value");

    // Build charts and metadata panel with the first sample
    buildCharts(name);
    buildMetadata(name);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
