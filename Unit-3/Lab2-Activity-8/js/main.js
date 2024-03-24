// JS code by Morgan, 2024

//execute script when window is loaded
window.onload = function(){
    //SVG dimension variables
    var w = 900, h = 500;

    //container block
    var container = d3.select("body") //get the <body> element from the DOM
       .append("svg") //put a new svg in the body
       .attr("width", w) //assign the width
       .attr("height", h) //assign the height
       .attr("class", "container")
       .style("background-color", "rgba(0,0,0,0.2)");

    //innerRect block
    var innerRect = container.append("rect")
        .datum(400) //a single value is a DATUM
        .attr("width", function(d){ //rectangle width
            return d * 2; //400 * 2 = 800
        })
        .attr("height", function(d){ //rectangle height
            return d; //400
        })
        .attr("class", "innerRect") //class name
        .attr("x", 50) //position from left on the x (horizontal) axis
        .attr("y", 50) //position from top on the y (vertical) axis
        .style("fill", "#FFFFFF"); //fill color

    // var dataArray = [10, 20, 30, 40, 50];

    // var circles = container.selectAll(".circles") //but wait--there are no circles yet!
    //     .data(dataArray) //here we feed in an array
    //     .enter() //one of the great mysteries of the universe
    //     .append("circle") //add a circle for each datum
    //     .attr("class", "circles") //apply a class name to all circles
    //     .attr("r", function(d, i){ //circle radius
    //         console.log("d:", d, "i:", i); //let's take a look at d and i
    //         return d;
    //     })
    //     .attr("cx", function(d, i){ //x coordinate
    //         return 70 + (i * 180);
    //     })
    //     .attr("cy", function(d){ //y coordinate
    //         return 450 - (d * 5);
    //     });

    var cityPop = [
        { 
            city: 'Madison',
            population: 233209
        },
        {
            city: 'Milwaukee',
            population: 594833
        },
        {
            city: 'Green Bay',
            population: 104057
        },
        {
            city: 'Superior',
            population: 27244
        }
    ];

    //find the minimum value of the array
    var minPop = d3.min(cityPop, function(d){
        return d.population;
    });

    //find the maximum value of the array
    var maxPop = d3.max(cityPop, function(d){
        return d.population;
    });

    //scale for circles center y coordinate
    // var y = d3.scaleLinear()
    //     .range([440, 95])
    //     .domain([
    //         minPop,
    //         maxPop
    //     ]);

    var y = d3.scaleLinear()
        .range([450, 50]) //was 440, 95
        .domain([0, 700000]); //was minPop, maxPop

    //color scale generator 
    var color = d3.scaleLinear()
        .range([
            "#FDBE85",
            "#D94701"
        ])
        .domain([
            minPop, 
            maxPop
        ]);


    var x = d3.scaleLinear() //create the scale
        .range([90, 950]) //output min and max
        .domain([0, 4]); //input min and max
    console.log(x)


    var circles = container.selectAll(".circles") //create an empty selection
        .data(cityPop) //here we feed in an array
        .enter() //one of the great mysteries of the universe
        .append("circle") //inspect the HTML--holy crap, there's some circles there
        .attr("class", "circles")
        .attr("id", function(d){
            return d.city;
        })
        .attr("r", function(d){
            //calculate the radius based on population value as circle area
            var area = d.population * 0.01;
            return Math.sqrt(area/Math.PI);
        })
        // .attr("cx", function(d, i){
        //     //use the index to place each circle horizontally
        //     return 90 + (i * 180);
        // })
        .attr("cx", function(d, i){
            //use the scale generator with the index to place each circle horizontally
            return x(i);
        })
        .attr("cy", function(d){
            //subtract value from 450 to "grow" circles up from the bottom instead of down from the top of the SVG
            //return 450 - (d.population * 0.0005);
            return y(d.population);
        })
        .style("fill", function(d, i){ //add a fill based on the color scale generator
            return color(d.population);
        })
        .style("stroke", "#000"); //black circle stroke

        //Example 3.6 line 1...create y axis generator
    var yAxis = d3.axisLeft(y);

        //create axis g element and add axis
    var axis = container.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);

    // Add Title    
    var title = container.append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("x", 450)
        .attr("y", 30)
        .text("City Populations");

    var labels = container.selectAll(".labels")
        .data(cityPop)
        .enter()
        .append("text")
        .attr("class", "labels")
        .attr("text-anchor", "left")
        .attr("y", function(d){
            //vertical position centered on each circle
            return y(d.population) -2;
        });

    //first line of label
    var nameLine = labels.append("tspan")
        .attr("class", "nameLine")
        .attr("x", function(d,i){
            //horizontal position to the right of each circle
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .text(function(d){
            return d.city;
        });
    
        //create format generator
    var format = d3.format(",");

    //second line of label
    var popLine = labels.append("tspan")
        .attr("class", "popLine")
        .attr("x", function(d,i){
            //horizontal position to the right of each circle
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .attr("dy", "15") 
        .text(function(d){
            return "Pop. " + format(d.population);;
        });
};