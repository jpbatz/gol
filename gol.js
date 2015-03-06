(document).ready(function() {

  var cell = $('div', {
    class: "cell"
  });

  $(".grid").append(cell);

  this.grid = $('<div class="grid">');

  var width = 12;
  var height = 12;
  // create grid with dimensions provided by 
  // the arguments width and height
  for(var i=0; i<height; i++) {
    var gridRowCell = $('<div>', {
      class: "grid_cell row"
    });

    for(var j=0; j<width; j++) {
      var gridColCell = $('<div>', {
        class: "grid_cell col"
      });
      gridRowCell.append(gridColCell);
    }
    this.grid.append(gridRowCell);
  }

});
