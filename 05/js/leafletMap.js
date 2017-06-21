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