
/* global ctx, gameCanvas, sizeOfCell */

$(document).ready(function () {
    ctx = $('#gameCanvas').get(0).getContext('2d');
    gameCanvas = ctx.canvas;
    gameCanvas.width = $('#gameFieldDiv').width();
    gameCanvas.height = gameCanvas.width;

    sizeOfCell = createGrid(10);
    var cellArray = createCells(10);
    render(cellArray);
    //alert(gameCanvas.width);
    //drawLine(10 , gameCanvas.hight);
    //createGameField(40);
    //$("#cellCountSubmitButton").click(function (event) {
    //    return getGameFieldSize();
    //});
    // $("#cellCountSubmitButton").click(function (event) {
    //     createGameField(event.result);
    // });
    //createGameField(size);
    //
});

//Draws the game grid and returns the size of the side of the cells;
function createGrid(numOfCellOnSize) {
    var offset = 0.5;
    //Figure out what the largest cell size we can use without going over the game
    var cellSize = Math.floor(gameCanvas.width / numOfCellOnSize);
    //The canvas size should now be an even multiple of this.
    gameCanvas.width = numOfCellOnSize * cellSize;
    gameCanvas.height = gameCanvas.width;
    var totalWidth = numOfCellOnSize * cellSize + offset;
    $('#gameFieldDiv').width(totalWidth);
    for (var x = cellSize; x < totalWidth; x += cellSize) {
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset, gameCanvas.height);
    }
    for (var y = cellSize; y < totalWidth; y += cellSize) {
        ctx.moveTo(0, y + offset);
        ctx.lineTo(gameCanvas.width, y + offset);
    }
    ctx.strokeStyle = "white";
    ctx.stroke();
    return cellSize;
}

/* Cell object type, stores the x, y index of the cell and if it is 0 = dead,
 * 1 = alive, or 2 = dead but was alive.  It also stores if this cell is
 * and edge cell.
 */
function Cell(xindex, yindex, alive, isEdge) {
    this.xindex = xindex;
    this.yindex = yindex;
    this.alive = alive;
    this.isEdge = isEdge;
}
/* Creates and initializes 2D array with size of each dim given by numOfCells 
 * and returns that array.
 */
function createCells(numOfCells) {
    var cellColumn = numOfCells;
    var cellRow = numOfCells;

    var cellArray = new Array();
    for (var x = 0; x < cellRow; x++) {
        cellArray[x] = new Array();
        for (var y = 0; y < cellColumn; y++) {
            if (x === 0 || y === 0 || x === numOfCells - 1 || y === numOfCells - 1) {
                cellArray[x][y] = new Cell(x, y, 0, true);
            }
            else {
                cellArray[x][y] = new Cell(x, y, 0, false);
            }
        }
    }
    return cellArray;
}
/* Randomly sets all cells in cellArray to either alive or dead.
 */
function randomize(cellArray) {
    for (var x = 0; x < cellArray.length; x++) {
        for (var y = 0; y < cellArray.length; y++) {
            cellArray[x][y].alive = Math.round(Math.random());
        }
    }

}
/*function computeNextStep(cellArray) {
    for (var x = 0; x < cellArray.length; x++) {
        for (var y = 0; y < cellArray.length; y++) {
            // There are enough cells around, so reproduce
            if (reproduceOrDie(x, y, cellArray) === 1) {

            }
            // There are too many cells arond, so die
            else if (reproduceOrDie(x, y, cellArray) === 0) {

            }
            else
        }
    }
}*/
/* Checks if the cell given by xIndex, yIndex in cellArray has enough
 * neighbors to reproduce, do nothing, or die.  It will return 0 if the cell
 * should die, 1 if it should reproduce, or 2 if it should do nothing.
 * This functions does not have any bounds or error checking, the initial
 * xIndex, yIndex in cellArray must be valid.
 */
function reproduceOrDie(xIndex, yIndex, cellArray) {
    var numOfAliveNeighbors = 0;
    var radius = 1;
    for (var x = xIndex; x < radius; x++) {
        if (cellArray[x + 1][yIndex].alive === 1) {

        }
    }

}
/*function cellAtEdge(xIndex, yIndex, cellArray) {
    if (cellArray)
}*/
/* Runs through the 2D array given by cellArray and colors each grid
 * according that cells alive status.
 */
function render(cellArray) {
    var deadNeverAliveColor = "black";
    var deadWasAliveColor = "lightgrey";
    var aliveColor = "#456ADA";
    for (var x = 0; x < cellArray.length; x++) {
        for (var y = 0; y < cellArray.length; y++) {
            if (cellArray[x][y].alive === 0) {
                colorCellAt(x, y, deadNeverAliveColor);
            }
            if (cellArray[x][y].alive === 2) {
                colorCellAt(x, y, deadWasAliveColor);
            }
            if (cellArray[x][y].alive === 1) {
                colorCellAt(x, y, aliveColor);
            }
        }
    }
}
/* Fills the cell given by xIndex, yIndex, with the given color.
 * Color must be a valid color name or Hex value given as a String. 
 **/
function colorCellAt(xIndex, yIndex, color) {
    var offset = 1;
    var xpos = xIndex * sizeOfCell + offset;
    var ypos = yIndex * sizeOfCell + offset;
    ctx.fillStyle = color;
    ctx.fillRect(xpos, ypos, sizeOfCell - offset, sizeOfCell - offset);
}
function createGameField(size) {
    var $rowDiv = $("<div></div>", {class: "rowCell"});
    var $columnDiv = $("<div></div>", {class: "columnCell"});
    for (var i = 0; i < size; i++) {
        $("#gameField").append($rowDiv.clone().attr("id", "rowCell" + i));
    }
    $(".rowCell").each(function (index) {
        for (var j = 0; j < size; j++) {
            $(this).append($columnDiv.clone().attr("id", "columnCell" + j));
        }
    });
}

function getGameFieldSize() {
    var numberOfCells = $("#cellCount").val();
    return numberOfCells;
}