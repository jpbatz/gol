var cells = []; // contains rows []

$(document).ready(function() {

  var cell = {
    alive: false,
    domDiv: "",
    num_of_live_neighbors: 0,
    next_gen: false
  };

  // grid dimensions - to be specified by user input
  var width = 12;
  var height = 12;

  // bind 'grid_div' as a property
  var grid = $('#grid_div');
  // bind 'controls' as a property
  // this.controls = $('<div id="controls_div">');

  // create grid with dimensions provided by arguments width and height
  // goal:
  //  [
  //    [ {cell}, {cell}, {cell}, {cell},...],
  //    [ {cell}, {cell}, {cell}, {cell},...],
  //            ...
  //    [ {cell}, {cell}, {cell}, {cell},...]
  //  ]
  for(var i=0; i<width; i++) {
    // [                    ]
    var gridRowCell = $('<div>', {
      class: "grid_cell row"
    });

    var row = [];   // creates a new row each iteration, contains cells {}

    for(var j=0; j<height; j++) {
      // [ {}, {}, {}, {},...]
      var gridColCell = $('<div>', {
        class: "grid_cell col"
      });
      gridRowCell.append(gridColCell);
      row.push(
        {
          alive: false,
          domDiv: gridColCell.get(0)
        });
    }
    grid.append(gridRowCell);
    cells.push(row);
  }

  // console.log(cells);

  // generate random seed
  for(var ROW=0; ROW<cells.length; ROW++) {

    for(var COL=0; COL<cells[ROW].length; COL++) {
      var randomValue = Math.floor(Math.random() * 2);
      // console.log(randomValue);
      var randomColor = "white";
      if(randomValue === 0) {
        randomColor = "white";
        cells[ROW][COL].alive = false;
      } else if(randomValue === 1){
        randomColor = "black";
        cells[ROW][COL].alive = true;
      }
      cells[ROW][COL].domDiv.style.backgroundColor = randomColor;
    }
  }

  // count live neighbors for cell at (x,y)
  for(var ROWS1=0; ROWS1<cells.length; ROWS1++) {


    for(var COLS1=0; COLS1<cells[ROWS1].length; COLS1++) {
        
      var number_of_neighbors = countNeighbors(ROWS1,COLS1);
      console.log("neighbor_count for (" + ROWS1 + "," + COLS1 + ") = " + number_of_neighbors);

    }

  }


function countNeighbors(r,c) {

  var neighbor_count = 0;
  var x = r;
  var y = c;

  if(x !== 0 && y !== 0) {
    if(cells[x-1][y-1].alive === true) {
      neighbor_count++;
    }
  }

  if(y !== 0) {
    if(cells[x][y-1].alive === true) {
      neighbor_count++;
    }
  }

  if(x !== cells.length-1 && y !== 0) {
    if(cells[x+1][y-1].alive === true) {
      neighbor_count++;
    }
  }

  if(x !== 0) {
    if(cells[x-1][y].alive === true) {
      neighbor_count++;
    }
  }

  if(x !== cells.length-1) {
    if(cells[x+1][y].alive === true) {
      neighbor_count++;
    }
  }

  if(x !== 0 && y !== cells[x].length-1) {
    if(cells[x-1][y+1].alive === true) {
      neighbor_count++;
    }
  }

  if(y !== cells[x].length-1) {
    if(cells[x][y+1].alive === true) {
      neighbor_count++;
    }
  }

  if(x !== cells.length-1 && y !== cells[x].length-1) {
    if(cells[x+1][y+1].alive === true) {
      neighbor_count++;
    }
  }

  // console.log("neighbor_count for (" + x + "," + y + ") = " + neighbor_count);
  return neighbor_count;

}


});
