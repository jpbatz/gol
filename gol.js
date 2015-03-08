var cells = []; // contains rows []

$(document).ready(function() {

  var cell = {
    // cell_no: 0,
    alive: false,
    domDiv: ""
    // location: {
    //   x: 0,       // row
    //   y: 0        // col
    // },
    // live_neighbors = {
    //   n1:,
    //   n2:,
    //   n3:,
    //   n4:,
    //   n5:,
    //   n6:,
    //   n7:,
    //   n8:
    // },
    // num_of_live_neighbors: function() { return ... },
    // next_gen: function() { return ...; }
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
  for(var x=0; x<cells.length; x++) {


    for(var y=0; y<cells[x].length; y++) {
        
      var neighbor_count = 0;
  
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

      console.log("neighbor_count for (" + x + "," + y + ") = " + neighbor_count);

    }

  }  


});
