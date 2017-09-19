/**
 *  @author Jan-Patrick Bollow 349891
 */

// scrollbar body
$(window).on("resize", function () {
    if ($(window).width() > 767) {
        $('body').css('overflow-y', 'auto');
        // JSNLog
        logger.info("Scrollbar disabled");
    } else {
        $('body').css('overflow-y', 'auto');
        // JSNLog
        logger.info("Scrollbar enabled");
    }
}).trigger("resize");

// JSNLog
logger.info("Allpagesscript loaded");