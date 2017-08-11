/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

L.Mapzen.apiKey = 'mapzen-Viyke6a';

var control = true;

/**
 * Initializing routing control
 */
var control = reloadControl($('#language').val(), $('#transport').val());

function reloadControl(language, tansportation) {
    // Mapzen
    control = L.Routing.control({
        waypoints: [null],
        // routeWhileDragging: true,
        showAlternatives: true,
        fitSelectedRoutes: true,
        reverseWaypoints: true,
        show: true,
        position: 'bottomleft',
        autoRoute: true,
        geocoder: L.Control.Geocoder.nominatim(),
        geocoder: L.Control.Geocoder.mapzen('mapzen-Viyke6a'),
        router: L.Routing.mapzen('mapzen-Viyke6a', {
            routeLine: function (route, options) {
                return L.Routing.mapzenLine(route, options);
            },
            directions_options: {
                language: language
            },
            costing: tansportation,
        }),
        formatter: new L.Routing.mapzenFormatter(),
        summaryTemplate: '<div class="route-info {costing}">{distance}, {time}</div>'
    }).addTo(map);
    return control;
    // JSNLog
    logger.info("Mapzen is ready");
}

// Reload language
function reloadLanguage() {
    var waypoints = control.getWaypoints();
    // JSNLog
    logger.info(waypoints);
    control.getRouter().options.directions_options.language = $('#language').val();
    // JSNLog
    logger.info("Language changed to: " + control.getRouter().options.directions_options.language);
    control.remove();
    reloadControl($('#language').val(), $('#transport').val());
    control.setWaypoints(waypoints);
}

// Reload transportation
function reloadTransport() {
    var waypoints = control.getWaypoints();
    // JSNLog
    control.getRouter().options.costing = $('#transport').val();
    // JSNLog
    logger.info("Transportation changed to: " + control.getRouter().options.costing);
    control.remove();
    reloadControl($('#language').val(), $('#transport').val());
    control.setWaypoints(waypoints);
}

function remover() {
    control.remove();
    // JSNLog
    logger.info("Control removed");
    reloadControl($('#language').val(), $('#transport').val());
    // JSNLog
    logger.info("Control rebuild");
}

// Removing all layers and hiding the legend
function removeroute() {
    control.getPlan().setWaypoints({
        latLng: L.latLng([null])
    });
    $("#legendelem").empty();
    $("#legenddiv").hide();
    $("#legendbtndiv").hide();
    $('#legend').hide();
    $("#checkroute").prop("checked", false);
    $('#jsonname').val('');
};

// show/hide function for routecontrol 
$("#checkroute").change(function () {
    if ($(this).is(':checked')) {
        control.show();
        // JSNLog
        logger.info("Show control");
    } else {
        control.hide();
        // JSNLog
        logger.info("Hide control");
    }
});

// Source: https://github.com/domoritz/leaflet-locatecontrol
var lc = L.control.locate({
    position: 'topleft',
    flyTo: true,
    cacheLocation: true,
    strings: {
        title: "Show my position"
    },
    locateOptions: {
        enableHighAccuracy: true
    }
}).addTo(map);

// Mapzen errorControl
L.Routing.errorControl(control).addTo(map);
// JSNLog
logger.info("ErrorControl loaded");