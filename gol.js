var height = 5;       // height = rows = y
var width = 5;        // width = cols = x
var speed = 250;      // simulation speed
var runMode = "R";    // default run mode is random
var grid_view;        // view: to be assigned once after document ready
var grid_data = [];   // data: contains rows []
var setIntervalID;
var count = 2;

$(document).ready(function() {
  
  // bind 'grid_view' as a property
  grid_view = $('#grid_div');
  
  // bind 'controls' as a property
  // this.controls = $('<div id="controls_div">');

  console.log("*** DEFAULTS ***");
  console.log("height = " + height);
  console.log("width = " + width);
  console.log("speed = " + speed);
  console.log("mode = " + runMode);

  $('#submit-selections-button').on('click', simulate);

});

// ========================== MAIN FUNCTION ==========================

/**
 * simulate()
 * @return {[type]} [description]
 */
function simulate() {

  console.log("click");

  height = $('#height-selection').val() || height;
  width = $('#width-selection').val() || width;
  speed = $('#speed-selection').val() || speed;
  runMode = $('#run-mode-selection').val() || runMode;


  if(runMode.toUpperCase() === "R") {
    runMode = "random";
  } else if(runMode.toUpperCase() === "M") {
    runMode = "manual";
  } else if(runMode.toUpperCase() === "F") {
    runMode = "catalog";
  }

  console.log("*** SUBMITTED VALUES ***");
  console.log("** height = " + height);
  console.log("** width = " + width);
  console.log("** speed = " + speed);
  console.log("** mode = " + runMode);

// });

  if(runMode === "random") {

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

    console.log("Creating a grid with dimensions = " + height + "x" + width + " (height x width)");

    // createGrid(height, width, grid);
    createGrid(height, width);

    // display grid()
    displayGrid();


    var controlsDiv = $('#controls-div');
    var setSeedButton = '<button id="set-seed-button">Set Seed</button>';

    $('#set-seed-div').append(setSeedButton);

    // manually click cells to enter seed values
    $('.cell').on('click', function() {
      // console.log("click in cell " + this.innerHTML + " detected");
      if(this.style.backgroundColor === "white") {
        this.style.backgroundColor = "purple";
      } else if(this.style.backgroundColor === "purple") {
        this.style.backgroundColor = "white";
      }
    });

    $('#set-seed-button').on('click', function() {
      setManualSeed();

      // process subsequent generations
      updateNextGen();
    });

  } else if(runMode === "catalog") {

    // seed_file = prompt("Select File...");
    seed_file = seed_fig8;
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

} // end simulate()

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
        class: "grid_col_cell cell"
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
 * setManualSeed()
 */
function setManualSeed() {
  console.log("[setManualSeed]");
  for(var row2=0; row2<height; row2++) {
    for(var col2=0; col2<width; col2++) {
      if(grid_data[row2][col2].domDiv.style.backgroundColor === "purple") {
        grid_data[row2][col2].alive = true;
      }
    }
  }
}


/**
 * loadFileSeed()
 * @return {[type]} [description]
 */
function loadFileSeed() {
  // load seed from catalog (files)
  for(var row3=0; row3<height; row3++) {
    for(var col3=0; col3<width; col3++) {
      var fileCellValue = seed_file[row3][col3];
      if(fileCellValue === 0) {
        grid_data[row3][col3].alive = false;
      } else if(fileCellValue === 1){
        grid_data[row3][col3].alive = true;
      }
      console.log("[load file seed] CELL NUMBER = " + grid_data[row3][col3].cell_num + " for (" + row3 + "," + col3 + ") alive = " + grid_data[row3][col3].alive);
    }
  }
}


/**
 * displayGrid()
 * @return {[type]} [description]
 */
function displayGrid() {
  for(var row4=0; row4<height; row4++) {
    for(var col4=0; col4<width; col4++) {
      var cellColor = "white";
      if(grid_data[row4][col4].alive === false) {
        cellColor = "white";
      } else if(grid_data[row4][col4].alive === true){
        cellColor = "purple";
      }
      grid_data[row4][col4].domDiv.style.backgroundColor = cellColor;
      grid_data[row4][col4].domDiv.innerHTML = grid_data[row4][col4].cell_num;
      console.log("[display grid] CELL NUMBER = " + grid_data[row4][col4].cell_num + " for (" + row4 + "," + col4 + ") alive = " + grid_data[row4][col4].alive);
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
  for(var row5=0; row5<height; row5++) {
    for(var col5=0; col5<width; col5++) {
      var numLiveNeighbors = countNeighbors(row5,col5);
      grid_data[row5][col5].num_live_neighbors = numLiveNeighbors;
      console.log("[calc next gen] live neighbor count for: cell_num [" + grid_data[row5][col5].cell_num + "] => (" + row5 + "," + col5 + ") = " + grid_data[row5][col5].num_live_neighbors);

      // determine next generation status and set
      var nextGenStatus;

      if(grid_data[row5][col5].alive === true) {
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
      } else if(grid_data[row5][col5].alive === false) {
        if(numLiveNeighbors === 3) {
          nextGenStatus = true;
          console.log("[next gen status] dead cell will regenerate");
        } else {
          nextGenStatus = false;
          console.log("[next gen status] dead cell will remain dead");
        }
      }
      grid_data[row5][col5].next_gen = nextGenStatus;
      console.log("next gen status: " + grid_data[row5][col5].next_gen);
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
  for(var row6=0; row6<height; row6++) {
    for(var col6=0; col6<width; col6++) {
      grid_data[row6][col6].alive = grid_data[row6][col6].next_gen;
      grid_data[row6][col6].next_gen = false;
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

  $("#start-pause-button").on('click', function() {
    count++;
    if(count % 2 !== 0) {
      console.log("***** PLAY *****");
      $("#start-pause-button").html("Pause");
      setIntervalID = setInterval(function(){
        // console.log("*****" + getPopulation(grid_data));
        if(getPopulation(grid_data) > 0) {
          calcNextGeneration();
          setNextGenLifeStatus();
          displayGrid();
        }
      }, speed);
      // console.log("setIntervalID " + setIntervalID);
    } else {
      clearInterval(setIntervalID);
      $("#start-pause-button").html("Play");
      console.log("***** PAUSED *****");
    }
  });

  $("#done").on('click', function() {
      clearInterval(setIntervalID);
      console.log("***** DONE *****");
      $("#start-pause-button").html("Play");
      resetGrid();
  });

}

function resetGrid() {
  for(var row7=0; row7<height; row7++) {
    for(var col7=0; col7<width; col7++) {
      grid_data[row7][col7].alive = false;
      grid_data[row7][col7].next_gen = false;
    }
  }  
}
