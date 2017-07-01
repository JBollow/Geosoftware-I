/**
 * authors: Jan-Patrick Bollow 349891, Anna Formaniuk 427493, Jens Seifert 408076
 *
 */

'use strict';

/**
 * Declaring base layers.
 */
var outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW5uYWZvcm0iLCJhIjoiY2ozajFtN2k0MDBoaTJxcHB0NHRhOTJvNCJ9.CmTGIYadbGm2Ae6j3pIYPQ', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.outdoors'
});

/**
 * Initializing the map
 */
var theMap = L.map('leafletMap', {
    center: [51.4, 8.09],
    zoom: 5,
    layers: [outdoors]
});
JL().info("The map is ready");


/**
 * Declaring the layers with drawn objects
 * and adding them to the map
 */
var editableLayers = new L.FeatureGroup();
theMap.addLayer(editableLayers);
// Added extra jsonLayer for DB layers
var jsonLayers = new L.FeatureGroup();
theMap.addLayer(jsonLayers);

// function for a custom marker
var MyCustomMarker = L.Icon.extend({
    options: {
        shadowUrl: null,
        iconAnchor: new L.Point(22, 94),
        iconSize: new L.Point(38, 95),
        iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-orange.png'
    }
});

// Leaflet.Draw options
var options = {
    position: 'topright',
    draw: {
        polyline: {
            shapeOptions: {
                color: '#f357a1',
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
                color: '#bada55'
            }
        },
        //circle: false, // Turns off this drawing tool
        rectangle: {
            shapeOptions: {
                clickable: false
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
theMap.addControl(drawControl);
JL().info("Editing of the elements works only if clicked on a point with coordinates (not the middle of a line, for example)");

// adding created objects to the layer
theMap.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === 'marker') {
        layer.bindPopup('A popup!');
    }

    editableLayers.addLayer(layer);
});

/*
 save from leaflet draw
 @copyright April 19, 2017 Dan Swick
 @see https://bl.ocks.org/danswick/d30c44b081be31aea483
 */
document.getElementById('export').onclick = function (e) {
    // Extract GeoJson from editableLayer
    var data = editableLayers.toGeoJSON();

    // Stringify the GeoJson
    var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

    // Create export
    document.getElementById('export').setAttribute('href', 'data:' + convertedData);
    document.getElementById('export').setAttribute('download', 'data.geojson');
};

/*
    New Code!
*/

// Post the geoJSON layer to DB
document.getElementById('post2db').onclick = function (e) {
    // Extract GeoJson from editableLayer
    var data = editableLayers.toGeoJSON();

    // Add a name to the layer
    data.name = $("#jsonname").val();

    var senddata = JSON.stringify(data);

    // Post to local mongodb via nodejs
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/postjson",
        dataType: 'json',
        contentType: 'application/json',
        data: senddata,
        traditional: true,
        cache: false,
        processData: false,
        success: function () {
            alert($("#jsonname").val() + " added to DB");
            // JSNLog
            logger.info("Post successful!");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed!");
            // JSNLog
            logger.error("Posting failed!");
        }
    });
};

// Get the geoJSON layers from DB 
document.getElementById('loaddb').onclick = function (e) {
    // clearLayers before adding to prevent duplicates
    jsonLayers.clearLayers();
    $("#legendelem").empty();

    // Adding a legend + removebutton
    $("#legenddiv").show();
    $("#legendbtndiv").show();
    $('#legend').replaceWith("<h2>Layers:</h2>");
    $('#legendbtn').replaceWith("<input style='width: 100%;' type='button' class='button' value='Remove all layers' onclick='remove()'>");


    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getjson",
        success: function (response) {
            // JSNLog
            logger.info('Get successful!', response);
            response.forEach(function (entry) {
                // JSNLog
                logger.info('JSON.stringify(entry.geojson)', JSON.stringify(entry.geojson));

                L.geoJSON(entry.geojson).addTo(jsonLayers);
                // Adding the layernames+checkboxes to the legendlist
                $('#legendelem').append("<li><p> <!--<input type='checkbox' checked>--> " + entry.geojson.name + "</p></li>");

            });
        },
        error: function (responsedata) {
            jsonLayers.clearLayers();
            $("#legendelem").empty();
            $("#legenddiv").hide();
            $("#legendbtndiv").hide();
            alert("Failed!");
            // JSNLog
            logger.error('Failed in!', response);
        }
    }).error(function (responsedata) {
        jsonLayers.clearLayers();
        $("#legendelem").empty();
        $("#legenddiv").hide();
        $("#legendbtndiv").hide();
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
    theMap.addLayer(editableLayers);
};

// Removing all layers and hiding the legend
function remove() {
    jsonLayers.clearLayers();
    $("#legendelem").empty();
    $("#legenddiv").hide();
    $("#legendbtndiv").hide();
};