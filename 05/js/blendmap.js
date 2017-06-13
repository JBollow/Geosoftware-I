/**
 * author: Jan-Patrick Bollow, 349891#
 * 
 */

// fadeOut and fadeIn mapcontainer
function blendmap(checkboxElem) {
    if (checkboxElem.checked) {
        $("#map").fadeOut(3000);

        //JSNLog
        logger.info("map fadeOut");

    } else {
        $("#map").fadeIn(3000);

        //JSNLog
        logger.info("map fadeIn");

    }
}