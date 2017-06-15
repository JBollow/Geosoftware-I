/**
 * authors: Jan-Patrick Bollow 349891, Anna Formaniuk 427493, Jens
 * 
 */

'use strict';

var ReadFile = function (event) {

    // Init
    var input = event.target;
    var reader = new FileReader();

    reader.onload = function () {
        var filecontent = reader.result;

        map.data.loadGeoJson(filecontent);

    };

    // Read the file
    reader.readAsText(input.files[0]);
};