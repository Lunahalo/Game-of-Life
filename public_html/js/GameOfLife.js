
$(document).ready(function () {
    /*var c = document.getElementById("gameCanvas");
    var ctx = c.getContext("2d");
    ctx.moveTo(10,0);
    ctx.lineTo(10,100);
    ctx.stroke();*/
    ctx = $('#gameCanvas').get(0).getContext('2d');
    gameCanvas = ctx.canvas;
    gameCanvas.width = $('#gameFieldDiv').width();
    gameCanvas.height = gameCanvas.width;
    
    createGrid(10);
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


function createGrid(numOfCellOnSize) {
    var offset = 0.5;
    //Figure out what the largest cell size we can use without going over the game
    var cellSize = Math.floor(gameCanvas.width/numOfCellOnSize);
    //The canvas size should now be an even multiple of this.
    gameCanvas.width = numOfCellOnSize * cellSize;
    gameCanvas.height = gameCanvas.width;
    var totalWidth = numOfCellOnSize * cellSize +offset;
    $('#gameFieldDiv').width(totalWidth);
    for(var x = cellSize; x < totalWidth; x += cellSize ){
        ctx.moveTo(x+offset, 0);
        ctx.lineTo(x+offset, gameCanvas.height);
    }
    for(var y = cellSize; y < totalWidth; y += cellSize ){
        ctx.moveTo(0, y+ offset);
        ctx.lineTo(gameCanvas.width, y+ offset);
    }
    ctx.stroke();
}


function createGameField(size) {
    var $rowDiv = $("<div></div>", {class: "rowCell"});
    var $columnDiv = $("<div></div>", {class: "columnCell"});
    for (var i = 0; i < size; i++) {
        $("#gameField").append($rowDiv.clone().attr("id", "rowCell" + i));
    }
    $(".rowCell").each(function (index) {
            for(var j = 0; j <size; j++) {
                $(this).append($columnDiv.clone().attr("id", "columnCell"+j));
            }
    });
}

function getGameFieldSize() {
    var numberOfCells = $("#cellCount").val();
    return numberOfCells;
}