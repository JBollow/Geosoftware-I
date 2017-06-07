/**
 * author: Jan-Patrick Bollow, 349891#
 * 
 */

function blendmap(checkboxElem) {
    if (checkboxElem.checked) {
        $("#map_canvas").fadeOut(3000);
    }
    else {
        $("#map_canvas").fadeIn(3000);
    }
}