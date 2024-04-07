// JS code by Morgan, 2024


// Change to local scope
(function(){

    //pseudo-global variables
    var attrArray = ["varA", "varB", "varC", "varD", "varE"]; //list of attributes
    var expressed = attrArray[0]; //initial attribute
    var title_dict = {"varA":"Percent of population vulnerable to poverty", 
                         "varB":"Percent of population in severe poverty", 
                         "varC":"Number of poor people by region (in thousands)", 
                         "varD":"Number of vulnerable by region (in thousands)", 
                         "varE":"Number of people in severe poverty by region (in thousands)"
    }
    //chart frame dimensions
    var chartWidth = window.innerWidth * 0.425,
    chartHeight = 473,
    leftPadding = 25,
    rightPadding = 2,
    topBottomPadding = 5,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

    //create a scale to size bars proportionally to frame and for axis
    var yScale = d3.scaleLinear()
    .range([463, 0])
    .domain([0, 110]);



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
            
            //create dropdown for selection
            createDropdown(csvData)
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
        //loop through csv to assign each set of csv attribute values to geojson region
        for (var i=0; i<csvData.length; i++){
            var csvRegion = csvData[i]; //the current region
            var csvKey = csvRegion.Region; //the CSV primary key

            //loop through geojson regions to find correct region
            for (var a=0; a<nigerianStates.features.length; a++){

                var geojsonProps = nigerianStates.features[a].properties; //the current region geojson properties
                var geojsonKey = geojsonProps.State_Name; //the geojson primary key

                //where primary keys match, transfer csv data to geojson properties object
                if (geojsonKey == csvKey){

                    //assign all attributes and values
                    attrArray.forEach(function(attr){
                        var val = parseFloat(csvRegion[attr]); //get csv attribute value
                        geojsonProps[attr] = val; //assign attribute and value to geojson properties
                    });
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
            return "regions " + d.properties.State_Name;
        })
        .attr("d", path)        
        .style("fill", function(d){           
                var value = d.properties[expressed];            
                if(value) {                
                    return colorScale(d.properties[expressed]);            
                } else {                
                    return "#ccc";            
                }    
        })
        .on("mouseover", function(event, d){
            highlight(d);
        })
        .on("mouseout", function(event, d){
            dehighlight(d);
        });
        var desc = regions.append("desc")
        .text('{"stroke": "#000", "stroke-width": "0.5px"}');;

        //console.log(regions)
        //console.log(colorScale)
    };
    
    // Quantiles
    function makeColorScale(data){
        var colorClasses = [
            "#f2f0f7",
            "#cbc9e2",
            "#9e9ac8",
            "#756bb1",
            "#54278f",
            // "#D4B9DA",
            // "#C994C7",
            // "#DF65B0",
            // "#DD1C77",
            // "#980043"
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

         //create a scale to size bars proportionally to frame
        var yScale = d3.scaleLinear()
            .range([0, chartHeight])
            .domain([0, 105]);
            
        //set bars for each province
        var bars = chart.selectAll(".bars")
            .data(csvData)
            .enter()
            .append("rect")
            .sort(function(a, b){
                return b[expressed]-a[expressed]
            })
            .attr("class", function(d){
                return "bars " + d.Region;
            })
            .attr("width", chartWidth / csvData.length - 1)
            .on("mouseover", function(event, d){
                highlightBar(d);
            })
            .on("mouseout", function(event, d){
                dehighlightBar(d);
            });;
        var desc = bars.append("desc")
            .text('{"stroke": "none", "stroke-width": "0px"}');


        // var numbers = chart.selectAll(".numbers")
        // .data(csvData)
        // .enter()
        // .append("text")
        // .sort(function(a, b){
        //     return b[expressed]-a[expressed]
        // })
        // .attr("class", function(d){
        //     return "numbers " + d.Region;
        // })
        // .attr("text-anchor", "middle")
        // .attr("x", function(d, i){
        //     var fraction = chartWidth / csvData.length;
        //     return i * fraction + (fraction - 1) / 2;
        // })
        // .attr("y", function(d){
        //     return chartHeight - yScale(parseFloat(d[expressed])) + 15;
        // })
        // .text(function(d){
        //     return Math.round(d[expressed]);
        // });

        //below Example 2.8...create a text element for the chart title
        var chartTitle = chart.append("text")
            .attr("x", 20)
            .attr("y", 40)
            .attr("class", "chartTitle")
            .text(title_dict[expressed]);
        
        updateChart(bars, csvData.length, colorScale)

    };
    //function to create a dropdown menu for attribute selection
    function createDropdown(csvData){
        //add select element
        var dropdown = d3.select("body")
            .append("select")
            .attr("class", "dropdown")
            .on("change", function(){
                changeAttribute(this.value, csvData)
            });

        //add initial option
        var titleOption = dropdown.append("option")
            .attr("class", "titleOption")
            .attr("disabled", "true")
            .text("Select Attribute");

        //add attribute name options
        var attrOptions = dropdown.selectAll("attrOptions")
            .data(attrArray)
            .enter()
            .append("option")
            .attr("value", function(d){ return d })
            .text(function(d){ return d });
    };
    //dropdown change event handler
    function changeAttribute(attribute, csvData) {
        //change the expressed attribute
        expressed = attribute;

        //recreate the color scale
        var colorScale = makeColorScale(csvData);

        //recolor enumeration units
        var regions = d3.selectAll(".regions")
            .transition()
            .duration(1000)
            .style("fill", function (d) {
                var value = d.properties[expressed];
                if (value) {
                    return colorScale(d.properties[expressed]);
                } else {
                    return "#ccc";
                }
        });

        //Sort, resize, and recolor bars
        var bars = d3.selectAll(".bars")
            //Sort bars
            .sort(function(a, b){
                return b[expressed] - a[expressed];
            })
            .transition() //add animation
            .delay(function(d, i){
                return i * 20
            })
            .duration(500);
        //     .attr("x", function(d, i){
        //         return i * (chartInnerWidth / csvData.length) + leftPadding;
        //     })
        //     //resize bars
        //     .attr("height", function(d, i){
        //         return 463 - yScale(parseFloat(d[expressed]));
        //     })
        //     .attr("y", function(d, i){
        //         return yScale(parseFloat(d[expressed])) + topBottomPadding;
        //     })
        //     //recolor bars
        //     .style("fill", function(d){            
        //         var value = d[expressed];            
        //         if(value) {                
        //             return colorScale(value);            
        //         } else {                
        //             return "#ccc";            
        //         }    
        // });
        updateChart(bars, csvData.length, colorScale);
    };

    //function to position, size, and color bars in chart
    function updateChart(bars, n, colorScale){
        //position bars
        bars.attr("x", function(d, i){
                return i * (chartInnerWidth / n) + leftPadding;
            })
            //size/resize bars
            .attr("height", function(d, i){
                return 463 - yScale(parseFloat(d[expressed]));
            })
            .attr("y", function(d, i){
                return yScale(parseFloat(d[expressed])) + topBottomPadding;
            })
            //color/recolor bars
            .style("fill", function(d){            
                var value = d[expressed];            
                if(value) {                
                    return colorScale(value);            
                } else {                
                    return "#ccc";            
                }    
        });
        var chartTitle = d3.select(".chartTitle")
            .text(title_dict[expressed]);
    };

    //function to highlight enumeration units
    function highlight(props){
        //change stroke
        var selected = d3.selectAll("." + props.properties.State_Name)
            .style("stroke", "blue")
            .style("stroke-width", "2");
    };
        
    //function to highlight enumeration units and bars
    function highlightBar(props){
        //change stroke
        var selected = d3.selectAll("." + props.Region)
            .style("stroke", "blue")
            .style("stroke-width", "2");
    };

    //function to reset the element style on mouseout
    function dehighlight(props){
        var selected = d3.selectAll("." + props.properties.State_Name)
            .style("stroke", function(){
                return getStyle(this, "stroke")
            })
            .style("stroke-width", function(){
                return getStyle(this, "stroke-width")
            });

        function getStyle(element, styleName){
            var styleText = d3.select(element)
                .select("desc")
                .text();

            var styleObject = JSON.parse(styleText);

            return styleObject[styleName];
        };
    };

    //function to reset the element style on mouseout
    function dehighlightBar(props){
        var selected = d3.selectAll("." + props.Region)
            .style("stroke", function(){
                return getStyle(this, "stroke")
            })
            .style("stroke-width", function(){
                return getStyle(this, "stroke-width")
            });

        function getStyle(element, styleName){
            var styleText = d3.select(element)
                .select("desc")
                .text();

            var styleObject = JSON.parse(styleText);

            return styleObject[styleName];
        };
    };

    //function to create dynamic label
    function setLabel(props){
        //label content
        var labelAttribute = "<h1>" + props[expressed] +
            "</h1><b>" + expressed + "</b>";

        //create info label div
        var infolabel = d3.select("body")
            .append("div")
            .attr("class", "infolabel")
            .attr("id", props.State_Name + "_label")
            .html(labelAttribute);

        var regionName = infolabel.append("div")
            .attr("class", "labelname")
            .html(props.name);
    };

})(); //last line of main.js
