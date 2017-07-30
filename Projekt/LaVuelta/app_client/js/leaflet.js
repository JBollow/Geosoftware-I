/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

/**
 * Initializing the map
 */

// Layers
// Marker
// var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
//     denver = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
//     aurora = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
//     golden = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');

// var cities = L.layerGroup([littleton, denver, aurora, golden]);

// Basemaps
var OpenMapSurfer_Grayscale = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
    maxZoom: 19
});
var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    maxZoom: 19
});
var OpenStreetMap_DE = L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
    maxZoom: 19
});

var map = L.map('map', {
    center: [40.417, -3.704],
    zoom: 6,
    layers: [CartoDB_DarkMatter],
});

var baseMaps = {
    "DarkMatter": CartoDB_DarkMatter,
    "Grayscale": OpenMapSurfer_Grayscale,
    "OSM DE": OpenStreetMap_DE
};

L.DomUtil.addClass(map._container, 'crosshair-cursor-enabled');

var overlayMaps = {
    // "Cities": cities
};
L.control.layers(baseMaps, overlayMaps, {
    position: 'topleft'
}).addTo(map);

// JSNLog
logger.info("The map is ready");