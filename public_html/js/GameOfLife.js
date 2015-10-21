
/* global ctx, gameCanvas, sizeOfCell, deadNeverAliveColor, deadWasAliveColor,
 * aliveColor, cellcellsPerSide
 *  */

$(document).ready(function () {
    ctx = $('#gameCanvas').get(0).getContext('2d');
    gameCanvas = ctx.canvas;
    gameCanvas.width = $('#gameFieldDiv').width();
    gameCanvas.height = gameCanvas.width;
    deadNeverAliveColor = "black";
    deadWasAliveColor = "dimgray";
    //aliveColor = "#456ADA";
    aliveColor = "deeppink";
    cellsPerSide = 200;
    simInterval = 0;

    sizeOfCell = createGrid(cellsPerSide);
    cellArray = createCells(cellsPerSide);
    render(cellArray);
    $("#gameCanvas").click(function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var indexArray = calcCellFromLoc(x, y);
        /*alert("The relative cordinates should be X: "+x+" and Y :"+y+
         "\nThe size of a cell is: "+ sizeOfCell+
         "\nThe xIndex is: "+ indexArray[0] + " and the yIndex is :" +indexArray[1]);*/

        if(e.shiftKey) forceCellAlive(indexArray[0], indexArray[1], cellArray);
        else if(e.ctrlKey)
            forceCellDead(indexArray[0], indexArray[1], cellArray);
        else toggleCellState(indexArray[0], indexArray[1], cellArray);

    });
    var intervalId;
    $("#startSim").click(function (e) {
        intervalId = setInterval(startSim, simInterval);
    });
    $("#stopSim").click(function (e) {
        clearInterval(intervalId);
    });
    $("#resetAllCellsButton").click(function(e) {
        cellArray = createCells(cellsPerSide);
        render(cellArray);
    });
    $("#rndFillCells").click(function(e) {
        randomize(cellArray);
        render(cellArray);
    });
    $("#advSimButton").click(function(e) {
        var nextStepCellArray = computeNextStep(cellArray);
        render(nextStepCellArray);
        cellArray = nextStepCellArray;
    });
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
function Cell(xindex, yindex, alive) {
    this.xindex = xindex;
    this.yindex = yindex;
    this.alive = alive;
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
            if(x === 0 || y === 0 || x === numOfCells - 1 || y === numOfCells - 1) {
                cellArray[x][y] = new Cell(x, y, 0);
            }
            else {
                cellArray[x][y] = new Cell(x, y, 0);
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

/* This function takes the x, y cordinates relative to the canvas and from 
 * that calculates the cell index that has been clicked on. 
 */
function calcCellFromLoc(xCord, yCord) {
    var xIndex = Math.floor(xCord / sizeOfCell);
    var yIndex = Math.floor(yCord / sizeOfCell);
    return [xIndex, yIndex];
}

/* This function just toggles the state of the cell from dead (dead never alive
 * or dead, but was alive) to alive and updates the color, or if the cell is alive
 * to dead and updates the color.  It must be past the index of the cell to
 * toggle and the cellArray to update.  It does not do any bounds checking and
 * it is on the function caller to make sure the indexes and cellArry state is valid.
 */
function toggleCellState(xIndex, yIndex, cellArray) {
    if(cellArray[xIndex][yIndex].alive === 1) {
        // If the cell is alive, set it to dead, but was alive and update the color
        cellArray[xIndex][yIndex].alive = 2;
        colorCellAt(xIndex, yIndex, deadWasAliveColor);
    }
    else {
        /* If the cell was always dead, or was alive but now is dead, set 
         * the cell to alive and update the color.
         * */
        cellArray[xIndex][yIndex].alive = 1;
        colorCellAt(xIndex, yIndex, aliveColor);
    }
}

/* This function forces a cell given by its xIndex, yIndex to be alive if it was
 * dead and update the color.  If the cell was already alive it does nothing.
 * This function does not do any bounds checking on xIndex, yIndex or cellArray.
 */
function forceCellAlive(xIndex, yIndex, cellArray) {
    if(cellArray[xIndex][yIndex].alive === 0 || cellArray[xIndex][yIndex].alive === 2) {
        cellArray[xIndex][yIndex].alive = 1;
        colorCellAt(xIndex, yIndex, aliveColor);
    }
}
/* This function does the opposite of forceCellAlive: if the cell was alive it
 * changes the cell to dead but was alive and updates the color, otherwise it 
 * nothing.  Like before no error checking is done.
 */
function forceCellDead(xIndex, yIndex, cellArray) {
    if(cellArray[xIndex][yIndex].alive === 1) {
        cellArray[xIndex][yIndex].alive = 2;
        colorCellAt(xIndex, yIndex, deadWasAliveColor);
    }
}

function startSim() {
    var nextStepCellArray = computeNextStep(cellArray);
    render(nextStepCellArray);
    cellArray = nextStepCellArray;
}

/* This function goes through the whole cellArray and finds out if each cell
 * should reproduce, die or do nothing.  It then stores the state of the cell field
 * during the step in a new array and returns that array.
 */
function computeNextStep(cellArray) {
    var nextStepCellArray = createCells(cellsPerSide);

    for (var x = 0; x < cellArray.length; x++) {
        for (var y = 0; y < cellArray.length; y++) {
            if(reproduceOrDie(x, y, cellArray) === 1) {
                // There are enough cells around, so reproduce
                nextStepCellArray[x][y].alive = 1;
            }
            else if(reproduceOrDie(x, y, cellArray) === 0) {
                // There are too many cells around, so die
                nextStepCellArray[x][y].alive = 2;
            }
            else {
                // Nothing should happen, so the value is whatever the previous value was.
                nextStepCellArray[x][y].alive = cellArray[x][y].alive;
            }
        }
    }
    return nextStepCellArray;
}
/* Checks if the cell given by xIndex, yIndex in cellArray has enough
 * neighbors to reproduce, do nothing, or die.  It will return 0 if the cell
 * should die, 1 if it should reproduce, or 2 if it should do nothing.
 * This functions does not have any bounds or error checking, the initial
 * xIndex, yIndex in cellArray must be valid.
 */
function reproduceOrDie(xIndex, yIndex, cellArray) {
    var numOfAliveNeighbors = 0;
    var radius = 1;
    var deathByLonelinessThresh = 2;
    var deathByOverpop = 3;
    var gMin = 3;
    var gMax = 3;
    // 0 = edges dead, 1 = edges alive, 2 = edges wrap
    var cellEdgeMode = 0;
    for (var x = 0; x <= radius; x++) {
        for (var y = 0; y <= radius; y++) {
            /* if x === 0 and y === 0 we need to skip that iteration because we don't 
             * want to consider the center square to see if it is its own neighbor
             */
            if(x === 0 && y === 0)
                continue;
            if(cellEdgeMode === 2) {
                /* The pattern to check the radius is starting at the x = xIndex, look up then down, 
                 * and expand out in the y direction (up up, down down, ect.)  Then with y = yIndex 
                 * look right, then left.  Then right up, right down, right up up, right down down.  
                 * Then left up, left down, left up up, left down down (ect.)
                 * */

                /* This monstrosity does wrapping. If xIndex - x is inside the normal array bounds
                 * then it is just normalIndex%cellArray.length, which is the same index,
                 * then this becomes normalIndex+cellArray.length%cellArray.length,
                 * which is once again just the normalIndex.  The interesting part happens
                 * when xIndex - x is negative.  In Javascript -2%cellArray.length is -2, so
                 * when this is added to cellArray.length it is something on the otherside of
                 * the array and when you % cellArray.length it is just the same number on
                 * other side of the array.
                 * E.g xIndex = 1, x = 2 so it should be the most right array index.
                 * (1-2) = -1
                 * -1 % 20 = -1
                 * -1 + 20 = 19
                 * 19 % 20 = 19
                 */
                //look right and up
                var wrappedYUpIndex = (((yIndex - y) % cellArray.length) + cellArray.length) % cellArray.length;
                var wrappedXRightIndex = (((xIndex + x) % cellArray.length) + cellArray.length) % cellArray.length;
                if(cellArray[wrappedXRightIndex][wrappedYUpIndex].alive === 1) {
                    numOfAliveNeighbors++;
                }
                /* In the case where y === 0 the expression for wrappedYDownIndex and wrappedYUpIndex 
                 * are equivalent, so we would be checking the same square twice
                 */
                if(y !== 0) {
                    //look right and down
                    var wrappedYDownIndex = (((yIndex + y) % cellArray.length) + cellArray.length) % cellArray.length;
                    if(cellArray[wrappedXRightIndex][wrappedYDownIndex].alive === 1) {
                        numOfAliveNeighbors++;
                    }
                }
                //if x === 0 then we would check above and the same squares twice
                if(x !== 0) {
                    //look left and up
                    var wrappedXLeftIndex = (((xIndex - x) % cellArray.length) + cellArray.length) % cellArray.length;
                    if(cellArray[wrappedXLeftIndex][wrappedYUpIndex].alive === 1) {
                        numOfAliveNeighbors++;
                    }
                    /* In the case where y === 0 the expression for wrappedYDownIndex and wrappedYUpIndex 
                     * are equivalent, so we would be checking the same square twice 
                     */
                    if(y !== 0) {
                        //look left and down
                        if(cellArray[wrappedXLeftIndex][wrappedYDownIndex].alive === 1) {
                            numOfAliveNeighbors++;
                        }
                    }
                }
            }
            if(cellEdgeMode === 0) {
                //Bounds checking to make sure there is never an array index out of bounds
                if(xIndex + x < cellArray.length) {
                    if(yIndex - y >= 0) {
                        if(cellArray[xIndex + x][yIndex - y].alive === 1) {
                            numOfAliveNeighbors++;
                        }
                    }
                    //If y = 0 then yIndex + y is the same as yIndex - y and it checks duplicate cells
                    if(y !== 0) {
                        //Bounds checking to make sure there is never an array index out of bounds
                        if(yIndex + y < cellArray.length) {
                            if(cellArray[xIndex + x][yIndex + y].alive === 1) {
                                numOfAliveNeighbors++;
                            }
                        }
                    }
                }
                //if x = 0, then xIndex +x and xIndex -x are then same and it checks duplicate cells
                if(x !== 0) {
                    //Bounds checking to make sure there is never an array index out of bounds
                    if(xIndex - x >= 0) {
                        if(yIndex - y >= 0) {
                            if(cellArray[xIndex - x][yIndex - y].alive === 1) {
                                numOfAliveNeighbors++;
                            }
                        }
                        //If y = 0 then yIndex + y is the same as yIndex - y and it checks duplicate cells
                        if(y !== 0) {
                            //Bounds checking to make sure there is never an array index out of bounds
                            if(yIndex + y < cellArray.length) {
                                if(cellArray[xIndex - x][yIndex + y].alive === 1) {
                                    numOfAliveNeighbors++;
                                }
                            }
                        }
                    }
                }
            }
            if(cellEdgeMode === 1) {
                //Bounds checking to make sure there is never an array index out of bounds
                if(xIndex + x < cellArray.length) {
                    if(yIndex - y >= 0) {
                        if(cellArray[xIndex + x][yIndex - y].alive === 1) {
                            numOfAliveNeighbors++;
                            //colorCellAt(xIndex + x, yIndex - y, "red");
                        }
                    }
                    //Maybe issue here should be (yIndex - y) >= -1
                    else if(Math.abs(yIndex - y) % (cellArray.length - 1) <= 1)
                        numOfAliveNeighbors++;
                }
                else if((xIndex + x === cellArray.length) && (yIndex - y <= (cellArray.length)) && ((yIndex - y) >= -1))
                    numOfAliveNeighbors++;
                //If y = 0 then yIndex + y is the same as yIndex - y and it checks duplicate cells
                if(y !== 0) {
                    if(xIndex + x < cellArray.length) {
                        //Bounds checking to make sure there is never an array index out of bounds
                        if(yIndex + y < cellArray.length) {
                            if(cellArray[xIndex + x][yIndex + y].alive === 1) {
                                numOfAliveNeighbors++;
                                //colorCellAt(xIndex + x, yIndex + y, "red");
                            }
                        }
                        else if(Math.abs(yIndex + y) % (cellArray.length - 1) <= 1)
                            numOfAliveNeighbors++;
                    }
                    else if((xIndex + x === cellArray.length) && ((yIndex + y) <= cellArray.length))
                        numOfAliveNeighbors++;
                }

                //if x = 0, then xIndex +x and xIndex -x are then same and it checks duplicate cells
                //Check left side
                if(x !== 0) {
                    //Bounds checking to make sure there is never an array index out of bounds
                    if(xIndex - x >= 0) {
                        if(yIndex - y >= 0) {
                            if(cellArray[xIndex - x][yIndex - y].alive === 1) {
                                numOfAliveNeighbors++;
                                //colorCellAt(xIndex - x, yIndex - y, "red");
                            }
                        }
                        else if(Math.abs(yIndex - y) % (cellArray.length - 1) <= 1)
                            numOfAliveNeighbors++;
                    }
                    else if(xIndex - x === -1 && ((yIndex - y) >= -1))
                        numOfAliveNeighbors++;
                    //If y = 0 then yIndex + y is the same as yIndex - y and it checks duplicate cells
                    if(y !== 0) {
                        if(xIndex - x >= 0) {
                            //Bounds checking to make sure there is never an array index out of bounds
                            if(yIndex + y < cellArray.length) {
                                if(cellArray[xIndex - x][yIndex + y].alive === 1) {
                                    numOfAliveNeighbors++;
                                    //colorCellAt(xIndex - x, yIndex + y, "red");
                                }
                            }
                            else if(yIndex + y === cellArray.length)
                                numOfAliveNeighbors++;
                        }
                        else if((xIndex - x === -1) && ((yIndex + y) <= cellArray.length))
                            numOfAliveNeighbors++;
                    }


                }
            }
        }
    }
    //If the cell we are intrested in is alive
    if(cellArray[xIndex][yIndex].alive === 1) {
        /* If the number of neighbors is below the loneliness threshold 
         * or above the over pop threshhold, it should die
         */
        if(numOfAliveNeighbors > deathByOverpop || numOfAliveNeighbors < deathByLonelinessThresh)
            return 0;
        //Otherwise it should stay in equilibrium
        else return 2;
    }
    //If the cell we are intrested in is dead
    else {
        /* If the dead cell has between gMin and gMax cells alive around it (inclusive)
         * then return 1, it should reproduce. 
         **/
        if(numOfAliveNeighbors >= gMin && numOfAliveNeighbors <= gMax)
            return 1;
        // It is already dead so do nothing.
        else return 2;
    }


}

/* Runs through the 2D array given by cellArray and colors each grid
 * according that cells alive status.
 */
function render(cellArray) {
    for (var x = 0; x < cellArray.length; x++) {
        for (var y = 0; y < cellArray.length; y++) {
            if(cellArray[x][y].alive === 0) {
                colorCellAt(x, y, deadNeverAliveColor);
            }
            if(cellArray[x][y].alive === 2) {
                colorCellAt(x, y, deadWasAliveColor);
            }
            if(cellArray[x][y].alive === 1) {
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