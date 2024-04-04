// Define the sample URL
const sample_url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch JSON file and define updateChart function within the callback
d3.json(sample_url).then(function(data) {
  // Log the data to verify
  console.log(data);
});



//Create a horizontal bar chart with a dropdown menu to display the
//top 10 OTUs found in that individual.
// Define the updateChart function
function updateChart(data, sample) {
  // Filter the data for the selected sample
  const sampleData = data.samples.find(s => s.id === sample);

  // Extract the top 10 OTUs and corresponding values
  const top10OTUs = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
  const top10Values = sampleData.sample_values.slice(0, 10).reverse();
  const top10Labels = sampleData.otu_labels.slice(0, 10).reverse();

  // Create the trace for the bar chart
  const trace = {
    x: top10Values,
    y: top10OTUs,
    text: top10Labels,
    type: 'bar',
    orientation: 'h'
  };

  // Create the data array
  const plotData = [trace];

  // Define the layout
  const layout = {
    title: `Top 10 OTUs for Sample ${sample}`,
    xaxis: { title: 'Sample Values' },
    yaxis: { title: 'OTU ID' }
  };

  // Plot the chart
  Plotly.newPlot('bar', plotData, layout);
}

// Fetch JSON file and define updateChart function within the callback
d3.json(sample_url).then(function(responseData) {
  // Log the data to verify
  console.log(responseData);

  // Assign the fetched data to the global variable 'data'
  window.data = responseData;

  // Initialize the chart with data for the first sample
  updateChart(data, data.names[0]);

  // Create a dropdown menu to select different samples
  const dropdown = d3.select('#selDataset');
  data.names.forEach(sample => {
    dropdown.append('option').text(sample).property('value', sample);
  });
});

// Define an event handler for the dropdown menu
function optionChanged(sample) {
  updateChart(window.data, sample);
}



//Create a bubble chart that displays each sample.
// Define the updateBubbleChart function
function updateBubbleChart(data, sample) {
  // Filter the data for the selected sample
  const sampleData = data.samples.find(s => s.id === sample);

  // Create the trace for the bubble chart
  const trace = {
    x: sampleData.otu_ids,
    y: sampleData.sample_values,
    text: sampleData.otu_labels,
    mode: 'markers',
    marker: {
      size: sampleData.sample_values,
      color: sampleData.otu_ids,
      colorscale: 'Earth',
      opacity: 0.6
    }
  };

  // Create the data array
  const plotData = [trace];

  // Define the layout
  const layout = {
    title: `Bubble Chart for Sample ${sample}`,
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Values' }
  };

  // Plot the chart
  Plotly.newPlot('bubble', plotData, layout);
}

// Fetch JSON file and define updateBubbleChart function within the callback
d3.json(sample_url).then(function(data) {
  // Log the data to verify
  console.log(data);

  // Initialize the bubble chart with data for the first sample
  updateBubbleChart(data, data.names[0]);

  // Create a dropdown menu to select different samples
  const dropdown = d3.select('#selDataset');
  data.names.forEach(sample => {
    dropdown.append('option').text(sample).property('value', sample);
  });

  // Define an event handler for the dropdown menu
  dropdown.on("change", function() {
    const selectedSample = dropdown.property("value");
    updateBubbleChart(data, selectedSample);
  });
});



//Display the sample metadata, i.e., an individual's demographic information.
//Display each key-value pair from the metadata JSON object somewhere on the page.
// Fetch JSON file and define updateChart function within the callback
d3.json(sample_url).then(function(data) {
  // Log the data to verify
  console.log(data);

  // Initialize the chart with data for the first sample
  updateChart(data, data.names[0]);
  // Initialize the bubble chart with data for the first sample
  updateBubbleChart(data, data.names[0]);
  // Display sample metadata for the first sample
  displayMetadata(data, data.names[0]);

  // Create a dropdown menu to select different samples
  const dropdown = d3.select('#selDataset');
  data.names.forEach(sample => {
    dropdown.append('option').text(sample).property('value', sample);
  });
});

// Define an event handler for the dropdown menu
function optionChanged(sample) {
  updateChart(data, sample);
  updateBubbleChart(data, sample);
  displayMetadata(data, sample);
}

// Define a function to display sample metadata
function displayMetadata(data, sample) {
  // Find the metadata for the selected sample
  const metadata = data.metadata.find(obj => obj.id === parseInt(sample));

  // Select the HTML element to display metadata
  const metadataInfo = d3.select('#sample-metadata');

  // Clear existing metadata
  metadataInfo.html('');

  // Iterate through metadata object and display each key-value pair
  Object.entries(metadata).forEach(([key, value]) => {
    metadataInfo.append('p').text(`${key}: ${value}`);
  });
}
