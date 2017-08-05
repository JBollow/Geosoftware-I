/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

/*
 save from leaflet draw to local disk
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

// Post the geoJSON layer to DB
document.getElementById('post2db').onclick = function (e) {

    // Extract GeoJson from editableLayer
    var data = editableLayers.toGeoJSON();

    // Add a name to the layer
    data.name = $("#jsonname").val();

    var senddata = JSON.stringify(data);

    // Post to local mongodb
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