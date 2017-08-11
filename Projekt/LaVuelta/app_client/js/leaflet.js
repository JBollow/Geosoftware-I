/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

/**
 * Initializing the map
 */

//  Layer
var overlayMaps = {};

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

L.control.layers(baseMaps, overlayMaps, {
    position: 'bottomright'
}).addTo(map);

// Autoscale map
$(window).on("resize", function () {
    if ($(window).width() > 767) {
        $("#map").height($(window).height() - (200 + $(window).height() * 0)).width($(window).width() - (32 + $(window).width() * 0.25));
        map.invalidateSize();
    } else {

        if ($(window).width() > 507) {
            $("#map").height(500).width($(window).width() - (32 + $(window).width() * 0));
            map.invalidateSize();
        } else {
            if ($(window).width() > 314) {
                $("#map").height(400).width($(window).width() - (32 + $(window).width() * 0));
                map.invalidateSize();
            } else {
                $("#map").height(300).width($(window).width() - (32 + $(window).width() * 0));
                map.invalidateSize();
            }
        }
    }
}).trigger("resize");

// JSNLog
logger.info("The map is ready");