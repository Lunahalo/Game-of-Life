
$(document).ready(function () {
    var size = 10;
    var $rowDiv = $("<div></div>", {class: "rowCell"});
    var $columnDiv = $("<div></div>", {class: "columnCell"});
    for (var i = 0; i < size; i++) {
        var rowArray = [];
        for (var j = 0; j < size; j++) {
            $columnDiv.append($rowDiv.clone().append(j));
        }
        $("#gameField").append($columnDiv.clone());
    }


});
