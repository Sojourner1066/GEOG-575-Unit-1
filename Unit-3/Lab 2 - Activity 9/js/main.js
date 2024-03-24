// JS code by Morgan, 2024

//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){
    //use Promise.all to parallelize asynchronous data loading
    var promises = [d3.csv("data/NGA_Poverty_Data.csv"),                    
                    d3.json("data/NGA_Regions.topojson"),                    
                    d3.json("data/NGA_States.topojson")                   
                    ];    
    Promise.all(promises).then(callback);
};