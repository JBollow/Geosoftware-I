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

// Refresh popupconfigurator
function refreshpopup() { 
    $("#jsonname").val('');
    $("#jsonpopuptext").val('');
    $("#jsonbild").val('');
    $("#jsonweblink").val('');
    $("#jsonweblinkname").val('');
    $("#popuptype").val('');
    $("#jsoncap").val('');
    $("#jsonprice").val('');    
 }

 // modernizr overlay
 (function () {
	var container = document.querySelector('div.container'),
		triggerBttn = document.getElementById('trigger-overlay'),
		overlay = document.querySelector('div.overlay'),
		closeBttn = overlay.querySelector('button.overlay-close');
	transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
		support = {
			transitions: Modernizr.csstransitions
		};

	function toggleOverlay() {
		if (classie.has(overlay, 'open')) {
			classie.remove(overlay, 'open');
			classie.remove(container, 'overlay-open');
			classie.add(overlay, 'close');
			var onEndTransitionFn = function (ev) {
				if (support.transitions) {
					if (ev.propertyName !== 'visibility') return;
					this.removeEventListener(transEndEventName, onEndTransitionFn);
				}
				classie.remove(overlay, 'close');
			};
			if (support.transitions) {
				overlay.addEventListener(transEndEventName, onEndTransitionFn);
			} else {
				onEndTransitionFn();
			}
		} else if (!classie.has(overlay, 'close')) {
			classie.add(overlay, 'open');
			classie.add(container, 'overlay-open');
		}
	}

	triggerBttn.addEventListener('click', toggleOverlay);
	closeBttn.addEventListener('click', toggleOverlay);
})();

// JSNLog
logger.info("Allpagesscript loaded");