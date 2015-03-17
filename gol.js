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
  var height = 16;  // height = rows = y
  var width = 14;   // width = cols = x
  var speed = 500;  // simulation speed

  var grid_data = [];   // data: contains rows []

  // createGrid(height, width, grid);
  createGrid(height, width);

  // create random seed
  generateRandomSeed();

  // manually click to enter seed values

  // load seed from catalog (files)

  // console.log("***** Live Population = " + getPopulation(grid_data) + " *****");

  setTimeout(updateNextGen, speed);
 


// ========================== HELPER FUNCTIONS ==========================

  /**
   * [createGrid]
   * @param  {[Integer]} gridHeight [number of rows to be created]
   * @param  {[Integer]} gridWidth  [number if columns to be created]
   * @return {[type]}               [description]
   */
  // function createGrid(gridHeight, gridWidth, gridData) {
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

        // data: creates new cell in current row
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

    console.log("***** CREATED " + Number(cellNum-1) + " CELLS *****");
  }


  /**
   * generateRandomSeed()
   * @return {[type]} [description]
   */
  function generateRandomSeed() {
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
  }


  /**
   * [getPopulation]
   * @param  {[Array]} grid_array [populated array]
   * @return {[type]}             [description]
   */
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


  /**
   * calcNextGeneration
   * @return {[type]} [description]
   */
  function calcNextGeneration() {
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
          // console.log("[current status] CELL IS ALIVE");
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
          // console.log("[current status] CELL IS DEAD");
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
  }


  /**
   * [countNeighbors]
   * @param  {[Integer]} c [column index]
   * @param  {[Integer]} r [row index]
   * @return {[type]}      [description]
   */
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


  /**
   * displayNextGeneration
   * @return {[type]} [description]
   */
  function displayNextGeneration() {
    console.log("[displayNextGeneration]");
    for(var col3=0; col3<height; col3++) {
      for(var row3=0; row3<width; row3++) {
        console.log("cell " + grid_data[col3][row3].cell_num + " at (" + col3 + "," + row3 + ") is " + grid_data[col3][row3].next_gen);
        var nextGenVal = grid_data[col3][row3].next_gen;
        var nextGenColor = "white";
        if(nextGenVal === false) {
            nextGenColor = "white";
          } else if(nextGenVal === true){
            nextGenColor = "purple";
          }
        grid_data[col3][row3].domDiv.style.backgroundColor = nextGenColor;        
        grid_data[col3][row3].domDiv.innerHTML = grid_data[col3][row3].cell_num;
      }
    }
  } 


/**
 * updateNextGen()
 * @return {[type]} [description]
 */
  function updateNextGen() {
    console.log("[updateNextGen]");
      calcNextGeneration();
      displayNextGeneration();
      setNextGenLifeStatus();
      if(getPopulation(grid_data) > 0) {
        console.log("***** Live Population = " + getPopulation(grid_data) + " *****");
        setTimeout(updateNextGen, 250);
      }
  }


/**
 * setNextGenLifeStatus
 */
  function setNextGenLifeStatus() {
    for(var col4=0; col4<height; col4++) {
      for(var row4=0; row4<width; row4++) {
        grid_data[col4][row4].alive = grid_data[col4][row4].next_gen;
      }
    }
  }

});
