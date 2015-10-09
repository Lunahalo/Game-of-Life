
$(document).ready(function () {
    createGameField(10);
    $("#cellCountSubmitButton").click(function (event) {
        return getGameFieldSize();
    });
    $("#cellCountSubmitButton").click(function (event) {
        createGameField(event.result);
    });
    //createGameField(size);

});

function createGameField(size) {
    var $rowDiv = $("<div></div>", {class: "rowCell"});
    var $columnDiv = $("<div></div>", {class: "columnCell"});
    for (var i = 0; i < size; i++) {
        $("#gameField").append($rowDiv.clone().attr("id", "rowCell" + i));
    }
    // columnCell numbering index
    var i = 0;
    $(".rowCell").each(function () {
        $(".rowCell").append($columnDiv.attr("id", "columnCell" + i));
        i++;
    });
}

function getGameFieldSize() {
    var numberOfCells = $("#cellCount").val();
    return numberOfCells;
}