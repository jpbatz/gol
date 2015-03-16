$(document).ready(function() {
  
  // bind 'grid_view' as a property
  var grid_view = $('#grid_div');
  
  // bind 'controls' as a property
  // this.controls = $('<div id="controls_div">');

  // var seed_template = [
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  // ];

  // var seed_glider = [
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  //   [1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
  // ];

  // var seed = [
  //   [0, 0, 0, 0, 0, 0],
  //   [0, 0, 1, 1, 0, 0],
  //   [0, 1, 1, 1, 1, 0],
  //   [1, 1, 1, 1, 1, 1],
  //   [0, 1, 1, 1, 1, 0],
  //   [0, 0, 1, 1, 0, 0],
  //   [0, 0, 0, 0, 0, 0]
  // ];

  // var seed_test = [
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 1, 1, 0],
  //   [0, 1, 1, 0, 0],
  //   [0, 0, 1, 0, 0],
  //   [0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0]
  // ];

  var seed_test = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];


  // grid dimension defaults
  var height = 5;  // height = rows = y
  var width = 5;   // width = cols = x
  var speed = 50;  // simulation speed

  var grid_data = [];   // data: contains rows []

  var runMode = prompt("Enter seed method (R)andom, (M)anual, or (F)ile: ");

  if(runMode.toUpperCase() === "R") {
    runMode = "random";
  } else if(runMode.toUpperCase() === "M") {
    runMode = "manual";
  } else if(runMode.toUpperCase() === "F") {
    runMode = "catalog";
  }

  speed = prompt("Enter speed (in msec):");

  console.log("Mode: " + runMode);


  if(runMode === "random") {

    height = prompt("Enter grid height:");  // height = rows = y
    width = prompt("Enter grid width:");   // width = cols = x

    console.log("Creating a grid with dimensions = " + height + "x" + width + " (height x width)");

    // createGrid(height, width, grid);
    createGrid(height, width);
    // create random seed
    generateRandomSeed();
    // display grid
    displayGrid();

    // process subsequent generations
    updateNextGen();

  } else if(runMode === "manual") {

    height = prompt("Enter grid height:");  // height = rows = y
    width = prompt("Enter grid width:");   // width = cols = x

    console.log("Creating a grid with dimensions = " + height + "x" + width + " (height x width)");

    // createGrid(height, width, grid);
    createGrid(height, width);

    // manually click cells to enter seed values



    // display grid()
    displayGrid();

    // process subsequent generations
    updateNextGen();

  } else if(runMode === "catalog") {

    // seed_file = prompt("Select File...");
    seed_file = seed_test;
    height = seed_file.length;
    width = seed_file[0].length;
    // console.log(seed_file);

    console.log("Creating a grid with dimensions = " + height + "x" + width + " (height x width)");

    // createGrid(height, width, grid);
    createGrid(height, width);

    // load seed from catalog (files)
    loadFileSeed();

    // display grid
    displayGrid();

    // process subsequent generations
    updateNextGen();

  } else {
    console.log("Invalid selection");
  }

 


// ========================== HELPER FUNCTIONS ==========================

  /**
   * createGrid()
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
            num_live_neighbors: 0,
            next_gen: false
        });
        
        console.log("[create grid] new cell number: " + cellNum + " at (" + i + "," + j + ")");
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
    for(var row1=0; row1<height; row1++) {
      for(var col1=0; col1<width; col1++) {
        var randomValue = Math.floor(Math.random() * 2);
        if(randomValue === 0) {
          grid_data[row1][col1].alive = false;
        } else if(randomValue === 1){
          grid_data[row1][col1].alive = true;
        }
        console.log("[generate random seed] CELL NUMBER = " + grid_data[row1][col1].cell_num + " for (" + col1 + "," + row1 + ") alive = " + grid_data[row1][col1].alive);
      }
    }
  }


  /**
   * loadFileSeed()
   * @return {[type]} [description]
   */
  function loadFileSeed() {
    // load seed from catalog (files)
    for(var row5=0; row5<height; row5++) {
      for(var col5=0; col5<width; col5++) {
        var fileCellValue = seed_file[row5][col5];
        if(fileCellValue === 0) {
          grid_data[row5][col5].alive = false;
        } else if(fileCellValue === 1){
          grid_data[row5][col5].alive = true;
        }
        console.log("[load file seed] CELL NUMBER = " + grid_data[row5][col5].cell_num + " for (" + row5 + "," + col5 + ") alive = " + grid_data[row5][col5].alive);
      }
    }
  }


  /**
   * displayGrid()
   * @return {[type]} [description]
   */
  function displayGrid() {
    for(var row1a=0; row1a<height; row1a++) {
      for(var col1a=0; col1a<width; col1a++) {
        var cellColor = "white";
        if(grid_data[row1a][col1a].alive === false) {
          cellColor = "white";
        } else if(grid_data[row1a][col1a].alive === true){
          cellColor = "purple";
        }
        grid_data[row1a][col1a].domDiv.style.backgroundColor = cellColor;
        grid_data[row1a][col1a].domDiv.innerHTML = grid_data[row1a][col1a].cell_num;
        console.log("[display grid] CELL NUMBER = " + grid_data[row1a][col1a].cell_num + " for (" + row1a + "," + col1a + ") alive = " + grid_data[row1a][col1a].alive);
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
   * calcNextGeneration()
   * @return {[type]} [description]
   */
  function calcNextGeneration() {
    // count live neighbors for cell at (x,y)
    for(var row2=0; row2<height; row2++) {
      for(var col2=0; col2<width; col2++) {
        var numLiveNeighbors = countNeighbors(row2,col2);
        grid_data[row2][col2].num_live_neighbors = numLiveNeighbors;
        console.log("[calc next gen] live neighbor count for: cell_num [" + grid_data[row2][col2].cell_num + "] => (" + row2 + "," + col2 + ") = " + grid_data[row2][col2].num_live_neighbors);

        // determine next generation status and set
        var nextGenStatus;

        if(grid_data[row2][col2].alive === true) {
          if(numLiveNeighbors < 2) {
            nextGenStatus = false;
            console.log("[next gen status] alive cell will die from isolation");
          } else if(numLiveNeighbors === 2 || numLiveNeighbors === 3) {
            nextGenStatus = true;
            console.log("[next gen status] alive cell will survive");
          } else if(numLiveNeighbors > 3) {
            nextGenStatus = false;
            console.log("[next gen status] alive cell will die from overcrowding");
          }
        } else if(grid_data[row2][col2].alive === false) {
          if(numLiveNeighbors === 3) {
            nextGenStatus = true;
            console.log("[next gen status] dead cell will regenerate");
          } else {
            nextGenStatus = false;
            console.log("[next gen status] dead cell will remain dead");
          }
        }
        grid_data[row2][col2].next_gen = nextGenStatus;
        console.log("next gen status: " + grid_data[row2][col2].next_gen);
      }
    }
  }


  /**
   * countNeighbors()
   * @param  {[Integer]} c [column index]
   * @param  {[Integer]} r [row index]
   * @return {[type]}      [description]
   */
  function countNeighbors(r,c) {

    var neighbor_count = 0;
    var y = r;
    var x = c;

    if(y !== 0 && x !== 0) {
      if(grid_data[y-1][x-1].alive === true) {
        neighbor_count++;
      }
    }
    if(y !== 0) {
      if(grid_data[y-1][x].alive === true) {
        neighbor_count++;
      }
    }
    if(y !== 0 && x !== width-1) {
      if(grid_data[y-1][x+1].alive === true) {
        neighbor_count++;
      }
    }
    if(x !== 0) {
      if(grid_data[y][x-1].alive === true) {
        neighbor_count++;
      }
    }
    if(x !== width-1) {
      if(grid_data[y][x+1].alive === true) {
        neighbor_count++;
      }
    }
    if(y !== height-1 && x !== 0) {
      if(grid_data[y+1][x-1].alive === true) {
        neighbor_count++;
      }
    }
    if(y !== height-1) {
      if(grid_data[y+1][x].alive === true) {
        neighbor_count++;
      }
    }
    if(y !== height-1 && x !== width-1) {
      if(grid_data[y+1][x+1].alive === true) {
        neighbor_count++;
      }
    }
    return neighbor_count;
  }


/**
 * setNextGenLifeStatus()
 */
  function setNextGenLifeStatus() {
    for(var row4=0; row4<height; row4++) {
      for(var col4=0; col4<width; col4++) {
        grid_data[row4][col4].alive = grid_data[row4][col4].next_gen;
        grid_data[row4][col4].next_gen = false;
      }
    }
  }


/**
 * updateNextGen()
 * @return {[type]} [description]
 */
  function updateNextGen() {

    console.log("***** Live Population = " + getPopulation(grid_data) + " *****");

    console.log("[updateNextGen]");
    setInterval(function() {
      if(getPopulation(grid_data) > 0) {
        calcNextGeneration();
        setNextGenLifeStatus();
        displayGrid();
      }
    }, speed);
  }

});
