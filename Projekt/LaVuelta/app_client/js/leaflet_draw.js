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

// Removing editableLayers
function removeedit() {
    editableLayers.clearLayers();
    map.addLayer(editableLayers);
    // JSNLog
    logger.info("Removed editableLayers");
};