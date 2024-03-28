// JS code by Morgan, 2024


// Change to local scope
(function(){

    //pseudo-global variables
    var attrArray = ["varA", "varB", "varC", "varD", "varE"]; //list of attributes
    var expressed = attrArray[0]; //initial attribute
    
    //begin script when window loads
    window.onload = setMap();
    

    //set up choropleth map
    function setMap(){
        //map frame dimensions
        var width = window.innerWidth * 0.5,
            height = 460;

        //create new svg container for the map
        var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

        var projection = d3.geoAlbers()
        .center([0, 9.96])
        .rotate([-8.09, 0.00, 0])
        .parallels([8.18, 32.22])
        .scale(2000)
        .translate([width / 2, height / 2]);

        var path = d3.geoPath()
            .projection(projection);

            //use Promise.all to parallelize asynchronous data loading
        var promises = [d3.csv("data/NGA_Poverty_Data2021.csv"),                    
                        d3.json("data/NGA_Region.topojson"),                    
                        d3.json("data/NGA_States.topojson")                   
                        ];    
        Promise.all(promises).then(callback);
    
        function callback(data){    
            var csvData = data[0],
                region = data[1],
                states = data[2];
        
            var regionCountries = topojson.feature(region, region.objects.NGA_Region),
                nigerianStates = topojson.feature(states, states.objects.NGA_States);
            
            //place graticule on the map
            setGraticule(map, path);

            var countries = map.append("path")
                .datum(regionCountries)
                .attr("class", "countries")
                .attr("d", path);

            //join csv data to GeoJSON enumeration units
            nigerianStates = joinData(nigerianStates, csvData);


            //create the color scale
            var colorScale = makeColorScale(csvData);

            //add enumeration units to the map
            setEnumerationUnits(nigerianStates, map, path, colorScale);

            //add coordinated visualization to the map
            setChart(csvData, colorScale);
        };
    }; //end of setMap()

    function setGraticule(map, path){
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
    };

    function joinData(nigerianStates, csvData){
        for (var i=0; i<csvData.length; i++){
            var csvRegion = csvData[i]; //the current region
            var csvKey = csvRegion.Region; //the CSV primary key
            
            //loop through geojson regions to find correct region
            for (var a=0; a<nigerianStates.features.length; a++){

                var geojsonProps = nigerianStates.features[a].properties; //the current region geojson properties
                var geojsonKey = geojsonProps.State_Name; //the geojson primary key

                //where primary keys match, transfer csv data to geojson properties object
                if (geojsonKey == csvKey){
                    //console.log(csvRegion);
                    geojsonProps.varA = parseFloat(csvRegion.varA);
                    geojsonProps.varB = parseFloat(csvRegion.varB);
                    geojsonProps.varC = parseFloat(csvRegion.varC);
                    geojsonProps.varD = parseFloat(csvRegion.varD);
                    geojsonProps.varE = parseFloat(csvRegion.varE);
                };
            };
        };
        return nigerianStates;
    };

    function setEnumerationUnits(nigerianStates, map, path, colorScale){
        var regions = map.selectAll(".regions")
        .data(nigerianStates.features)
        .enter()
        .append("path")
        .attr("class", function(d){
            return "region " + d.properties.State_Name;
        })
        .attr("d", path)        
            .style("fill", function(d){           
                var value = d.properties[expressed];            
                if(value) {                
                    return colorScale(d.properties[expressed]);            
                } else {                
                    return "#ccc";            
                }    
        });
        //console.log(regions)
        //console.log(colorScale)
    };
    
    // Quantiles
    function makeColorScale(data){
        var colorClasses = [
            "#D4B9DA",
            "#C994C7",
            "#DF65B0",
            "#DD1C77",
            "#980043"
        ];
    
        //create color scale generator
        var colorScale = d3.scaleQuantile()
            .range(colorClasses);
    
        //build two-value array of minimum and maximum expressed attribute values
        var minmax = [
            d3.min(data, function(d) { return parseFloat(d[expressed]); }),
            d3.max(data, function(d) { return parseFloat(d[expressed]); })
        ];
        //assign two-value array as scale domain
        colorScale.domain(minmax);
    
        return colorScale;
    };

    //function to create coordinated bar chart
    function setChart(csvData, colorScale){
        //chart frame dimensions
        var chartWidth = window.innerWidth * 0.425,
            chartHeight = 460;

        //create a second svg element to hold the bar chart
        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");
    };
    //Natural Breaks
    //function to create color scale generator
    // function makeColorScale(data){
    //     var colorClasses = [
    //         "#D4B9DA",
    //         "#C994C7",
    //         "#DF65B0",
    //         "#DD1C77",
    //         "#980043"
    //     ];

    //     //create color scale generator
    //     var colorScale = d3.scaleThreshold()
    //         .range(colorClasses);

    //     //build array of all values of the expressed attribute
    //     var domainArray = [];
    //     for (var i=0; i<data.length; i++){
    //         var val = parseFloat(data[i][expressed]);
    //         domainArray.push(val);
    //     };

    //     //cluster data using ckmeans clustering algorithm to create natural breaks
    //     var clusters = d3.ckmeans(domainArray, 5);
    //     //reset domain array to cluster minimums
    //     domainArray = clusters.map(function(d){
    //         return d3.min(d);
    //     });
    //     //remove first value from domain array to create class breakpoints
    //     domainArray.shift();

    //     //assign array of last 4 cluster minimums as domain
    //     colorScale.domain(domainArray);

    //     return colorScale;
    // };


})(); //last line of main.js
