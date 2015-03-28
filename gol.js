var height = 5;             // height = rows = y
var width = 5;              // width = cols = x
var speed = 100;            // simulation speed
var runMode = "random";     // default run mode is random
var grid_view;              // view: to be assigned once after document ready
var grid_data = [];         // data: contains rows []
var generation = 1;         // generation count
var seed_file = seed_glider;
var selected_seed_file = seed_file;
var setIntervalID;          // for setInterval termination
var count = 2;              // determines Run or Pause
var liveCellColor = "purple";
var deadCellColor = "white";
// var deadCellColor = "#FFEFD5"; // papayawhip does not work

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
  // console.log("seed file = " + seed_file);

  $('#random').on('click', function() {
    runMode = "random";
    $('#random').css({
      "background-color": "orange"
    });
    $('#manual').css({
      "background-color": "yellow"
    });
    $('#catalog').css({
      "background-color": "yellow"
    });
    $('.selection-item').css({"visibility": "visible"});
    $('#stats-div').css({"visibility": "visible"});
    $('#create-button').on('click', simulate);
  });
  
  $('#manual').on('click', function() {
    runMode = "manual";
    $('#random').css({
      "background-color": "yellow"
    });
    $('#manual').css({
      "background-color": "orange"
    });
    $('#catalog').css({
      "background-color": "yellow"
    });
    $('.selection-item').css({"visibility": "visible"});
    $('#stats-div').css({"visibility": "visible"});
    $('#create-button').on('click', simulate);
  });
  
  $('#catalog').on('click', function() {
    runMode = "catalog";
    $('#random').css({
      "background-color": "yellow"
    });
    $('#manual').css({
      "background-color": "yellow"
    });
    $('#catalog').css({
      "background-color": "orange"
    });

    $('.selection').remove();
    $('#selection-div').html("Select Sample: ");
    $('#selection-div').append('<select id="select-sample" name="seed-sample">');
    $('#select-sample').append('<option value="glider">Samples:</option>');
    $('#select-sample').append('<optgroup id="nonterminal-group" label="Oscillators (Non-Terminal)">');
    $('#nonterminal-group').append('<option value="fig8">Figure 8</option>');
    $('#nonterminal-group').append('<option value="octagon">Octagon</option>');
    $('#nonterminal-group').append('<option value="pulsar">Pulsar (Period 3)</option>');
    $('#nonterminal-group').append('<option value="spinner">Spinner (Period 2)</option>');
    $('#select-sample').append('<optgroup id="terminal-group" label="Terminals (TBD)">');
    $('#terminal-group').append('<option value="diehard">Diehard (7 cells, 130 generations)</option>');
    $('#terminal-group').append('<option value="terminal2">Terminal 2 (TBD)</option>');
    $('#select-sample').append('<optgroup id="glider-group" label="Gliders (TBD)">');
    $('#glider-group').append('<option value="glider1">Glider 1 (TBD)</option>');
    $('#glider-group').append('<option value="glider2">Glider 2 (TBD)</option>');
    $('#selection-div').append('Speed: <input id="speed-selection" type="text" placeholder="100ms" size="5" maxlength="4">');
    $('#selection-div').append('<button id="create-button">Create</button>');
    $('select[name="seed-sample"]').change(seed_logger);
    $('#stats-div').css({"visibility": "visible"});
    $('#create-button').on('click', simulate);

  });

});

// ========================== MAIN FUNCTION ==========================

/**
 * simulate()
 * @return {[type]} [description]
 */
function simulate() {

  console.log("click");
  console.log("*** Run Mode = " + runMode);
  
  height = $('#height-selection').val() || height;
  width = $('#width-selection').val() || width;
  speed = $('#speed-selection').val() || speed;
  // runMode = $('#run-mode-selection').val() || runMode;

  console.log("*** SUBMITTED VALUES ***");
  console.log("** height = " + height);
  console.log("** width = " + width);
  console.log("** speed = " + speed);
  console.log("** mode = " + runMode);

  if(runMode === "random") {

    console.log("Creating a grid with dimensions = " + height + "x" + width + " (height x width)");

    createGrid(height, width);
    generateRandomSeed();
    displayGrid();
    updateNextGen();
  
  } else if(runMode === "manual") {

    console.log("Creating a grid with dimensions = " + height + "x" + width + " (height x width)");

    createGrid(height, width);
    displayGrid();

    $('#start-run-pause-done-div').css({"visibility": "hidden"});
    $('#set-seed-div').append('<button id="set-seed-button">Set Seed</button>');

    // manually click cells to enter seed values
    $('.cell').on('click', function() {
      console.log("click in cell " + this.innerHTML + " detected");
      if(this.style.backgroundColor === deadCellColor) {
        this.style.backgroundColor = liveCellColor;
      } else if(this.style.backgroundColor === liveCellColor) {
        this.style.backgroundColor = deadCellColor;
      }
    });

    $('#set-seed-button').on('click', function() {
      setManualSeed();
      $('#start-run-pause-done-div').css({"visibility": "visible"});
      updateNextGen();
    });
  
  } else if(runMode === "catalog") {

    console.log("[simulate()] selected_seed_file: " + selected_seed_file);
    
    switch(selected_seed_file) {
      case "fig8": {
        seed_file = seed_fig8;
        break;
      }
      case "octagon": {
        seed_file = seed_octagon;
        break;
      }
      case "pulsar": {
        seed_file = seed_pulsar;
        break;
      }
      case "spinner": {
        seed_file = seed_spinner;
        break;
      }
      case "diehard": {
        seed_file = seed_diehard;
        break;
      }
      default: {
        seed_file = seed_glider;
      }
    }
    
    console.log("[simulate()] seed_file " + seed_file);
    
    height = seed_file.length;
    width = seed_file[0].length;

    console.log("Creating a grid with dimensions = " + height + "x" + width + " (height x width)");

    createGrid(height, width);
    loadFileSeed();
    displayGrid();
    updateNextGen();

  } else {
    console.log("Invalid selection");
  }

} // end simulate()

// ========================== HELPER FUNCTIONS ==========================

/**
 * seed_logger()
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function seed_logger(e) {
  var $input = $(this);
  console.log("[seed_logger() selected_seed_file] " + $input.val());
  selected_seed_file = $(this).val();
}

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

  $('#start-run-pause-done-div').append('<button id="start-run-pause-button">Start</button>');
  $('#start-run-pause-done-div').append('<button id="done-button">Done</button>');

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
      console.log("[generateRandomSeed()] CELL NUMBER = " + grid_data[row1][col1].cell_num + " for (" + col1 + "," + row1 + ") alive = " + grid_data[row1][col1].alive);
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
      if(grid_data[row2][col2].domDiv.style.backgroundColor === liveCellColor) {
        grid_data[row2][col2].alive = true;
      }
    }
  }
}

/**
 * loadFileSeed() - load seed from catalog (files)
 * @return {[type]} [description]
 */
function loadFileSeed() {
  console.log("[loadFileSeed]");
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
      var cellColor = deadCellColor;
      if(grid_data[row4][col4].alive === false) {
        cellColor = deadCellColor;
      } else if(grid_data[row4][col4].alive === true){
        cellColor = liveCellColor;
      }
      grid_data[row4][col4].domDiv.style.backgroundColor = cellColor;
      // grid_data[row4][col4].domDiv.innerHTML = grid_data[row4][col4].cell_num;
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

  // console.log("***** [updateNextGen()] Live Population = " + getPopulation(grid_data) + " *****");
  console.log("[updateNextGen()]");

  // add step feature
  $("#start-run-pause-button").on('click', function() {
    count++;
    if(count % 2 !== 0) {
      console.log("***** PLAY *****");
      $("#start-run-pause-button").html("Pause");
      setIntervalID = setInterval(function(){
        var livePopulation = getPopulation(grid_data);
        $('#live-cells-stats').html(livePopulation);    // too late
        if(livePopulation > 0) {
          $('#generation-stats').html(generation);
          calcNextGeneration();
          setNextGenLifeStatus();
          displayGrid();
          generation++;
        }
      }, speed);
      // console.log("setIntervalID " + setIntervalID);
    } else {
      clearInterval(setIntervalID);
      $("#start-run-pause-button").html("Run");
      console.log("***** PAUSED *****");
    }
  });

  $("#done-button").on('click', function() {
      clearInterval(setIntervalID);
      console.log("***** DONE *****");
      $("#start-run-pause-button").hide();
      $("#set-seed-button").hide();
      $("#done-button").hide();
      $('#reload').html('Please Reload Page to Restart');
      // clearGridData();
      reloadGame();
  });

}

/**
 * clearGridData() - clears all live status
 * @return {[type]} [description]
 */
function clearGridData() {
  // delete grid
  for(var row7=0; row7<height; row7++) {
    for(var col7=0; col7<width; col7++) {
      grid_data[row7][col7].alive = false;
      grid_data[row7][col7].next_gen = false;
    }
  }  
}

/**
 * clearGrid() - removes grid
 * @return {[type]} [description]
 */
function reloadGame() {
  height = 5;           // height = rows = y
  width = 5;            // width = cols = x
  speed = 100;          // simulation speed
  runMode = "random";   // default run mode is random
  grid_view.remove();   // view: to be assigned once after document ready
  grid_data = [];       // data: contains rows []
  seed_file = seed_glider;
  selected_seed_file = seed_file;
  setIntervalID = 0;
  count = 2;

  location.reload(true);
}
