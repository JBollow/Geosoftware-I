/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

/**
 * Declaring the layers with drawn objects
 * and adding them to the map
 */
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);
// Added extra jsonLayer for DB layers
var jsonLayers = new L.FeatureGroup();
map.addLayer(jsonLayers);

// function for a custom marker
var MyCustomMarker = L.Icon.extend({
    options: {
        shadowUrl: null,
        iconAnchor: new L.Point(12, 40),
        iconSize: new L.Point(50, 41),
        iconUrl: 'http://www.clker.com/cliparts/k/Q/V/D/z/u/map-marker-small-th.png'
    }
});

// Leaflet.Draw options
var options = {
    position: 'topright',
    draw: {
        polyline: {
            shapeOptions: {
                color: '#e32821',
                weight: 10
            }
        },
        polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#e1e100', // Color the shape will turn when intersects
                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            },
            shapeOptions: {
                color: '#e32821'
            }
        },
        circle: false,
        rectangle: {
            shapeOptions: {
                clickable: false,
                color: '#e32821'
            }
        },
        marker: {
            icon: new MyCustomMarker()
        }
    },
    edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: false
    }
};

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);
// JSNLog
logger.info("Editing of the elements works only if clicked on a point with coordinates (not the middle of a line, for example)");

// adding created objects to the layer
map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === 'marker') {
        layer.bindPopup('A popup!');
    }

    editableLayers.addLayer(layer);
});



// Get the geoJSON layers from DB 
document.getElementById('jsonloaddb').onclick = function (e) {

    // clearLayers before adding to prevent duplicates
    jsonLayers.clearLayers();
    $("#jsonlegendelem").empty();

    // Adding a legend + removebutton
    $("#jsonlegenddiv").show();
    $("#jsonlegendbtndiv").show();
    $('#jsonlegend').replaceWith("<h3>Features:</h3>");
    $('#jsonlegendbtn').replaceWith("<input style='width: 100%;' type='button' class='button' value='&#x21bb; Remove all features' onclick='removelayer()'>");

    // Get all GeoJSON from our DB using our GET
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getjson",
        success: function (response) {
            // JSNLog
            logger.info('Get successful!', response);

            // Using a forEach method iterating over the array of nested objects
            response.forEach(function (entry) {

                var id = new L.FeatureGroup();
                map.addLayer(jsonLayers);

                // var jsonLayers = new L.FeatureGroup();
                // map.addLayer(jsonLayers);

                // JSNLog
                logger.info('JSON.stringify(entry.geojson)', JSON.stringify(entry.geojson));

                // Adding each geojson feature to the jsonLayers
                L.geoJSON(entry.geojson).addTo(jsonLayers);

                // Adding the layernames to the legendlist, + commented checkboxes for something that I was interested in, but maybe never finished
                $('#jsonlegendelem').append("<li><p>" + entry.geojson.name + "</p></li>");

            });
        },
        error: function (responsedata) {

            // If something fails, cleaning the legend and jsonlayers
            jsonLayers.clearLayers();
            $("#jsonlegendelem").empty();
            $("#jsonlegenddiv").hide();
            $("#jsonlegendbtndiv").hide();
            alert("Failed!");
            // JSNLog
            logger.error('Failed in!', response);
        }
    }).error(function (responsedata) {

        // If something fails, cleaning the legend and jsonlayers
        jsonLayers.clearLayers();
        $("#jsonlegendelem").empty();
        $("#jsonlegenddiv").hide();
        $("#jsonlegendbtndiv").hide();
        alert("Failed!");
        // JSNLog
        logger.error('Failed out!', response);
    });

    // JSNLog
    logger.info(jsonLayers);
};

// Removing editableLayers
function removeedit() {
    editableLayers.clearLayers();
    map.addLayer(editableLayers);
};

// Removing all layers and hiding the legend
function removelayer() {
    jsonLayers.clearLayers();
    $("#jsonlegendelem").empty();
    $("#jsonlegenddiv").hide();
    $("#jsonlegendbtndiv").hide();
};