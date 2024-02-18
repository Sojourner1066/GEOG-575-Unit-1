//declare map variable globally so all functions have access
var map;
var minValue;

//step 1 create map
function createMap(){

    //create the map
    map = L.map('map', {
        center: [0, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

function calculateMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for(var city of data.features){
        //loop through each year
        for(var year = 1990; year <= 2014; year+=1){
              //get population for current year
              var value = city.properties["YR"+ String(year)];
              //console.log(value)
              if(value != null && value != 0){
                //console.log(year);
                //console.log(city.properties["NAME"]);
                allValues.push(value*100);
              }
              //add value to array
              //allValues.push(value);
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)

    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 2;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius
    //var radius = 1.0083 * Math.pow(attValue/1,0.5715) //* minRadius

    // highest attValue = 100 without multiplying by minRadius and minValue is 1 == 14.014892380524241
    console.log(radius)
    return radius;
};

//Step 3: Add circle markers for point features to the map
function createPropSymbols(data){

    //Step 4: Determine which attribute to visualize with proportional symbols
    var attribute = "YR1990";

    //create marker options
    var geojsonMarkerOptions = {
        fillColor: "#ff7800",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
        radius: 8
    };

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);
            //console.log(attValue)
            if(attValue==0){
                geojsonMarkerOptions.radius = 3;
                geojsonMarkerOptions.fillColor = "#7e7e7e";
            } else {
                //Step 6: Give each feature's circle marker a radius based on its attribute value
                geojsonMarkerOptions.radius = calcPropRadius(attValue);
                geojsonMarkerOptions.fillColor = "#7900bc";
            }

            

            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};


//Step 2: Import GeoJSON data
function getData(){
    //load the data
    fetch("data/WB_electricity_access.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //calculate minimum data value
            minValue = calculateMinValue(json);
            //console.log(minValue)
            //call function to create proportional symbols
            createPropSymbols(json);
        })
};

document.addEventListener('DOMContentLoaded',createMap)