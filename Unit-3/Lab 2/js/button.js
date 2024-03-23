var url = 'CIPts.json';  //REST service

var map = L.map('map').setView([42.736424, -73.762713], 10);  

var osm=new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',{ 
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});
	osm.addTo(map);
	
////////////////////	
var ci_data;


//Initial Setup  with layer Verified No
	ci_data = L.geoJson(null, {

        pointToLayer: function(feature, latlng) {

            return L.circleMarker(latlng, {
                color:'black',
                fillColor:  'red',
                fillOpacity: 1,
                radius: 8
            })
        },  
		onEachFeature: function (feature, layer) {
			layer.bindPopup(feature.properties.Verified);
		},
        filter: function(feature, layer) {   
             return (feature.properties.Verified !== "Y" );
        },

    }); 	
	
     $.getJSON(url, function(data) {
	   ci_data.addData(data);
    });
	
/// END Initial Setup

	//Using a Layer Group to add/ remove data from the map.
	var myData =  L.layerGroup([]);
		myData.addLayer(ci_data);
		myData.addTo(map); 
		
		
	//If Radio Button one is clicked.  
	document.getElementById("radioOne").addEventListener('click', function(event) {
	theExpression = 'feature.properties.Verified !== "Y" ';
	console.log(theExpression);	
		
		myData.clearLayers();
		map.removeLayer(myData);
		
		ci_data = L.geoJson(null, {

			pointToLayer: function(feature, latlng) {

				return L.circleMarker(latlng, {
					color:'black',
					fillColor:  'red',
					fillOpacity: 1,
					radius: 8
				})
			},  
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.Verified);
			},
			filter: function(feature, layer) {   
				 return (feature.properties.Verified !== "Y" );
			},

		});
		
		
		$.getJSON(url, function(data) {
			   ci_data.addData(data);
		});

	    myData.addLayer(ci_data);
  		myData.addTo(map);;
    });
	
	
	
  //If Radio button two is clicked.
	document.getElementById("radioTwo").addEventListener('click', function(event) {
	theExpression = 'feature.properties.Verified == "Y" ';	
	console.log(theExpression);
		map.removeLayer(myData);
		myData.clearLayers();
		
		ci_data = L.geoJson(null, {

			pointToLayer: function(feature, latlng) {

				return L.circleMarker(latlng, {
					color:'black',
					fillColor:  'green',
					fillOpacity: 1,
					radius: 8
				})
			},  
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.Verified);
			},
			filter: function(feature, layer) {   
				 return (feature.properties.Verified == "Y" );
			},

		});
		
		$.getJSON(url, function(data) {
			   ci_data.addData(data);
		});

	    myData.addLayer(ci_data);
		myData.addTo(map);
    });
	 
	 