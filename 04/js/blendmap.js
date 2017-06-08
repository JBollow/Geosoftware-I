/**
 * author: Jan-Patrick Bollow, 349891#
 * 
 */

function blendmap(checkboxElem) {
    if (checkboxElem.checked) {
        $("#map").fadeOut(3000);
    }
    else {
        $("#map").fadeIn(3000);
    }
}