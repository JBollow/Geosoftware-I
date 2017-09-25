/**
 *  @author Jan-Patrick Bollow 349891
 */

// Autoscale sidelements
$(window).on("resize", function () {
    var x;
    if ($(window).width() > 767) {
        x = (($(window).height() - 213) * 0.33);
        $('.boxscroll').css('max-height', x + 'px');
    } else {
        x = 300;
        $('.boxscroll').css('max-height', x + 'px');
    }
}).trigger("resize");

$(window).on("resize", function () {
    var x;
    if ($(window).width() > 767) {
        x = (($(window).height() - 336));
        $('.boxscroll2').css('max-height', x + 'px');
    } else {
        x = 300;
        $('.boxscroll2').css('max-height', x + 'px');
    }
}).trigger("resize");

$(window).on("resize", function () {
    var x;
    if ($(window).width() > 1906) {
        x = (($(window).height() - 561));
        $('.boxscroll1').css('max-height', x + 'px');
    } else {
        if ($(window).width() > 1211) {
            x = (($(window).height() - 601));
            $('.boxscroll1').css('max-height', x + 'px');
        } else {
            if ($(window).width() > 1179) {
                x = (($(window).height() - 621));
                $('.boxscroll1').css('max-height', x + 'px');
            } else {
                if ($(window).width() > 1012) {
                    x = (($(window).height() - 641));
                    $('.boxscroll1').css('max-height', x + 'px');
                } else {
                    if ($(window).width() > 999) {
                        x = (($(window).height() - 661));
                        $('.boxscroll1').css('max-height', x + 'px');
                    } else {
                        if ($(window).width() > 767) {
                            x = (($(window).height() - 701));
                            $('.boxscroll1').css('max-height', x + 'px');
                        } else {
                            x = 300;
                            $('.boxscroll1').css('max-height', x + 'px');
                        }
                    }
                }
            }
        }
    }
}).trigger("resize");

// JSNLog
logger.info("Autoscaled loaded");