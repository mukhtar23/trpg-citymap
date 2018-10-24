// user input
var size;
var water;
var wall;
var selected;

var gridSize = 0;
var squareSize = 30;
var array = [];

function getGridSize(){
    if (size == 'small'){
        gridSize = 10;
    }else if(size == 'medium'){
        gridSize = 17;
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
            square.color = "white";
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

function drawGrid(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var x = 0;
    var y = 0;

    for(var i = 0; i < gridSize; i++){
        for(var j = 0; j <gridSize; j++){
            ctx.rect(array[i][j].posX, array[i][j].posY, squareSize, squareSize);
            ctx.fillStyle = array[i][j].color;
            ctx.fill();
            ctx.stroke();
        }
        // x=0;
        // y+=squareSize;
    }
}

function draw() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var x = 0;
    var y = 0;
    
    for(var i = 0; i < gridSize; i++){
        for(var j = 0; j <gridSize; j++){
            ctx.rect(x, y, squareSize, squareSize);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.stroke();
            x+=squareSize;
        }
        x=0;
        y+=squareSize;
    }
    // ctx.rect(x, y, 50, 50);
    // ctx.fillStyle = "white";
    // ctx.fill();
    // ctx.stroke();

//   ctx.clearRect(45, 45, 60, 60);
//   ctx.strokeRect(50, 50, 50, 50);
}

function clearGrid(){
    gridSize = 0;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.restore();
}
  
function main(){
    console.log("Main size: " + size);
    getGridSize();
    createGrid();
    // draw();
    drawGrid();
    console.log(size);
    console.log(water);
    console.log(wall);
    console.log(selected)
    console.log(array);
}

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
  $("#input-size").text(size);
  $("#input-water").text(water);
  $("#input-wall").text(wall);
  //console.log(selected);
 });

 $( "#btn-generate" ).on( "click", function(){
    main();
   });
});

