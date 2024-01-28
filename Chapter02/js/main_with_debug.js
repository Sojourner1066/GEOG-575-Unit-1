
function initialize(){
	cityTable = cities();
	addColumns();
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

    var table = document.createElement("table");

    //FOREACH LOOP WITH OBJECT FOR LOOP...Example 2.4 line 25
    cityPop.forEach(function(cityObject){
        var tr = document.createElement("tr");

        for (var property in cityObject){
            var td = document.createElement("td");
            td.innerHTML = cityObject[property];
            tr.appendChild(td);
        };

        table.appendChild(tr);
    });

    //add the table to the div in index.html
    var myDiv =  document.getElementById("mydiv");
    myDiv.appendChild(table);
	return table
};


function addColumns(cityTable){

	cityTable.querySelectorAll("tr").forEach(function(row, i){
		if (i == 0){
			console.log('got to here')
			row.insertAdjacntHTML('beforeend', '<th>City Size</th>');
		} else {

			var citySize;

			if (cityPop[i-1].population < 100000){
				citySize = 'Small';

			} else if (cityPop[i-1].population < 500000){
				citysize = 'Medium';

			} else {
				citySize = 'Large';
			};

			row.insertAdjacntHTML = '<td>' + citySize + '</td>'; 
		};
	});
};

/* function addEvents(){

	document.querySelector("table").addEventListener("mouseover", function(){
		
		var color = "rgb(";

		for (var i=0; i<3; i++){

			var random = Math.round(Math.random() * 255);

			color += "random";

			if (i<2){
				color += ",";
			
			} else {
				color += ")";
		};

		document.querySelector("table").color = color;
	});

	function clickme(){

		alert('Hey, you clicked me!');
	};

	document.querySelector("table").addEventListener("click", clickme)
}; */

window.onload = initialize();