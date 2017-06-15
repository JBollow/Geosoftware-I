/**
 * authors: Jan-Patrick Bollow, 349891#
 * 
 */

'use strict';
/**  
 * @desc Create a polyline, add lines read from a given file and insert the full length in the HTML document
 *
 *
 * @param event OpenFile event
 */
var ReadFile = function (event) {

    // Init
    var input = event.target;
    var reader = new FileReader();

    /**
     * @desc Invoked when file is loading. 
     */
    reader.onload = function () {
        var filecontent = reader.result;

        map.data.loadGeoJson(filecontent);

    };


    // Read the file
    reader.readAsText(input.files[0]);
};