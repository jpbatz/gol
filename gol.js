var height = 5;             // height = rows = y
var width = 5;              // width = cols = x
var speed = 100;            // simulation speed
var runMode = "random";     // default run mode is random
var grid_view;              // view: to be assigned once after document ready
var grid_data = [];         // data: contains rows []
var generation = 1;         // generation count
var livePopulation = 0;
var seed_file = seed_glider;
var selected_seed_file = seed_file;
var setIntervalID;          // for setInterval termination
var run = false;
var liveCellColor = "purple";
var deadCellColor = "white";
// var deadCellColor = "#FFEFD5"; // papayawhip does not work

$(document).ready(function() {

  // bind 'grid_view' as a property
  grid_view = $('#grid-div');
  
  // bind 'controls' as a property
  // this.controls = $('<div id="controls_div">');

  console.log("*** DEFAULTS ***");
  console.log("height = " + height);
  console.log("width = " + width);
  console.log("speed = " + speed);
  console.log("mode = " + runMode);
  // console.log("seed file = " + seed_file);

  $('#mode-div a').on('click', function() {
    $("a.selected").removeClass("selected");
    $(this).addClass("selected");

    console.log(this);
    if($(this).html() === "Random") {
      runMode = "random";
      $('#select-sample-list').css({"visibility": "hidden"});
      $('#selection-list').css({"visibility": "visible"});
      $('#sample-create-button').css({"visibility": "hidden"});
      $('#select-create-button').css({"visibility": "visible"});
      $('#set-seed-button').css({"visibility": "hidden"});
      $('#start-run-pause-button').css({"visibility": "hidden"});
      $('#done-button').css({"visibility": "hidden"});
      $('#select-sample-list').css({"display": "none"});
    }
    
    if($(this).html() === "Manual") {
      runMode = "manual";
      $('#select-sample-list').css({"visibility": "hidden"});
      $('#selection-list').css({"visibility": "visible"});
      $('#sample-create-button').css({"visibility": "hidden"});
      $('#select-create-button').css({"visibility": "visible"});
      $('#start-run-pause-button').css({"visibility": "hidden"});
      $('#done-button').css({"visibility": "hidden"});
      $('#select-sample-list').css({"display": "none"});
    }

    if($(this).html() === "Catalog") {
      runMode = "catalog";

      $('#selection-list').css({"display": "none"});
      $('#selection-list').css({"visibility": "hidden"});
      $('#select-sample-list').css({"visibility": "visible"});
      $('#select-create-button').css({"visibility": "hidden"});
      $('#set-seed-button').css({"visibility": "hidden"});
      $('#sample-create-button').css({"visibility": "visible"});
      $('#start-run-pause-button').css({"visibility": "hidden"});
      $('#done-button').css({"visibility": "hidden"});
      $('select[name="seed-sample"]').change(seed_logger);
    }

  });

  // needs to be called out here so not to have multiple grids appended
  $('.create-button').on('click', simulate);

  $("#start-run-pause-button").on('click', function() {
    run = !run;
    updateNextGen();
  });

  $('#welcome-menu').on('click', function() {
    $('#setup-div').css({"display": "none"})
    $('#instructions').css({"display": "none"})
    $('#references').css({"display": "none"})
    $('#about').css({"display": "none"})
    $('#intro').css({"display": "block"})
    $('#stats-div').css({"display": "none"})
    $('#grid-div').css({"display": "none"})
    $('#controls-div').css({"display": "none"})
  });

  $('#instructions-menu').on('click', function() {
    $('#setup-div').css({"display": "none"})
    $('#intro').css({"display": "none"})
    $('#references').css({"display": "none"})
    $('#about').css({"display": "none"})
    $('#instructions').css({"display": "block"})
    $('#stats-div').css({"display": "none"})
    $('#grid-div').css({"display": "none"})
    $('#controls-div').css({"display": "none"})
  });  

  $('#references-menu').on('click', function() {
    $('#setup-div').css({"display": "none"})
    $('#intro').css({"display": "none"})
    $('#instructions').css({"display": "none"})
    $('#about').css({"display": "none"})
    $('#references').css({"display": "block"})
    $('#stats-div').css({"display": "none"})
    $('#grid-div').css({"display": "none"})
    $('#controls-div').css({"display": "none"})
  });

  $('#about-menu').on('click', function() {
    $('#setup-div').css({"display": "none"})
    $('#intro').css({"display": "none"})
    $('#instructions').css({"display": "none"})
    $('#references').css({"display": "none"})
    $('#about').css({"display": "block"})
    $('#stats-div').css({"display": "none"})
    $('#grid-div').css({"display": "none"})
    $('#controls-div').css({"display": "none"})
  });

});

// ========================== MAIN FUNCTION ==========================

/**
 * simulate()
 * @return {[type]} [description]
 */
function simulate() {

  console.log("[simulate()]");
  console.log("*** Run Mode = " + runMode);

  height = $('#height-selection').val() || height;
  width = $('#width-selection').val() || width;
  // speed = $('.speed-selection').val() || speed;

  console.log("*** SUBMITTED VALUES ***");
  console.log("** height = " + height);
  console.log("** width = " + width);
  console.log("** speed = " + speed);
  console.log("** mode = " + runMode);

  $('#stats-div').css({"visibility": "visible"});

  if(runMode === "random") {

    speed = $('#selection-speed').val() || speed;

    console.log("Creating a grid with dimensions = " + height + "x" + width + " (height x width)");
    $('#message').html(runMode.toUpperCase() +" Mode ~ Grid Dimensions (height x width) = " + height + " x " + width + " ~ Run Speed = " + speed + "ms/generation");

    createGrid(height, width);
    generateRandomSeed();
    displayGrid();
    updateNextGen();
  
  } else if(runMode === "manual") {

    speed = $('#selection-speed').val() || speed;

    console.log("Creating a grid with dimensions = " + height + "x" + width + " (height x width)");
    $('#message').html(runMode.toUpperCase() +" Mode ~ Grid Dimensions (height x width) = " + height + " x " + width + " ~ Run Speed = " + speed + "ms/generation");

    createGrid(height, width);
    displayGrid();

    $('#set-seed-button').css({"visibility": "visible"});

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
      updateNextGen();
    });
  
  } else if(runMode === "catalog") {

    speed = $('#sample-speed').val() || speed;

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
    $('#message').html(runMode.toUpperCase() +" Mode ~ Grid Dimensions (height x width) = " + height + " x " + width + " ~ Run Speed = " + speed + "ms/generation");

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

  generation = 1;
  livePopulation = 0;

  if(grid_view) {
    grid_view.html("");
    grid_data = [];
  }

  console.log("[createGrid()]");
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

  $('#generation-stats').html(generation);
  $('#live-cells-stats').html(livePopulation);
  // $('#start-run-pause-button').css({"visibility": "visible"});
  // $('#done-button').css({"visibility": "visible"});

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
  $('#start-run-pause-button').css({"visibility": "visible"});
  $('#done-button').css({"visibility": "visible"});
}

/**
 * setManualSeed()
 */
function setManualSeed() {
  console.log("[setManualSeed()]");
  generation = 1;
  livePopulation = 0;
  for(var row2=0; row2<height; row2++) {
    for(var col2=0; col2<width; col2++) {
      if(grid_data[row2][col2].domDiv.style.backgroundColor === liveCellColor) {
        grid_data[row2][col2].alive = true;
        livePopulation++;
      }
    }
  }
  $('#generation-stats').html(generation);
  $('#live-cells-stats').html(livePopulation);
  $('#start-run-pause-button').css({"visibility": "visible"});
  $('#done-button').css({"visibility": "visible"});
}

/**
 * loadFileSeed() - load seed from catalog (files)
 * @return {[type]} [description]
 */
function loadFileSeed() {
  console.log("[loadFileSeed()]");
  for(var row3=0; row3<height; row3++) {
    for(var col3=0; col3<width; col3++) {
      var fileCellValue = seed_file[row3][col3];
      if(fileCellValue === 0) {
        grid_data[row3][col3].alive = false;
      } else if(fileCellValue === 1){
        grid_data[row3][col3].alive = true;
      }
      console.log("[load file seed()] CELL NUMBER = " + grid_data[row3][col3].cell_num + " for (" + row3 + "," + col3 + ") alive = " + grid_data[row3][col3].alive);
    }
  }
  $('#start-run-pause-button').css({"visibility": "visible"});
  $('#done-button').css({"visibility": "visible"});
}

/**
 * displayGrid()
 * @return {[type]} [description]
 */
function displayGrid() {
  console.log("[displayGrid()]");
  livePopulation = 0;
  for(var row4=0; row4<height; row4++) {
    for(var col4=0; col4<width; col4++) {
      var cellColor = deadCellColor;
      if(grid_data[row4][col4].alive === false) {
        cellColor = deadCellColor;
      } else if(grid_data[row4][col4].alive === true){
        cellColor = liveCellColor;
        livePopulation++;
      }
      grid_data[row4][col4].domDiv.style.backgroundColor = cellColor;
      // grid_data[row4][col4].domDiv.innerHTML = grid_data[row4][col4].cell_num;
      console.log("[display grid] CELL NUMBER = " + grid_data[row4][col4].cell_num + " for (" + row4 + "," + col4 + ") alive = " + grid_data[row4][col4].alive);
      $('#generation-stats').html(generation);
      $('#live-cells-stats').html(livePopulation);
    }
  }
}

/**
 * [getPopulation]
 * @param  {[Array]} grid_array [populated array]
 * @return {[type]}             [description]
 */
// function getPopulation(grid_array) {
//   var popCount = 0;
//   for(var i=0; i<grid_array.length; i++) {
//     for(var j=0; j<width; j++) {
//       if(grid_array[i][j].alive === true) {
//         popCount++;
//       }
//     }
//   }
//   return popCount;
// }

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

  if(run) {
    console.log("***** PLAY *****");
    $("#start-run-pause-button").html("Pause");
    setIntervalID = setInterval(function(){
      if(livePopulation > 0) {
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

  // should stop non-terminating simulation (but, it reloads, instead)
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

  // Reload button - fresh start

  // Replay button - re-run simulation

}

/**
 * clearGridData() - clears all live status
 * @return {[type]} [description]
 */
function clearGridData() {
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

  console.log("[reloadGame] " + grid_view);

  // height = 5;           // revert height
  // width = 5;            // revert width
  // speed = 100;          // simulation speed default
  // runMode = "random";   // default run mode is random
  // grid_view.html("");   // view: clear grid on page
  // grid_data = [];       // data: clear grid data
  // generation = 1;         // generation count
  // livePopulation = 0;
  // seed_file = seed_glider;  // revert default seed
  // selected_seed_file = seed_file;
  // setIntervalID = 0;
  // run = false;

  location.reload(true);
}
