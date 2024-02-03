//Example 2.7 line 1
function jsAjax(){
    //use Fetch to retrieve data
    fetch('data/MegaCities.geojson')
    //fetch('http://localhost:8080/Chapter02/data/MegaCities.geojson')
        .then(function(response){
            return response.json();
        }) 
        .then(callback) 
};

//define callback function
function callback(response){
    //tasks using the data go here
    console.log(response)
}

window.onload = jsAjax();