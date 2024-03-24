// JS code by Morgan, 2024

//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){
    //map frame dimensions
    var width = 960,
        height = 460;

    //create new svg container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    //create Albers equal area conic projection centered on France
    // var projection = d3.geoAlbers()
    //     .center([0, 46.2])
    //     .rotate([-2, 0, 0])
    //     .parallels([43, 62])
    //     .scale(2500)
    //     .translate([width / 2, height / 2]);

    var projection = d3.geoAlbers()
        .center([0, 9.96])
        .rotate([-8.09, 0.00, 0])
        .parallels([8.18, 32.22])
        .scale(2000)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

         
    //use Promise.all to parallelize asynchronous data loading
    var promises = [d3.csv("data/NGA_Poverty_Data.csv"),                    
                    d3.json("data/NGA_Region.topojson"),                    
                    d3.json("data/NGA_States.topojson")                   
                    ];    
    Promise.all(promises).then(callback);

function callback(data) {
    var csvData = data[0],
        region = data[1],
        states = data[2];
    
    var regionCountries = topojson.feature(region, region.objects.NGA_Region),
        nigerianStates = topojson.feature(states, states.objects.NGA_States);
    

      //create graticule generator
    var graticule = d3.geoGraticule()
      .step([5, 5]); //place graticule lines every 5 degrees of longitude and latitude
    //create graticule background
    var gratBackground = map.append("path")
        .datum(graticule.outline()) //bind graticule background
        .attr("class", "gratBackground") //assign class for styling
        .attr("d", path) //project graticule
    //create graticule lines
    var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
        .data(graticule.lines()) //bind graticule lines to each element to be created
        .enter() //create an element for each datum
        .append("path") //append each element to the svg as a path element
        .attr("class", "gratLines") //assign class for styling
        .attr("d", path); //project graticule lines          

    //add African countries to map
    var countries = map.append("path")
        .datum(regionCountries)
        .attr("class", "countries")
        .attr("d", path);

    // testing states data
    // var nga_states = map.append("path")
    //     .datum(nigerianStates)
    //     .attr("class", "states")
    //     .attr("d", path);

    //add Nigerian regions to map
    var regions = map.selectAll(".regions")
        .data(nigerianStates.features)
        .enter()
        .append("path")
        .attr("class", function(d){
            return "region " + d.properties.State_Name;
        })
        .attr("d", path);
  

    console.log(csvData);
    console.log(regionCountries);
    console.log(nigerianStates);

    };
};