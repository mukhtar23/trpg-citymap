// user input
var size;
var water;
var wall;
var selected;

var gridSize = 0;
var squareSize = 30;
var array = [];
var labels = [];
var component = [];
const GROUND = 'white';
const PATH = 'grey';
const WATER = 'Blue';

var pathArray = [];

function getGridSize(){
    if (size == 'small'){
        gridSize = 13;
    }else if(size == 'medium'){
        gridSize = 19;
    }else if(size == 'large'){
        gridSize = 25;
    }
    console.log(gridSize);
}

function createGrid(){
    var x = 0;
    var y = 0;
    array = [];
    for(var i = 0; i < gridSize; i++){
        array.push([]);
        for(var j = 0; j <gridSize; j++){
            var square = {};
            square.color = GROUND;
            square.water = "none";
            square.wall = "no";
            square.posX = x
            square.posY = y;
            array[i].push(square);
            x+=squareSize;
        }
        x=0;
        y+=squareSize;
    }
}

function createRiver(){
    var topLeft = [0,0]
    var topRight = [0, gridSize-1]
    var topMiddle = [0, Math.ceil(gridSize/2)]
    var leftMiddle = [Math.ceil(gridSize/2),0]

    var startingPoint = Math.floor(Math.random() * 4);

    for(var i = 0; i < gridSize; i++){
        if(startingPoint == 0){
            array[topLeft[0]][topLeft[1]].color = WATER;
            topLeft[0]++;
            topLeft[1]++;
        }else if (startingPoint == 1){
            array[topRight[0]][topRight[1]].color = WATER;
            topRight[0]++;
            topRight[1]--;
        }else if(startingPoint == 2){
            array[topMiddle[0]][topMiddle[1]].color = WATER;
            topMiddle[0]++;
        }else if(startingPoint == 3){
            array[leftMiddle[0]][leftMiddle[1]].color = WATER;
            leftMiddle[1]++;
        }
    }
}

//lets create a randomly generated map for our dungeon crawler 
function createMap() { 
    // for(var i = 0; i< 2; i++){
        // The larger the maxTurn/maxTunnels is compared to the dimensions, the denser the map will be. 
        // The larger the maxLength is compared to the dimensions, the more “tunnel-y” it will look.
        
        // defualt parameter for large map
        let dimensions = gridSize, // width and height of the map
            maxTunnels = Math.floor(gridSize*2), // max number of tunnels possible (max number of turns the path can take)
            maxLength = Math.floor(gridSize), // max length each tunnel can have before a horizontal or vertical turn
            // map = createArray(1, dimensions), // create a 2d array full of 1's
            currentRow = Math.floor(Math.random() * dimensions), // our current row - start at a random spot
            currentColumn = Math.floor(Math.random() * dimensions), // our current column - start at a random spot
            directions = [[-1, 0], [1, 0], [0, -1], [0, 1]], // array to get a random direction from (left,right,up,down)
            lastDirection = [], // save the last direction we went 
            randomDirection; // next turn/direction - holds a value from directions 
            
        // create turns and length for small and med maps sizes
        if (size == "small") {
            var smallNum = Math.floor(Math.random() * (3 - 2.75 + 1)) + 2.75
            maxTunnels = Math.floor(gridSize*smallNum); // max number of tunnels possible (max number of turns the path can take)
            maxLength = Math.floor(gridSize); // max length each tunnel can have before a horizontal or vertical turn
        } else if (size == "medium") {
            var medNum = Math.floor(Math.random() * (3 - 2 + 1)) + 2
            maxTunnels = Math.floor(gridSize*medNum); // max number of tunnels possible (max number of turns the path can take)
            maxLength = Math.floor(gridSize); // max length each tunnel can have before a horizontal or vertical turn    
        }  

        // lets create some tunnels - while maxTunnels, dimentions, and maxLength  is greater than 0. 
        while (maxTunnels && dimensions && maxLength) { 
        
            // lets get a random direction - until it is a perpendicular to our lastDirection 
            // if the last direction = left or right, 
            // then our new direction has to be up or down, 
            // and vice versa 
            do { 
                randomDirection = directions[Math.floor(Math.random() * directions.length)]; 
            } while ((randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) || (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1])); 
        
            var randomLength = Math.ceil(Math.random() * maxLength), //length the next tunnel will be (max of maxLength) 
            // var randomLength = maxLength;
            tunnelLength = 0; //current length of tunnel being created 
        
            // lets loop until our tunnel is long enough or until we hit an edge 
            while (tunnelLength < randomLength) { 
        
                //break the loop if it is going out of the map 
                if (((currentRow === 0) && (randomDirection[0] === -1)) || 
                    ((currentColumn === 0) && (randomDirection[1] === -1)) || 
                    ((currentRow === dimensions - 1) && (randomDirection[0] === 1)) || 
                    ((currentColumn === dimensions - 1) && (randomDirection[1] === 1))) { 
                    break; 
                } else if(array[currentRow][currentColumn].color == WATER){
                    currentRow += randomDirection[0]; //add the value from randomDirection to row and col (-1, 0, or 1) to update our location 
                    currentColumn += randomDirection[1]; 
                    tunnelLength++; //the tunnel is now one longer, so lets increment that variable 
                    break;
                } else { 
                    array[currentRow][currentColumn].color = PATH; //set the value of the index in map to 0 (a tunnel, making it one longer) 
                    pathArray.push( array[currentRow][currentColumn]);
                    currentRow += randomDirection[0]; //add the value from randomDirection to row and col (-1, 0, or 1) to update our location 
                    currentColumn += randomDirection[1]; 
                    tunnelLength++; //the tunnel is now one longer, so lets increment that variable 
                } 
            } 
        
            if (tunnelLength) { // update our variables unless our last loop broke before we made any part of a tunnel 
                lastDirection = randomDirection; //set lastDirection, so we can remember what way we went 
                maxTunnels--; // we created a whole tunnel so lets decrement how many we have left to create 
            } 
        }
    // } 
    // return map; // all our tunnels have been created and our map is complete, so lets return it to our render() 
}

function createBuildings(){
    for(var i = 0; i < gridSize; i++){
        for(var j = 0; j <gridSize; j++){
            // if(array[i][j].color == 'yellow'){
            //     break;
            // }
            if( array[i][j].color == GROUND){
                array[i][j].color = 'GoldenRod'
            }
        }
        // x=0;
        // y+=squareSize;
    }
}

function drawGrid(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.restore();

    var x = 0;
    var y = 0;

    for(var i = 0; i < gridSize; i++){
        for(var j = 0; j <gridSize; j++){
            ctx.beginPath();
            ctx.rect(array[i][j].posX, array[i][j].posY, squareSize, squareSize);
            ctx.fillStyle = array[i][j].color;
            ctx.fill();
            ctx.stroke();
        }
        // x=0;
        // y+=squareSize;
    }
}

function clearGrid(){
    gridSize = 0;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.restore();
    array = [];
}
 
// label connected components (regions in the map)
// http://www.aishack.in/tutorials/labelling-connected-components-example/
// https://stackoverflow.com/questions/14465297/connected-component-labelling

// convert the representation to 2d int array, ground = 1 and path = 0
function buildIntArray() {
	for (var i = 0; i < gridSize; i++){
		for (var j = 0; j < gridSize; j++) {
			if (array[i][j].color == GROUND)
				array[i][j].type = 1;
			else if (array[i][j].color == PATH)
				array[i][j].type = 0;
		}
	}
}
// union components if connected
function doUnion(a, b) {
    // get the root component of a and b, and set the one's parent to the other
    while (component[a] != a)
        a = component[a];
    while (component[b] != b)
        b = component[b];
    component[b] = a;
}

function unionCoords(x, y, x2, y2)
{
    if (y2 < gridSize && 
		x2 < gridSize && 
		array[x][y].type == 1 && 
		array[x2][y2].type == 1) {
			doUnion(x*gridSize + y, x2*gridSize + y2);
	}
}
// label the regions and put the result into component array, want to modify this into 2d array
function labelRegions() {
	for (var i = 0; i < gridSize*gridSize; i++)
        component[i] = i;
    for (var x = 0; x < gridSize; x++){
		for (var y = 0; y < gridSize; y++)
		{
			unionCoords(x, y, x+1, y);
			unionCoords(x, y, x, y+1);
		}
	}
    // print the array
	var output = "";
    for (var x = 0; x < gridSize; x++)
    {
        for (var  y = 0; y < gridSize; y++)
        {
            if (array[x][y].type == 0)
            {
                output+= ' ';
                continue;
            }
            var c = x*gridSize + y;
            while (component[c] != c) 
				c = component[c];
            //output += (char)('a'+c);
			output += String.fromCharCode(65+c);
        }
        output += "\n";
    }
	console.log(output);
} 

// shows drawing of path
function drawPath(){

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.restore();

    var x = 0;
    var y = 0;

    for(var i = 0; i < pathArray.length; i++){
        (function(i) {
            setInterval(function() {
                ctx.beginPath();
                ctx.rect(pathArray[i].posX, pathArray[i].posY, squareSize, squareSize);
                ctx.fillStyle = pathArray[i].color;
                ctx.fill();
                ctx.stroke();   
            }, 100*i)
        })(i);
    }
    console.log("Done drawing path");
}

function main(){
    console.log("Main size: " + size);
    getGridSize();
    createGrid();
    // draw();

    createMap();
	buildIntArray();
	labelRegions();
    if(water == "river"){
        createRiver();
    }
    // createMap();
    createBuildings();
    drawGrid();
    // drawPath(); // shows drawing of a path
    //console.log(size);
    //console.log(water);
    //console.log(wall);
    //console.log(selected)
    //console.log(array);
}


// grab user input
$(function(){

 // get which option is selected
 $( ".dropdown" ).on( "click", "a", function() {
  selected = ( $( this ).attr('id') );
  var div = $(this).parent().parent(); 
  var btn = div.find('button');
  btn.text(selected);

  //console.log(selected);
  
  
 });

 // generate button clicked
 $( "#btn-generate" ).on( "click", function() {
  size = $("#size").text();
  water = $("#water").text();
  wall = $("#wall").text();
  console.log("Size: " + size);
  //$("#input-size").text(size);
  //$("#input-water").text(water);
  //$("#input-wall").text(wall);
  //console.log(selected);
 });

 $( "#btn-generate" ).on( "click", function(){
    main();
   });
});

