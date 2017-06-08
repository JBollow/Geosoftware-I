/**
 * author: Jan-Patrick Bollow, 349891#
 *  
 * new and cleaner, divided into many scripts
 */


var coordArray; //initializing Array
var filecontent; //initializing String
var lengthArray = []; //initializing Array
var geoJsonArray = []; //initializing GeoJSON Array

/**
 * Works best with Firefox
 * ConsoleAppender works with Chrome
 * 
 * Chrome doesn't allow cross origin without
 * chrome --disable-web-security or --allow-file-access-from-files --allow-file-access --allow-cross-origin-auth-prompt
 * 
 * Logs aren't saved local, but visible in console using ConsoleAppender (missing write rights)
 * http://jsnlog.com/Documentation/WebConfig/JSNLog/ConsoleAppender 
 * 
 */
var logger = JL();
var consoleAppender = JL.createConsoleAppender('consoleAppender');
logger.setOptions({ "appenders": [consoleAppender] });


/**
* @desc main function;
 *      reads txt input into a string (filecontent) and calls the self defined functions to build a polyline
* @see Learnweb
* @param event OpenFile event
*/
var ReadFile = function (event) {

    var input = event.target;
    var reader = new FileReader();


    reader.onload = function () {

        filecontent = reader.result; //coordinate data saved to this variable

        /*
        *  First logger
        *  filecontent = content of the read file
        */
        // console.log(filecontent);
        console.log("logger.info(filecontent);");
        logger.info(filecontent);

        myBuildArray = new BuildArray(filecontent);
        myBuildArray.work(); //using self defined work function; see below

        /*
        *  Second logger
        *  coordArray = array of all coordinates

                    "coordinates": [[coordArray[i+1], coordArray[i]], [coordArray[i+3], coordArray[i+2]]]
                    "coordinates": [[7.625104, 51.936584], [7.626327, 51.955811]]

        */
        // console.log(coordArray);
        console.log("logger.info(coordArray);");
        logger.info(coordArray);


        for (i = 0; i < coordArray.length - 4; i = i + 4) { //iterating over array length...

            /*
            *  logger
            *  coordArray = array of all coordinates
             */

            console.log("logger.info(coordArray[i]+coordArray[i+1]);");
            logger.info(coordArray[i] + " " + coordArray[i + 1]);

            var geojsonLine = {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[coordArray[i + 1], coordArray[i]], [coordArray[i + 3], coordArray[i + 2]]]
                },
            };
            map.data.addGeoJson(geojsonLine);


            myPoint = new Point(coordArray[i], coordArray[i + 1]); //... to build points ....
            myPoint2 = new Point(coordArray[i + 2], coordArray[i + 3]);


            /*
            *  Third logger
            *  myPoint = point#1
            */
            // console.log(myPoint);
            console.log("logger.debug(myPoint);");
            logger.debug(myPoint);

            /*
            *  Fourth logger
            *  myPoint2 = point#2
            */
            // console.log(myPoint2);
            console.log("logger.debug(myPoint2);");
            logger.debug(myPoint2);




            /**  +++++++++++Line+++++++++++
            *
              myLine = new Line(myPoint, myPoint2); //... and combine those to lines...
              myLine.buildLine(); // using self defined build function; see below
              lengthArray.push(myLine.length);        
            */


        }


        /**  +++++++++++Polyline+++++++++++
        *

        myPolyLine = new Polyline(lengthArray); // builds polyline from the lines lengths stored in lengthArray
        myPolyLine.partialSum(); // computes the total length

        // Changes the results paragraph in the HTML doc to display the calculated length
        document.getElementById("results").innerHTML = "The length of the polyline is is: " + myPolyLine.sum + "km";
        lengthArray.length = 0; // resets the lengthArray to allow multiple computations without refresh
        
        */

    };

    reader.readAsText(input.files[0]);

};

/**
 * @desc transforms input String into Array
 * @param input .txt file
 */
function BuildArray(input) {

    //methods
    this.work = function (input) {
        filecontent = filecontent.replace(/^\D+/g, ''); //using regex to filter all leading non-numerals
        filecontent = filecontent.replace(/\n/g, " "); // using regex to change line breaks to whitespaces
        filecontent = filecontent.replace(/[^\d.\s]/g, ''); //using regex to filter everything non-numeric except whitespaces

        coordArray = filecontent.split(" "); // using the whitespaces to split String into an array
        coordArray = coordArray.filter(function (entry) { return entry.trim() != ''; }); // trimming the whitespaces from the array, after using them to split the String into the array

        while (coordArray[0].length <= 3) {
            coordArray.shift();
        }

        if (coordArray.length < 2) { // error handling for empty .txt. files

            /*
            *  Fifth logger
            *  temp3 = distance between points
            */
            // console.log(temp3);
            console.log("logger.ERROR(Not enough coordinates given!);");
            logger.error("Not enough coordinates given!");
            // fixed ERROR

            alert("Not enough coordinates given!");
            document.getElementById("results").innerHTML = "The given file does not contain enough points to construct a polyline!";
            lengthArray.length = 0;
            throw "File does not contain coordinates!";

        }
    }
}