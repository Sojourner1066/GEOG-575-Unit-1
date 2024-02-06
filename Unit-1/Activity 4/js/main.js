
function initialize(){
	//Create an empty array to store city name and population as objects
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

	// Create table object to insert elements into
	var table = document.createElement("table");
	//create a header row
    var headerRow = document.createElement("tr");

    //add the "City" and "Population" columns to the header row
    headerRow.insertAdjacentHTML("beforeend","<th>City</th><th>Population</th>")

    //add the row to the table
    table.appendChild(headerRow);


    //Loop over the cityPop array and create a new row in the table for each object
    cityPop.forEach(function(cityPop){
		// create row element
        var tr = document.createElement("tr");
		// loop over the properties in citypop and create an element
		// use the element to insert them with the cityPop properties
		// then append the element to the row
        for (var property in cityPop){
            var td = document.createElement("td");
            td.innerHTML = cityPop[property];
            tr.appendChild(td);
        };
		// add row to table
        table.appendChild(tr);
    });
	
	// loop over every row in the table and apply function
	// the function will create a new column with text about city size
	table.querySelectorAll("tr").forEach(function(row, i){
		// this will create a header element in the table
		if (i == 0){
			// create header element
			var th = document.createElement("th");
			// add text to header element as html
			th.innerHTML = 'City Size';
			// append the new header into the row
			row.appendChild(th);
		} else {
			//if not the first row in the table, test population size
			// create undefined variable to hold city size text
			var citySize;
			// Test if city pop is under 100,000 and if so set city size to small
			if (cityPop[i-1].population < 100000){
				citySize = 'Small';
			// Test if city pop is under 500,000 and if so set city size to medium
			} else if (cityPop[i-1].population < 500000){
				citySize = 'Medium';
			// all cities greater than 500,000 are taged with "large"
			} else {
				citySize = 'Large';
			};
			// once the citysize is set create a new row element and assign citysize
			// then append to table 
			var td = document.createElement("td");
			td.innerHTML = citySize;
			row.appendChild(td);
			table.appendChild(row);
		}; 
	});

	//add the table to the div in index.html
	var myDiv =  document.getElementById("mydiv");
	myDiv.appendChild(table);
	
	// This calls the function to add events to the table
	addEvents();
	
	// Calls the function to display the geojson file in the data folder
	// on the html page. 
    jsAjax()
};


function addEvents(){
	/* This function adds two events to the table.
	first is a mouseover event that changes the color of the text
	the second is a click event that popsup an alert with text
	*/

	// get the table element and assign an event with a function
	document.querySelector("table").addEventListener("mouseover", function(){
		
		// create a varable to hold text with rgb values
		var color = "rgb(";
		// loop to create three random numbers between 0 and 255
		for (var i=0; i<3; i++){
			// Create random number 
			var random = Math.round(Math.random() * 255);
			// add number to the color variable
			color += random;
			// this will add formating commas on the first two numbers
			if (i<2){
				color += ",";
			// this adds no comma but adds closing parenthesis 
			} else {
				color += ")";
			};
		};
		// applys the color as style to the table element
		document.querySelector("table").style.color = color;
	});
	
	//This function adds a click event to the table that popsup an alert with text
	function clickme(){
		// alert to show
		alert('Hey, you clicked me!');
	};
	// selects the table and adds a click event listener 
	document.querySelector("table").addEventListener("click", clickme)
};
// Function to fetch geojson from the data folder and pass to callback function
function jsAjax(){
	//use Fetch to retrieve data
	fetch('data/MegaCities.geojson')
		.then(function(response){
			return response.json();
		}) 
		.then(callback) 
};

//define callback function
function callback(response){
	//Get the gjdiv element from the html and assign it to gjDiv
	var gjDiv =  document.getElementById("gjdiv");
	// Convert the response json into a string and assign it to the gjDiv element
	gjDiv.innerHTML = JSON.stringify(response);
};


// when the window loads run the initialize function. 
window.onload = initialize();