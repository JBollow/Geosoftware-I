/**
 * authors: Jan-Patrick Bollow 349891, Anna Formaniuk 427493, Jens
 * 
 */

'use strict';

function geoJsonLink() {
    // getting the link from the textinput
    var link = $("#jsonLink").val();
    // pushing the linked geojson to the map
    map.data.loadGeoJson(link);
};