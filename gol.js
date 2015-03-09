// var cells = []; // contains rows []

$(document).ready(function() {
  
  var cells = []; // contains rows []

  var cell = {
    cell_num: 0,
    alive: false,
    domDiv: "",
    num_of_live_neighbors: 0,
    next_gen: false
  };

  // grid dimensions - to be specified by user input
  var height = 12;  // height = rows = y
  var width = 12;   // width = cols = x

  // bind 'grid_div' as a property
  var grid = $('#grid_div');
  // bind 'controls' as a property
  // this.controls = $('<div id="controls_div">');

  // build grid with dimensions provided by arguments height and width
  //  [
  //    [ {cell}, {cell}, {cell}, {cell},...],
  //    [ {cell}, {cell}, {cell}, {cell},...],
  //            ...
  //    [ {cell}, {cell}, {cell}, {cell},...]
  //  ]
  var cellNum = 1;
  for(var i=0; i<height; i++) {
    // [                    ]
    var gridRowCell = $('<div>', {
      class: "grid_cell row"
    });

    var row = [];   // creates a new row each iteration, contains cells {}

    for(var j=0; j<width; j++) {
      var gridColCell = $('<div>', {
        class: "grid_cell col"
      });
      gridRowCell.append(gridColCell);
      row.push(
        {
          cell_num: cellNum,
          alive: false,
          domDiv: gridColCell.get(0)
        });
      cellNum++;
    }
    grid.append(gridRowCell);
    cells.push(row);
  }

  console.log("***** " + Number(cellNum-1) + " CELLS *****");

  // generate random seed
  for(var row1=0; row1<cells.length; row1++) {
    for(var col1=0; col1<cells[row1].length; col1++) {
      var randomValue = Math.floor(Math.random() * 2);
      var randomColor = "white";
      if(randomValue === 0) {
        randomColor = "white";
        cells[col1][row1].alive = false;
      } else if(randomValue === 1){
        randomColor = "purple";
        cells[col1][row1].alive = true;
      }
      cells[col1][row1].domDiv.style.backgroundColor = randomColor;
      cells[col1][row1].domDiv.innerHTML = cells[col1][row1].cell_num;
    }
  }

  // count live neighbors for cell at (x,y)
  for(var row2=0; row2<cells.length; row2++) {
    for(var col2=0; col2<cells[row2].length; col2++) {
      var number_of_live_neighbors = countNeighbors(col2,row2);
      console.log("live neighbor count for (" + col2 + "," + row2 + ") = " + number_of_live_neighbors);
      cells[col2][row2].num_of_live_neighbors = number_of_live_neighbors;

      // determine next generation status and set
      var nextGenStatus;

      if(cells[col2][row2].alive === true) {
        if(number_of_live_neighbors < 2) {
          nextGenStatus = false;
          console.log("alive cell will die from isolation");
        } else if(number_of_live_neighbors === 2 || number_of_live_neighbors === 3) {
          nextGenStatus = true;
          console.log("alive cell will survive");
        } else if(number_of_live_neighbors > 3) {
          nextGenStatus = false;
          console.log("alive cell will die from overcrowding");
        }
      } else if(cells[col2][row2].alive === false) {
        if(number_of_live_neighbors === 3) {
          nextGenStatus = true;
          console.log("dead cell will regenerate");
        }
      }
      cells[col2][row2].next_gen = nextGenStatus;
    }

  }
 


  function countNeighbors(c,r) {

    var neighbor_count = 0;
    var x = c;
    var y = r;

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
