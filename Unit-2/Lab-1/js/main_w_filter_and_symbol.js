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
}

function calculateMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for(var city of data.features){
        //loop through each year
        for(var year = 1990; year <= 2014; year+=1){
              //get population for current year
              var value = city.properties["YR"+ String(year)];
              
              //remove null and 0 from array so the sybmology will work correctly
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
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 2;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius
    return radius;
};


//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0]; //"YR1990";
    //console.log(attribute);

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    var calculatedRadius = calcPropRadius(attValue);
    
    if(attValue==0){
        options.radius = 1;
        options.fillColor = "#7e7e7e";
    } else if(attValue==100){
        options.radius = 3;
        options.fillColor = "#25BE3A";
    } else {
        //Step 6: Give each feature's circle marker a radius based on its attribute value
        options.radius = calcPropRadius(attValue);
        options.fillColor = "#7900bc";
    }

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>Country:</b> " + feature.properties.SOV0NAME + "</p><p><b>" + "Percent of population with access to electricity in " + attribute.slice(2) + ":</b> " + Math.round(feature.properties[attribute] * 100) / 100 + "</p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

function createAttributes(data){
    // This function creates an array with all the 'field names'
    // with data about electricity percentages

    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with values
        if (attribute.indexOf("YR") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    //console.log(attributes);
    //console.log(attributes)
    return attributes;
};

//Step 1: Create new sequence controls
function createSequenceControls(attributes){
    //create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input><br>";
    document.querySelector("#overlay").insertAdjacentHTML('beforeend',slider);

     //set slider attributes
     document.querySelector(".range-slider").max = 24;
     document.querySelector(".range-slider").min = 0;
     document.querySelector(".range-slider").value = 0;
     document.querySelector(".range-slider").step = 1;

    //below Example 3.6...add step buttons
    document.querySelector('#overlay').insertAdjacentHTML('beforeend','<button class="step" id="reverse">Reverse</button>');
    
    document.querySelector('#overlay').insertAdjacentHTML('beforeend','<button class="step" id="forward">Forward</button>');

    document.querySelector('#reverse').insertAdjacentHTML('beforeend',"<img src='img/noun-arrows-left-712896.svg'>");
    document.querySelector('#forward').insertAdjacentHTML('beforeend',"<img src='img/noun-arrows-right-712895.svg'>");

    //Arrows Right by Peter Hacke from <a href="https://thenounproject.com/browse/icons/term/arrows-right/" target="_blank" title="Arrows Right Icons">Noun Project</a> (CC BY 3.0)

    //Below Example 3.6 in createSequenceControls()
    //Step 5: click listener for buttons
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            //sequence
            var index = document.querySelector('.range-slider').value;

            //Step 6: increment or decrement depending on button clicked
            if (step.id == 'forward'){
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 24 ? 0 : index;
            } else if (step.id == 'reverse'){
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 24 : index;
            //Called in both step button and slider event listener handlers
            //Step 9: pass new attribute to update symbols
            };
            updatePropSymbols(attributes[index]);
            //Step 8: update slider
            document.querySelector('.range-slider').value = index;
        })
    })

    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){            
        //sequence
        //Step 6: get the new index value
        var index = this.value;

        //Called in both step button and slider event listener handlers
        //Step 9: pass new attribute to update symbols
        updatePropSymbols(attributes[index]);

    });
};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
            //access feature properties
            var props = layer.feature.properties;


            //update each feature's radius based on new attribute values
            if(props[attribute]==100){
                layer.setRadius(3);
                layer.setStyle({fillColor : "#25BE3A"});
            }else {
                var radius = calcPropRadius(props[attribute]);
                layer.setRadius(radius);  
                layer.setStyle({fillColor : "#7900bc"})
            }
            //add formatted attribute to panel content string
            popupContent = "<p><b>Country:</b> " + layer.feature.properties.SOV0NAME + "</p><p><b>" + "Percent of population with access to electricity in " + attribute.slice(2) + ":</b> " + Math.round(layer.feature.properties[attribute] * 100) / 100 + "</p>";

            //update popup content            
            popup = layer.getPopup();            
            popup.setContent(popupContent).update();
        };
    });
};

function addDataToMap(data, attributes){

    Africa = L.geoJson(data, { 
        filter: function(feature, layer) {   
            return (feature.properties.region === "Africa");
        },
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);

    Europe = L.geoJson(data, { 
        filter: function(feature, layer) {   
            return (feature.properties.region === "Europe");
        },
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);

    Asia = L.geoJson(data, { 
        filter: function(feature, layer) {   
            return (feature.properties.region === "Asia");
        },
       pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
   }).addTo(map);

   Oceania = L.geoJson(data, { 
        filter: function(feature, layer) {   
            return (feature.properties.region === "Oceania");
        },
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);

   Americas = L.geoJson(data, { 
        filter: function(feature, layer) {   
            return (feature.properties.region === "Americas");
        },
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);

    regionLayers = L.layerGroup([Africa, Europe, Oceania, Asia, Americas]).addTo(map);
    const overlays = {
        'Africa': Africa,
        'Europe': Europe,
        'Asia': Asia,
        'Oceania': Oceania,
        'Americas': Americas,
        'All Regions': regionLayers
    };
    
    const layerControl = L.control.layers(overlays).addTo(map);
};

function getData(){
    //load the data
    fetch("data/data.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            minValue = calculateMinValue(json);
            let attributes = createAttributes(json);
            addDataToMap(json,attributes);
            createSequenceControls(attributes);           
        })
};

document.addEventListener('DOMContentLoaded',createMap)