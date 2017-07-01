/**
 * authors: Jan-Patrick Bollow 349891, Anna Formaniuk 427493, Jens Seifert 408076
 * 
 */

'use strict';

// function to resize the mapbox
$(function () {
    $("#resizebox").resizable({
        maxHeight: 600,
        minHeight: 600
    });
});