// user input
var size;
var water;
var wall;
var selected;

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
  $("#input-size").text(size);
  $("#input-water").text(water);
  $("#input-wall").text(wall);
  //console.log(selected);
  
  
 });
});