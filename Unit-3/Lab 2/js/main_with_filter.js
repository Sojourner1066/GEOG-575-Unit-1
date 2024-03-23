//declare map variable globally so all functions have access
var map;
// var Africa;
// var Europe;
// var Oceania;
// var Asia
// var Americas;
// var myLayerGroup;



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
function addDataToMap(data, Africa, Europe, Oceania, Asia, Americas){

    Africa = L.geoJson(data, { 
             filter: function(feature, layer) {   
                 return (feature.properties.region === "Africa");
            },
    }).addTo(map);

    Europe = L.geoJson(data, { 
        filter: function(feature, layer) {   
            return (feature.properties.region === "Europe");
        },
    }).addTo(map);

    Asia = L.geoJson(data, { 
        filter: function(feature, layer) {   
            return (feature.properties.region === "Asia");
       },
   }).addTo(map);

   Oceania = L.geoJson(data, { 
    filter: function(feature, layer) {   
        return (feature.properties.region === "Oceania");
        },
    }).addTo(map);

   Americas = L.geoJson(data, { 
    filter: function(feature, layer) {   
        return (feature.properties.region === "Americas");
        },
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
            addDataToMap(json);
            
            
            
        })
};

document.addEventListener('DOMContentLoaded',createMap)