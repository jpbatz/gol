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

  console.log(cells);

});
