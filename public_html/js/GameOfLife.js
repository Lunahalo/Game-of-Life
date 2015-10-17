
$(document).ready(function () {
    //createGameField(40);
    //$("#cellCountSubmitButton").click(function (event) {
    //    return getGameFieldSize();
    //});
   // $("#cellCountSubmitButton").click(function (event) {
   //     createGameField(event.result);
   // });
    //createGameField(size);
    
});

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