//Philipp Pfeiffer: 421620
//Jan-Patrick Bollow: 349891

/**
 * @description Returns a string of valid coordinates in the form lat,lon,lat,lon....
 * @param {string} the fileinput to be processed.
 * @return {Array} If the file has only valid coordinates, they will be returned as string.
 */
function getValidCoordinatesFromTextfile(filecontent) {
    try {
        const numericContentAsStrig = getNumericFileContent(filecontent);
        return getValidInputAsArray(numericContentAsStrig);
    } catch (error) {
        JL("getValidCoordinatesFromTextfile").warn("Message " + error);
    }
}


/**
 * @description Extracts all numeric values from an string (here textfile) with the pattern -?x.x, -?x.x.
 * x stands for any number of numeric values.
 * @param {String} commaSeparatedStringValues
 * @return {Array} String without whitespaces, if the input was valid.
 */
function getNumericFileContent(fielcontent) {
    const numericContent = /-?\d*\.\d*, -?\d*\.\d*/g; // First we extract only the numeric content. Validation does another function.
    if (numericContent.length === 0) {
        JL("getNumericFileContent").warn("No numeric input in file extrected with scemathe scema " + numericSchema);
    } else {
        return fielcontent.match(numericContent);
    }
}

/**
 * @description Takes a string and tests if it is a valid representation of coordinatepairs.
 * It is valid, if the numeric value at an even position matches ^(-?(((([0-9]{1,2})|(1[0-7]{0,1}[0-9]{0,1}))(\.\d{0,6})?)|180(\.0{0,6})?))$
 * The others ^(-?((((([0-8]{1,2})|([0-8]9?))(\.\d{0,6})?))|90(\.0{0,6})?))$
 * @param {String} commaSeparatedStringValues
 * @return {Array} String without whitespaces, if the input was valid.
 */
function getValidInputAsArray(commaSeparatedStringValues) {

    const inputAsString = String(commaSeparatedStringValues).replace(/ /g, ''); // Whitespacereplacement from http://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text
    const inputAsArray = inputAsString.split(",");
    const validLat = /^(-?((((([0-8]{1,2})|([0-8]9?))(\.\d{0,6})?))|90(\.0{0,6})?))$/; // Regexp for validation of Latitude-values. Must be in [-90.90]
    const validLon = /^(-?(((([0-9]{1,2})|(1[0-7]{0,1}[0-9]{0,1}))(\.\d{0,6})?)|180(\.0{0,6})?))$/;
    // Regexp for validation of Lon-values. Must be in [-180.180]

    const output = [];
    for (let i = 0; i < inputAsArray.length - 1; i += 2) {
        const latValid = validLat.test(inputAsArray[i]); // expecting the i-value to be latitude
        const lonValid = validLon.test(inputAsArray[i + 1]); // expectig the i+1 value to be longitude
        if (latValid && lonValid) {
            output.push(inputAsArray[i]);
            output.push(inputAsArray[i + 1]);
        } else {
            JL("getValidInputAsArray").warn("it is not a valid representation of coordinatepairs. Lat:" + inputAsArray[i + 1] + " & long:" + inputAsArray[i] + ".");
        }
    }

    if (output.length < 4) { // At least 
        JL("getValidInputAsArray").warn("Not enough values for a polyline. Please provide at least 2 valid coordinate tuples");
    }

    JL("getValidInputAsArray").info("Array from which the polyline is constructed: " + output);
    return output;
}