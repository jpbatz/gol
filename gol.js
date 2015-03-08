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

  // generate random seed
  for(var row1=0; row1<cells.length; row1++) {
    for(var col1=0; col1<cells[row1].length; col1++) {
      var randomValue = Math.floor(Math.random() * 2);
      var randomColor = "white";
      if(randomValue === 0) {
        randomColor = "white";
        cells[row1][col1].alive = false;
      } else if(randomValue === 1){
        randomColor = "purple";
        cells[row1][col1].alive = true;
      }
      cells[row1][col1].domDiv.style.backgroundColor = randomColor;
    }
  }

  // count live neighbors for cell at (x,y)
  for(var row2=0; row2<cells.length; row2++) {
    for(var col2=0; col2<cells[row2].length; col2++) {
      var number_of_live_neighbors = countNeighbors(row2,col2);
      console.log("neighbor_count for (" + row2 + "," + col2 + ") = " + number_of_live_neighbors);
      cells[row2][col2].num_of_live_neighbors = number_of_live_neighbors;

      // determine next generation status and set
      var nextGenStatus;

      if(cells[row2][col2].alive === true) {
        if(number_of_live_neighbors < 2) {
          nextGenStatus = false;        // 
        } else if(number_of_live_neighbors === 2 || number_of_live_neighbors ===3) {
          nextGenStatus = true;
        } else if(number_of_live_neighbors > 3) {
          nextGenStatus = false;
        }
      } else if(cells[row2][col2].alive === false) {
        if(number_of_live_neighbors === 3) {
          nextGenStatus = true;
        }
      }
      cells[row2][col2].next_gen = nextGenStatus;
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

    return neighbor_count;

  }


});
