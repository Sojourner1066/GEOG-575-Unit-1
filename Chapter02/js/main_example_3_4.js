
//initialize function called when the script loads
function initialize(){
    cities();
};

//function to create a table with cities and their populations
function cities(){
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

    //create the table element
    var table = document.createElement("table");

    //create a header row
    var headerRow = document.createElement("tr");

    //add the "City" and "Population" columns to the header row
    headerRow.insertAdjacentHTML("beforeend","<th>City</th><th>Population</th>")

    //add the row to the table
    table.appendChild(headerRow);

    //loop to add a new row for each city
    for(var i = 0; i < cityPop.length; i++){
        //assign longer html strings to a variable
        var rowHtml = "<tr><td>" + cityPop[i].city + "</td><td>" + cityPop[i].population + "</td></tr>";
        //add the row's html string to the table
        table.insertAdjacentHTML('beforeend',rowHtml);
    }

    var theid = document.querySelector('#mydiv').getAttribute('id');
    //console.log(theid)
    //console.log(`the id is: ${theid}`)

    //add the table to the div in index.html
//    var myDiv =  document.querySelector("#mydiv");
//    myDiv.appendChild(table);

    document.querySelector("#mydiv").appendChild(table)
    
    //Added below Example 3.8...
    //click listener with anonymous handler function
    /* document.querySelector("table").addEventListener("click", function(){
        alert('Madison Rocks! Go Badgers!');
    }); */


    //named handler function for removable listener
    function clickme(){
        alert('Yeah Green Bay! Go Packers!');
    };

    //add the event listener
    document.querySelector("table").addEventListener('click', clickme);

    //remove the event listener
    document.querySelector("table").removeEventListener('click', clickme);

    //Added below Example 3.6...
    //change the text color
    document.querySelector('#mydiv').style.color = 'red';

    //change the text size and alignment
    document.querySelector('#mydiv').style.fontSize = '2em';
    document.querySelector('#mydiv').style.textAlign = 'center';

    //get the text color and add it as text to the div
    var thecolor = document.querySelector('#mydiv').style.color;
    document.querySelector('#mydiv').insertAdjacentHTML('beforeend',thecolor);
};



//window.onload = initialize();
document.addEventListener('DOMContentLoaded',initialize)