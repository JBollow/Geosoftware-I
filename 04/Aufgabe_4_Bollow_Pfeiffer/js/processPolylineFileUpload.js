//Philipp Pfeiffer: 421620
//Jan-Patrick Bollow: 349891 
//const myGeOO = GeOO(); // The geometry-help I am using in this file.
var linienGeojsonFeature = null;

/**
 * Delas with the file input.
 * It reads the file, checks its value and returns the length of the polyline, represented by the uploaded points
 * @param {event} event form the browser
 */
document.getElementById("uploadPolylineButton").onchange = function (event) {

    var input = event.target;
    var reader = new FileReader();

    // Callback when the file is loaded
    reader.onload = function () {
        try {
            var filecontent = reader.result; // Loaded content

            const coordinateArray = getValidCoordinatesFromTextfile(filecontent);
            const GeoJson = createGeoJson(coordinateArray);

        } catch (error) {
            alert(error);
        }

    };


    // Read the file
    reader.readAsText(input.files[0]);
};


/**
 * Create a GeoJson with the given coordinateArray
 * @param {Array} coordinateArray
 */
function createGeoJson(coordinateArray) {

    if (linienGeojsonFeature !== null) {

        $('li').remove();
    }

    linienGeojsonFeature = '{ "type": "FeatureCollection", "features":[ ';
    for (i = 0; i < coordinateArray.length - 3; i = i + 4) {
        var tiles = '{ "type": "Feature", "properties": {}, "geometry": { "type": "LineString", "coordinates": [ [' + coordinateArray[i + 1] + ',' + coordinateArray[i] + '], [' + coordinateArray[i + 3] + ',' + coordinateArray[i + 2] + '] ] } },';
        linienGeojsonFeature = linienGeojsonFeature + tiles;


        if ((i / 4) <= 2) {
            //Create with JQuery a List Element and set a link for the NavigationTool
            $('#routes').append("<li><a href=# data-zoom=16 line-nr=" + (i / 4) + " data-position-start=" + coordinateArray[i] + "," + coordinateArray[i + 1] + " data-position-ende=" + coordinateArray[i + 2] + "," + coordinateArray[i + 3] + ">Line " + (i / 4 + 1) + "</a></li>");
        }

        $('#map-navigation').show();
        $('#routes').hide();
        $('#routes').show(500)

    }
    linienGeojsonFeature = linienGeojsonFeature.substring(0, linienGeojsonFeature.length - 1);
    linienGeojsonFeature += ']}';

    // get a geojson object
    linienGeojsonFeature = JSON.parse(linienGeojsonFeature);

    JL().info("Geojson object was successful built.");

    // Call the leaftlet function to creat a map
    leaflet(event);

    return linienGeojsonFeature;
}