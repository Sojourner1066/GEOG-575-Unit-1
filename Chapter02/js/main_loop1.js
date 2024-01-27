// Add all scripts to the JS folder

//initialize function called when the script loads
function initialize(){
    cities();
};

function cities(){
    //Example 2.3 line 8...create an empty array
    var cityPop = [];

    //create the first city object
    var madison = {};
    //add each property to the object
    madison.city = 'Madison';
    madison.population = 233209;

    //push the city object into the array
    cityPop.push(madison);

    //repeat...
    var milwaukee = {};
    milwaukee.city = 'Milwaukee';
    milwaukee.population = 594833;
    cityPop.push(milwaukee);

    var greenBay = {};
    greenBay.city = 'Green Bay';
    greenBay.population = 104057;
    cityPop.push(greenBay);

    var superior = {};
    superior.city = 'Superior';
    superior.population = 27244;
    cityPop.push(superior);

    
    //WHILE LOOP...Example 2.4 line 25
    //define a counter variable
    var i = 0;
    var table = document.createElement("table");
    
    //start the loop
    while (i < cityPop.length){
        var tr = document.createElement("tr");

        var city = document.createElement("td");
        city.innerHTML = cityPop[i].city;
        tr.appendChild(city);

        var pop = document.createElement("td");
        pop.innerHTML = cityPop[i].population;
        tr.appendChild(pop);

        table.appendChild(tr);

        //increment counter
        i++;
    };
    //add the table to the div in index.html
    var myDiv =  document.getElementById("mydiv");
    myDiv.appendChild(table);
};

window.onload = initialize();


