// var grid_data = []; // contains rows []

$(document).ready(function() {
  
  // bind 'grid_view' as a property
  var grid_view = $('#grid_div');
  
  // bind 'controls' as a property
  // this.controls = $('<div id="controls_div">');

  // build grid and data with dimensions provided by arguments height and width
  //  [
  //    [ {cell}, {cell}, {cell}, {cell},...],
  //    [ {cell}, {cell}, {cell}, {cell},...],
  //            ...
  //    [ {cell}, {cell}, {cell}, {cell},...]
  //  ]

  // grid dimensions - to be specified by user input
  var height = 8;  // height = rows = y
  var width = 6;   // width = cols = x

  var grid_data = [];   // data: contains rows []

  createGrid(height, width);

  // enter seed values

  // load seed from catalog (files)

  // generate random seed
  // for(var row1=0; row1<grid_data.length; row1++) {
  //   for(var col1=0; col1<grid_data[row1].length; col1++) {  
  for(var col1=0; col1<height; col1++) {
    for(var row1=0; row1<width; row1++) {
      var randomValue = Math.floor(Math.random() * 2);
      var randomColor = "white";
      if(randomValue === 0) {
        randomColor = "white";
        grid_data[col1][row1].alive = false;
      } else if(randomValue === 1){
        randomColor = "purple";
        grid_data[col1][row1].alive = true;
      }
      grid_data[col1][row1].domDiv.style.backgroundColor = randomColor;
      grid_data[col1][row1].domDiv.innerHTML = grid_data[col1][row1].cell_num;
      console.log("[generate random seed] CELL NUMBER = " + grid_data[col1][row1].cell_num + " for (" + row1 + "," + col1 + ")");
    }
  }

  // count live neighbors for cell at (x,y)
  // for(var row2=0; row2<grid_data.length; row2++) {
  //   for(var col2=0; col2<grid_data[row2].length; col2++) {  
  for(var col2=0; col2<height; col2++) {
    for(var row2=0; row2<width; row2++) {
      var number_of_live_neighbors = countNeighbors(col2,row2);
      console.log("[count neighbors] live neighbor count for: cell_num [" + grid_data[col2][row2].cell_num + "] => (" + row2 + "," + col2 + ") = " + number_of_live_neighbors);
      grid_data[col2][row2].num_of_live_neighbors = number_of_live_neighbors;

      // determine next generation status and set
      var nextGenStatus;

      if(grid_data[col2][row2].alive === true) {
        console.log("[current status] CELL IS ALIVE");
        if(number_of_live_neighbors < 2) {
          nextGenStatus = false;
          console.log("[next gen status] alive cell will die from isolation");
        } else if(number_of_live_neighbors === 2 || number_of_live_neighbors === 3) {
          nextGenStatus = true;
          console.log("[next gen status] alive cell will survive");
        } else if(number_of_live_neighbors > 3) {
          nextGenStatus = false;
          console.log("[next gen status] alive cell will die from overcrowding");
        }
      } else if(grid_data[col2][row2].alive === false) {
        console.log("[current status] CELL IS DEAD");
        if(number_of_live_neighbors === 3) {
          nextGenStatus = true;
          console.log("[next gen status] dead cell will regenerate");
        } else {
          console.log("[next gen status] dead cell will remain dead");
        }
      }
      grid_data[col2][row2].next_gen = nextGenStatus;
    }

  }

  console.log("Live Population = " + getPopulation(grid_data));

// HELPER FUNCTIONS

  function createGrid(gridHeight, gridWidth) {

    var cellNum = 1;

    for(var i=0; i<gridHeight; i++) {

      // view: creates a new row
      var gridRow = $('<div>', {
        class: "grid_row"
      });

      // data: creates a new row
      var row = [];   

      for(var j=0; j<gridWidth; j++) {

        // view: creates a new cell in current row
        var gridColCell = $('<div>', {
          class: "grid_col_cell"
        });
        gridRow.append(gridColCell);

        row.push({
            cell_num: cellNum,
            alive: false,
            domDiv: gridColCell.get(0),
            num_of_live_neighbors: 0,
            next_gen: false
        });
        
        console.log("[create grid] new cell number: " + cellNum + " at (" + j + "," + i + ")");
        cellNum++;

      }

      // view: attach row to grid
      grid_view.append(gridRow);

      // data: attach row to grid
      grid_data.push(row);
    }

    console.log("***** " + Number(cellNum-1) + " CELLS *****");
  }

  function getPopulation(grid_array) {
    var popCount = 0;
    for(var i=0; i<grid_array.length; i++) {
      for(var j=0; j<width; j++) {
        if(grid_array[i][j].alive === true) {
          popCount++;
        }
      }
    }
    return popCount;
  }

  function countNeighbors(c,r) {

    var neighbor_count = 0;
    var x = c;
    var y = r;

    if(x !== 0 && y !== 0) {
      if(grid_data[x-1][y-1].alive === true) {
        neighbor_count++;
      }
    }

    if(y !== 0) {
      if(grid_data[x][y-1].alive === true) {
        neighbor_count++;
      }
    }

    if(x !== grid_data.length-1 && y !== 0) {
      if(grid_data[x+1][y-1].alive === true) {
        neighbor_count++;
      }
    }

    if(x !== 0) {
      if(grid_data[x-1][y].alive === true) {
        neighbor_count++;
      }
    }

    if(x !== grid_data.length-1) {
      if(grid_data[x+1][y].alive === true) {
        neighbor_count++;
      }
    }

    if(x !== 0 && y !== grid_data[x].length-1) {
      if(grid_data[x-1][y+1].alive === true) {
        neighbor_count++;
      }
    }

    if(y !== grid_data[x].length-1) {
      if(grid_data[x][y+1].alive === true) {
        neighbor_count++;
      }
    }

    if(x !== grid_data.length-1 && y !== grid_data[x].length-1) {
      if(grid_data[x+1][y+1].alive === true) {
        neighbor_count++;
      }
    }

    return neighbor_count;

  }


});
