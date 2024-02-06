
function initialize(){
	//Create an empty array
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
	//create a header row
    var headerRow = document.createElement("tr");

    //add the "City" and "Population" columns to the header row
    headerRow.insertAdjacentHTML("beforeend","<th>City</th><th>Population</th>")

    //add the row to the table
    table.appendChild(headerRow);


    //FOREACH LOOP WITH OBJECT FOR LOOP...Example 2.4 line 25
    cityPop.forEach(function(cityPop){
        var tr = document.createElement("tr");

        for (var property in cityPop){
            var td = document.createElement("td");
            td.innerHTML = cityPop[property];
            tr.appendChild(td);
        };

        table.appendChild(tr);
    });
	
	table.querySelectorAll("tr").forEach(function(row, i){
		if (i == 0){
			console.log(row)
			var th = document.createElement("th");
			th.innerHTML = 'City Size';
			row.appendChild(th);
		} else {

			var citySize;

			if (cityPop[i-1].population < 100000){
				citySize = 'Small';

			} else if (cityPop[i-1].population < 500000){
				citySize = 'Medium';

			} else {
				citySize = 'Large';
			};
	
			var td = document.createElement("td");
			td.innerHTML = citySize;
			row.appendChild(td);
			table.appendChild(row);
		}; 
	});

	//add the table to the div in index.html
	var myDiv =  document.getElementById("mydiv");
	myDiv.appendChild(table);

	addEvents();
};


function addEvents(){

	document.querySelector("table").addEventListener("mouseover", function(){
		
		var color = "rgb(";

		for (var i=0; i<3; i++){

			var random = Math.round(Math.random() * 255);

			color += random;

			if (i<2){
				color += ",";
			
			} else {
				color += ")";
			};
		};
		console.log(color)
		document.querySelector("table").style.color = color;
	});

	function clickme(){

		alert('Hey, you clicked me!');
	};

	document.querySelector("table").addEventListener("click", clickme)
};



window.onload = initialize();