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





function filterOnRegion(region_filter){
    map.removeLayer(layer)
    if(region_filter === 'Africa'){
        L.geoJson(data, {
                 filter: function(feature, layer, region_filter) {   
                     return (feature.properties.region === "Africa");
                },
            
                pointToLayer: function(feature, latlng){        
                    return pointToLayer(feature, latlng, attributes);
                }        
            }).addTo(map);
    }
};

function createPropSymbols(data, attributes, region_filter){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {//region_filter, { 
    //     filter: function(feature, layer, region_filter) {   
    //         return (feature.properties.region === "Africa");
    //    },
    
        pointToLayer: function(feature, latlng){        
            return pointToLayer(feature, latlng, attributes);
        }        
    }).addTo(map);
};


function createFeatureGroup(){
    var Africa = L.geoJson(data, { 
             filter: function(feature, layer, region_filter) {   
                 return (feature.properties.region === "Africa");
            },
    }),
    var Europe = L.geoJson(data, { 
        filter: function(feature, layer, region_filter) {   
            return (feature.properties.region === "Europe");
        },
    }),
       var Asia = L.geoJson(data, { 
        filter: function(feature, layer, region_filter) {   
            return (feature.properties.region === "Asia");
       },
   }),
   var Oceania = L.geoJson(data, { 
    filter: function(feature, layer, region_filter) {   
        return (feature.properties.region === "Oceania");
        },
    }),

   L.featureGroup([Africa, Europe, Asia, Oceania])
    .bindPopup('Hello world!')
    .on('click', function() { alert('Clicked on a member of the group!'); })
    .addTo(map);
};


function getData(){
    //load the data
    fetch("data/data.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            createFeatureGroup(json);
          

            // //calculate minimum data value
            // minValue = calculateMinValue(json);
            // //console.log(minValue)
            // //call function to create proportional symbols
            // let attributes = processData(json);
            // createPropSymbols(json, attributes, region_filter);
            // createSequenceControls(attributes);
        })
};

document.addEventListener('DOMContentLoaded',createMap)