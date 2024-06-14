url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

function demoInfo(TestSubject) {

    d3.json(url).then(function(samplesdata) {

        let TestSubjectInfo = samplesdata.metadata.filter(results => results.id == TestSubject)[0];

        data = d3.select("#sample-metadata")
        //clear after every change in test subject info
        data.html("")

        data.append('tbody').text(`ID: ${TestSubjectInfo.id}`);
        data.append('tbody').text(`ETHNICITY: ${TestSubjectInfo.ethnicity}`);
        data.append('tbody').text(`AGE: ${TestSubjectInfo.age}`);
        data.append('tbody').text(`LOCATION: ${TestSubjectInfo.location}`);
        data.append('tbody').text(`BBTYPE: ${TestSubjectInfo.bbtype}`);
        data.append('tbody').text(`WFREG: ${TestSubjectInfo.wfreq}`);
    })
       
};

//BARGRAPH
function barGraph(TestSubject) {
    d3.json(url).then(function(samplesdata) {
        let limit = 10; 

        let TestSubjectInfo = samplesdata.samples.filter(results => results.id == TestSubject)[0];
    
        let values = TestSubjectInfo.sample_values.slice(0,limit).reverse();
        let ids = TestSubjectInfo.otu_ids.slice(0,limit).map(id => `OTU ${id}`).reverse();
        let labels = TestSubjectInfo.otu_labels.slice(0,limit).reverse();
        let to_plot =[{
            orientation :'h',
            type: 'bar',
            y: ids,
            x: values,
            text: labels
        }];

        let layout = {
            title: `Top 10 Bacteria Cultures Found`,
            xaxis: {
                title: "Number of Bacteria"
            },
            height: 600,
            width: 900
        }

        Plotly.newPlot("bar", to_plot, layout);
    })
};

//Bubble Graph
function bubbleGraph(TestSubject) {
    d3.json(url).then(function(samplesdata) {

        let TestSubjectInfo = samplesdata.samples.filter(results => results.id == TestSubject)[0];

        let values = TestSubjectInfo.sample_values;
        let ids = TestSubjectInfo.otu_ids;
        let labels = TestSubjectInfo.otu_labels;

        let bubble_plot =[{
            x: ids,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                size: values,
                color: ids,
            }
        }];

        let bubble_layout = {
            title: `Bacteria Cultures Per Sample`,
            yaxis: {
                title: "Number of Bacteria"
            },
            xaxis: {
                title: "OTU ID"
            },
            height: 650,
            width: 1550
        }

        
        Plotly.newPlot("bubble", bubble_plot, bubble_layout);
    })
};

function init(){

    let dropdownMenu = d3.select("#selDataset");
    
    d3.json(url).then(function(samplesdata){
        let IDs = samplesdata.names;
        let firstId = IDs[0];
        IDs.forEach(element => {
            dropdownMenu.append("option").text(element).property("value", element);
        });

        barGraph(firstId);
        bubbleGraph(firstId);
        demoInfo(firstId);

    });
}

function optionChanged(selection){

    barGraph(selection);
    bubbleGraph(selection);
    demoInfo(selection);
};

init();
