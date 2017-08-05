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
    position: 'bottomright'
}).addTo(map);

// Autoscale map
$(window).on("resize", function () {
    if ($(window).width() > 767) {
        $("#map").height($(window).height() - (210 + $(window).height() * 0)).width($(window).width() - (32 + $(window).width() * 0.25));
        map.invalidateSize();
    } else {

        if ($(window).width() > 507) {
            $("#map").height($(window).height() - (625 + $(window).height() * 0)).width($(window).width() - (32 + $(window).width() * 0));
            map.invalidateSize();
        } else {
            if ($(window).width() > 314) {
                $("#map").height($(window).height() - (645 + $(window).height() * 0)).width($(window).width() - (32 + $(window).width() * 0));
                map.invalidateSize();
            } else {
                $("#map").height($(window).height() - (665 + $(window).height() * 0)).width($(window).width() - (32 + $(window).width() * 0));
                map.invalidateSize();
            }
        }
    }
}).trigger("resize");

// JSNLog
logger.info("The map is ready");