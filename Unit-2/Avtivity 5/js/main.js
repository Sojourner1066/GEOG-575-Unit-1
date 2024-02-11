/* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    /*
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
    */
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);;

    //call getData function
    getData();
};


function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};


//function to retrieve the data and place it on the map
function getData(){
    //load the data
    fetch("data/WB_electricity_access.geojson")
    // https://energydata.info/dataset/world-global-tracking-framework-2017/resource/af43491b-d8f3-4c24-adf6-259946b241ec?inner_span=True
        .then(function(response){
            return response.json();
        })
        .then(function(json){            
            //create marker options
            var geojsonMarkerOptions = {
                radius: 3,
                fillColor: "#5b16b5",
                color: "#000",
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.6
            };
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                onEachFeature: onEachFeature,
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                    }}).addTo(map);  
        })  
};
document.addEventListener('DOMContentLoaded',createMap)