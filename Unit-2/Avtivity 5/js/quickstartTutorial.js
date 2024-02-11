// initilizes the map and targets the 'map' div object in the html
// also sets the starting center point and zoom
var map = L.map('map').setView([51.505, -0.09], 13);

// initilizes the tile layers and sets the url to OSM.
// adds the layer to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// creates a smiple marker and adds it to the map. 
var marker = L.marker([51.5, -0.09]).addTo(map);

// creates a simple circle and adds it to the map with some basic styling
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

// creates a polygon and adds it to the map
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

// adds popups to each item on the map. The marker is set to have 
// the pop up open on load.
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

// initilizes the popup 
var popup = L.popup();

// function to listen for click events and to inform the user of the 
// lat long of the click. 
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
// initilies the click event on the map
map.on('click', onMapClick);