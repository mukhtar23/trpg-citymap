// jsonfiy this
var json = [
                { "building_type":"Tavern", "max_width":5, "max_length":3, "max_height":90, "center_possibility": 0.3, "feathering_possibility":0.3, "outside_possibility":0.1, "base_color": "#ff0000"},
                { "building_type":"Shop", "max_width":5, "max_length":3, "max_height":60, "center_possibility": 0.4, "feathering_possibility":0.2, "outside_possibility":0.1,  "base_color": "#00ff00"},
                { "building_type":"House", "max_width":5, "max_length":5, "max_height":100,  "center_possibility": 0.05, "feathering_possibility":0.1, "outside_possibility":0.6, "base_color": "#0000ff"},
                { "building_type":"Blacksmith", "max_width":5, "max_length":2, "max_height":60, "center_possibility": 0.05, "feathering_possibility":0.3, "outside_possibility":0.1, "base_color": "#ffff00"},
                { "building_type":"Temple", "max_width":5, "max_length":5, "max_height":200, "center_possibility": 0.2, "feathering_possibility":0.1, "outside_possibility":0.1, "base_color": "#ff00ff"}              
                
            ];
var myJSON = JSON.stringify(json);


// color lerping
// https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
/**
 * A linear interpolator for hexadecimal colors
 * @param {String} a
 * @param {String} b
 * @param {Number} amount
 * @example
 * // returns #7F7F7F
 * lerpColor('#000000', '#ffffff', 0.5)
 * @returns {String}
 */
function lerpColor(a, b, amount) { 

    var ah = +a.replace('#', '0x'),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = +b.replace('#', '0x'),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}
// user input
var size;
var water;
var wall;
var selected;
var viewer3d;

var gridSize = 0;
var squareSize = 30;

var array = [];
var labels = [];
var component = [];

const GROUND = 'white';
const PATH = 'grey';
const WATER = 'Blue';
const BUILDING = 'GoldenRod'
const BRIDGE = 'Brown';

// buildings //
const TAVERN = "#B05F3C"; // some brown
const SHOP = "#B96F6F"; // some silver
const FARM = "#FFF7B7"; // some gold
const TEMPLE = "#F3E7E7"; // some light grey
const HOUSE = "#FF7575"; // some brick red

var radius = 0;
var feather_radius = 0;
var numOfNeighborhoods = 0;
var neighborhoods = {};


var pathArray = [];
var waterArray = [];

// determine all size-based constant here
function init() {	
	if (size == 'small'){
		gridSize = 13;
        radius = 3;
		feather_radius = 2;
		numOfNeighborhoods = 1;
    }else if(size == 'medium'){
        gridSize = 19;
		radius = 4;
		feather_radius = 3;
		numOfNeighborhoods = 2;
    }else if(size == 'large'){
        gridSize = 25;
		radius = 6;
		feather_radius = 5;
		numOfNeighborhoods = 3;
    }
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
    waterArray = [];

    var startingSide = Math.floor(Math.random()*4);
    var startingLocation = getStartingLocation(startingSide);

    var currentRow = startingLocation[0];
    var currentColumn = startingLocation[1];

    var toBuild = true;

    lastDir = [];
    var randomDirection = getStartingDirection(startingSide);

    while(toBuild){
        if (((currentRow === 0) && (randomDirection[0] === -1)) || 
        ((currentColumn === 0) && (randomDirection[1] === -1)) || 
        ((currentRow === gridSize - 1) && (randomDirection[0] === 1)) || 
        ((currentColumn === gridSize - 1) && (randomDirection[1] === 1))) { 
            toBuild = false;
            // break; 
        }
        array[currentRow][currentColumn].color = WATER;
        array[currentRow][currentColumn].startingSide = startingSide;
        waterArray.push(array[currentRow][currentColumn]);
        currentRow += randomDirection[0];
        currentColumn += randomDirection[1];
        lastDir = randomDirection;
        var favDir = getStartingDirection(startingSide);

        randomDirection = chooseDirection(lastDir, favDir);

    }

}

function chooseDirection(prevDir, favorDir){

    var nd = [];
    var newDir = Math.floor(Math.random()*5);

    if(prevDir[2] == "south" && newDir == 0){
        chooseDirection(prevDir, favorDir);
    } else if(prevDir[2] == "west" && newDir == 1){
        chooseDirection(prevDir, favorDir);
    }else if(prevDir[2] == "north" && newDir == 2){
        chooseDirection(prevDir, favorDir);
    }else if(prevDir[2] == "east" && newDir == 3){
        chooseDirection(prevDir, favorDir);
    } else if (newDir == 4){
        return favorDir;
    }
    var temp = getNewDirection(newDir);
    var opp = oppDir(favorDir);
    if(temp[2] == opp[2]){
        return favorDir;
    }else{
        nd = temp;
    }
    return nd;
}

function oppDir(prevDir){
    switch(prevDir[2]){
        case "north":
            return [1, 0, "south"];
        case "east":
            return [0,-1, "west"];
        case "south":
            return [-1,0, "north"];
        case "west":
            return [0,1,"east"]
    }
}

function getNewDirection(newDir){
    var dir;
    if(newDir == 0){
        dir = [-1, 0, "north"];
    }else if (newDir == 1){
        dir = [0,1, "east"];
    }else if(newDir == 2){
        dir = [1,0, "south"];
    }else if(newDir == 3){
        dir = [0,-1, "west"];
    }
    return dir;
}
function getStartingLocation(startingSide){
    var side;
    // 0 - N, 1 - E, 2 - S, 3 - W
    if(startingSide == 0){
        side = [0, Math.floor(Math.random()*gridSize), "north"];
    }else if (startingSide == 1){
        side = [Math.floor(Math.random()*gridSize), gridSize-1, "east"];
    }else if(startingSide == 2){
        side = [gridSize-1, Math.floor(Math.random()*gridSize), "south"];
    }else if(startingSide == 3){
        side = [Math.floor(Math.random()*gridSize), 0, "west"];
    }
    return side;
}

function getStartingDirection(startingSide){
    var dir;
    if(startingSide == 0){
        dir = [1, 0, "south"];
    }else if (startingSide == 1){
        dir = [0,-1, "west"];
    }else if(startingSide == 2){
        dir = [-1,0, "north"];
    }else if(startingSide == 3){
        dir = [0,1, "east"];
    }
    return dir;
}

//lets create a randomly generated map for our dungeon crawler 
function createPath() { 
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
                array[i][j].color = BUILDING;
            }
        }
        // x=0;
        // y+=squareSize;
    }
}

function createBridges(){
    for(var i = 0; i < gridSize; i++){
        for(var j = 0; j <gridSize; j++){
            // if(array[i][j].color == 'yellow'){
            //     break;
            // }
            if( array[i][j].color == WATER){
                // water is going north or south
                // check above and below a water block to see if there is a path there
                if(array[i][j].startingSide == 0 || array[i][j].startingSide == 2){
                    
                    if(j == 0 || j == gridSize - 1 ){
                        continue;
                    }
                    if((array[i][j-1].color == PATH && array[i][j+1].color == PATH)){
                    array[i][j].color = BRIDGE;
                    }
                
                }
                // water is going east or west
                // check left and right of water block to see if there is a path there
                else if (array[i][j].startingSide == 1 || array[i][j].startingSide == 3){
                   
                    if(i == 0 || i == gridSize -1){
                        continue;
                    }

                    if((array[i-1][j].color == PATH && array[i+1][j].color == PATH)){
                        array[i][j].color = BRIDGE;
                    }
                }
                // if(i == 0 || i == gridSize - 1 || j == 0 || j == gridSize -1){
                //     continue;
                // }
                // if((array[i-1][j].color == PATH && array[i+1][j].color == PATH) || 
                //         array[i][j-1].color == PATH && array[i][j+1].color == PATH ){
                //     array[i][j].color = BRIDGE;
                // }
                
            }
            // if(array[i][j].color == WATER){
            //     array[i][j].color = BRIDGE;
            // }
        }
        // x=0;
        // y+=squareSize;
    }
}

function drawMap(){
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
			array[x][y].section = c;
        }
        output += "\n";
    }
	//console.log(output);
} 

// placeholder for building

// Find random spot (idea from strangeloop local maxima) as region center
// Decide radius and feathering radius

//loop at each cell by row
// check what area (in radius, in feathering, not in any)
// generate and grow 
// Figure out which region is a neighborhood in radius (eat all region or keep it connected)
// Decide what will be in same region

//how to differentiate same type shops with different names?
// maybe half random color, half type color?

// output: array of coord for points [x1, y1, (x2, y2 ...)]
function createNeighborhoodCenter(gridSize, numOfPoints) {
	//return coord for neighborhood center
	neighborhoods = {}; // clear it
    for (var i=0; i<numOfPoints; i++) {
		var x = Math.floor((Math.random() * gridSize) + 1);
		var y = Math.floor((Math.random() * gridSize) + 1);
        neighborhoods[i] = {};
        neighborhoods[i].type = chooseNeighborhoodType(json);
        neighborhoods[i].x = x;
		neighborhoods[i].y = y;
	}
}
 
function fillBuildings() {
	createNeighborhoodCenter(gridSize, numOfNeighborhoods);
	console.log(neighborhoods);
	var debug_neighborhoodview = "";
    var x = 0;
    while (x < gridSize) {
        var y = 0;
        while (y < gridSize) {
            var neighborhood_id = getWhichNeighborhood(x,y);
            
			debug_neighborhoodview += neighborhood_id;
            //console.log(array[x][y].color)
            if (array[x][y].color == BUILDING) { // build a building on the ground!
                
                var chosen_building_key= generateBuilding(neighborhood_id, x, y);

                var building_color = lerpColor('#ffffff', json[chosen_building_key].base_color, Math.random());
                var adjPaths = getBuildingDirection(x,y);
                var building_width = Math.floor(Math.random() * json[chosen_building_key].max_width) + 1; // 1 to max_width
                var building_length = Math.floor(Math.random() * json[chosen_building_key].max_length) + 1; // 1 to max_length
                var building_height = Math.floor(Math.random() * json[chosen_building_key].max_height) + 40; // 15 to max_height

                // from left to right, top to down, horizontal rows
                if (adjPaths === "u" ||
                    adjPaths === "ul" ||
                    adjPaths === "ur" ||
                    adjPaths === "ub" || 
                    adjPaths === "ubl" ||
                    adjPaths === "ubr" ||
                    adjPaths === "ulr") {
                    // get building max width
                    
                    // check the next few cells is enough for this building
                    var empty_right_cells = 0;
                    for (var i=0; i<building_width; i++) {
                        if (y+i < gridSize && array[x][y+i].color == BUILDING) 
                            empty_right_cells++;
                        else 
                            break;
                    }
                    // take the minimum one
                    var this_building_width = Math.min(building_width, empty_right_cells);
                    
                    // color the current building width
                    for (var i=0; i<this_building_width; i++) {
                        array[x][y+i].color = building_color;
                        array[x][y+i].building_height = building_height;

                        // grow the building inward as well
                        // check the next few cells is enough for this building
                        var empty_down_cells = 0;
                        for (var j=1; j<building_length; j++) {
                            if (x+j < gridSize && array[x+j][y+i].color == BUILDING) 
                                empty_down_cells++;
                            else 
                                break;
                        }
                        var row_building_length = Math.min(building_length, empty_down_cells);
                        if (row_building_length > 0) {    
                            for (var j=0; j<row_building_length; j++) {
                                array[x+j][y+i].color = building_color;
                                array[x+j][y+i].building_height = building_height;
                            }
                        } 
                    }
                // left to right
                } else if (adjPaths === "l" ||
                           adjPaths === "lr" ) {
                    
                    // check the next few cells is enough for this building
                    var empty_right_cells = 0;
                    for (var i=0; i<building_width; i++) {
                        if (x+i < gridSize && array[x+i][y].color == BUILDING) 
                            empty_right_cells++;
                        else 
                            break;
                    }
                    // take the minimum one
                    var this_building_width = Math.min(building_width, empty_right_cells);
                    
                    // color the current building width
                    for (var i=0; i<this_building_width; i++) {
                        array[x+i][y].color = building_color;
                        array[x+i][y].building_height = building_height;

                        // grow the building inward as well
                        // check the next few cells is enough for this building
                        var empty_down_cells = 0;
                        for (var j=1; j<building_length; j++) {
                            if (y+j < gridSize && array[x+i][y+j].color == BUILDING) 
                                empty_down_cells++;
                            else 
                                break;
                        }
                        var row_building_length = Math.min(building_length, empty_down_cells);
                        if (row_building_length > 0) {    
                            for (var j=0; j<row_building_length; j++) {
                                array[x+i][y+j].color = building_color;
                                array[x+i][y+j].building_height = building_height;
                            }
                        } 
                    }
                } else if (adjPaths === "b" ||
                           adjPaths === "bl" ||
                           adjPaths === "blr") {
                    
                                 // get building max width
                    
                    // check the next few cells is enough for this building
                    var empty_right_cells = 0;
                    for (var i=0; i<building_width; i++) {
                        if (y+i < gridSize && array[x][y+i].color == BUILDING) 
                            empty_right_cells++;
                        else 
                            break;
                    }
                    // take the minimum one
                    var this_building_width = Math.min(building_width, empty_right_cells);
                    
                    // color the current building width
                    for (var i=0; i<this_building_width; i++) {
                        array[x][y+i].color = building_color;
                        array[x][y+i].building_height = building_height;
                        // grow the building inward as well
                        // check the next few cells is enough for this building
                        var empty_down_cells = 0;
                        for (var j=1; j<building_length; j++) {
                            if (x-j >= 0 && array[x-j][y+i].color == BUILDING) 
                                empty_down_cells++;
                            else 
                                break;
                        }
                        var row_building_length = Math.min(building_length, empty_down_cells);
                        if (row_building_length > 0) {    
                            for (var j=0; j<row_building_length; j++) {
                                array[x-j][y+i].color = building_color;
                                array[x-j][y+i].building_height = building_height;
                            }
                        } 
                    }
                // right to left
                } else if (adjPaths === "r" ||
                           adjPaths === "br" ) {
                    // check the next few cells is enough for this building
                    var empty_right_cells = 0;
                    for (var i=0; i<building_width; i++) {
                        if (x+i < gridSize && array[x+i][y].color == BUILDING) 
                            empty_right_cells++;
                        else 
                            break;
                    }
                    // take the minimum one
                    var this_building_width = Math.min(building_width, empty_right_cells);
                    
                    // color the current building width
                    for (var i=0; i<this_building_width; i++) {
                        array[x+i][y].color = building_color;
                        array[x+i][y].building_height = building_height;
                        // grow the building inward as well
                        // check the next few cells is enough for this building
                        var empty_down_cells = 0;
                        for (var j=1; j<building_length; j++) {
                            if (y-j < gridSize && array[x+i][y-j].color == BUILDING) 
                                empty_down_cells++;
                            else 
                                break;
                        }
                        var row_building_length = Math.min(building_length, empty_down_cells);
                        if (row_building_length > 0) {    
                            for (var j=0; j<row_building_length; j++) {
                                array[x+i][y-j].color = building_color;
                                array[x+i][y-i].building_height = building_height;
                            }
                        } 
                    }
                }
            }
            
			// check if it is in a neighborhood
            //if (array[x][y].type == 0) {
            //    continue;
            //}
            y+=1;
        }
        debug_neighborhoodview += "\n";
        x+=1;
    }

	console.log(debug_neighborhoodview);
}
// return id of the neighborhood, or -1 if not in any
function getWhichNeighborhood (x,y) { 

	//if (neighborhoodCoords.length != numOfNeighborhoods*2) {
	//	console.log("Error: neighborhoodCoords.length does not match numOfNeighborhoods!");
	//	return;
	//}
	
	var neighborhoodId = -1;
	// loop through each neighborhoods
    for (var key in neighborhoods){
        var cx = neighborhoods[key].x;
		var cy = neighborhoods[key].y;
    	var distance = Math.ceil(Math.sqrt((Math.pow(x-cx,2) + Math.pow(y-cy,2))));
		//console.log(distance);

		if (distance <　radius) {
			return key;
		} else if (distance < radius+feather_radius) {
			return key+0.5;
		} 
	}
	//return -1 if not in any neighborhood
	return neighborhoodId;
}
//input: coordinate of the building
// output: string that what is 
function getBuildingDirection(x,y) {
    var adjCells = [0,0,0,0];
	var str = "";
    //console.log(x+","+y);
    if (y !=0 && array[x][y-1].color === PATH ) adjCells[0]=1;
    if (y != gridSize-1 && array[x][y+1].color === PATH) adjCells[1]=1;
    if (x != 0 && array[x-1][y].color === PATH) adjCells[2]=1;
    if (x != gridSize-1 && array[x+1][y].color === PATH) adjCells[3]=1;
    // u b l r
    if (adjCells[2]==1) str+="u"; // l
    if (adjCells[3]==1) str+="b"; //r
    if (adjCells[0]==1) str+="l"; //u
	if (adjCells[1]==1) str+="r"; //b
    
    //console.log(str);
	
    // handle edge cases
	// 0. facing 0 side - inside region... don't touch 
	// 1. facing 1 side - adjacent to other blocks

	// 2. facing 2 side - corner
	// 3. facing 3 side - extruded
	// 4. facing 4 sides - isolated
	return str;
	
}
// randomly choose a neighborhood type from the available list
// input: array in json file for possible building types
// output: key (building_type) for the chosen entry
function chooseNeighborhoodType(json) {
    //var randomType = json[Math.random() * json.length | 0];
    var random_type_key = Math.random() * json.length | 0
    return random_type_key; 
}

//input: neighborhood_id, x, y
//output: dictionary key for the selected building type 
function generateBuilding(neighborhood_id, x, y) {
    var chosen_building_key = 0;
    // neighborhood_id -> get dtermine building type
    if (neighborhood_id == -1) { // outside
        var randomNumber = Math.floor(Math.random() * 100) + 1 // 1 to 100
        var current_index = 0;
        for (key in json) {
            current_index += 10 * json[key]['outside_possibility'];
            if (randomNumber < current_index) {
                chosen_building_key = key;
                break;
            }
        }
    } else if (neighborhood_id % 1 == 0.5) {// feathering
        var center_id = neighborhood_id - 0.5;

        var randomNumber = Math.floor(Math.random() * 100) + 1 // 1 to 100
        var current_index = 0;
        for (key in json) {
            current_index += 10 * json[key]['feathering_possibility'];
            if (randomNumber < current_index) {
                chosen_building_key = key;
                break;
            }
        }
    } else { // eighborhood center
        chosen_building_key = neighborhoods[neighborhood_id].type;
        //for (key in json) {
        //    if (neighborhoods[neighborhood_id].type == json[key].building_type)
        //        return key;
        //}        
    }
    return chosen_building_key;
}
// end of placeholder for building
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

// shows water being created
function drawWater(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.restore();

    var x = 0;
    var y = 0;

    for(var i = 0; i < waterArray.length; i++){
        (function(i) {
            setInterval(function() {
                ctx.beginPath();
                ctx.rect(waterArray[i].posX, waterArray[i].posY, squareSize, squareSize);
                ctx.fillStyle = waterArray[i].color;
                ctx.fill();
                ctx.stroke();   
            }, 100*i)
        })(i);
    }
    console.log("Done drawing path");
}


function clearGrid(){
    gridSize = 0;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.restore();
    array = [];
}
 
function main(){
    console.log("Main size: " + size);
    init();
    createGrid();
    // draw();

    createPath();
	buildIntArray();
	labelRegions();


    // createPath();
    createBuildings();

    if(water == "river"){
        createRiver();
        createBridges();
    }
    fillBuildings();
        
    drawMap();
    // drawPath(); // shows drawing of path
    // drawWater(); // shows drawing of water
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
	iframe.contentWindow.postMessage({call:'sendValue', value: array}, '*');

   });
   
iframe.onload = function() {
	// contentWindow is set!	
};
iframe.src = 'misc_controls_pointerlock.html';
document.getElementById("frame3d").appendChild(iframe);
});
var iframe = document.createElement('iframe');
iframe.width = 1920;
iframe.height = 1080;
