/**
 * author: Jan-Patrick Bollow, 349891#
 * 
 */

/**
 * @desc polyline class used to build polylines from line lengths
 * @method partialSum computes the length of the poly line
 */
function Polyline(lengthArray) {

    //attributes
    this.lenghtArray = lengthArray;
    this.sum = 0;

    //methods
    this.partialSum = function () {

        //this.lengthArray = lengthArray;

        for (i = 0; i < lengthArray.length; i++) {   //iterates over the lengthArray and sums it up to compute complete length
            this.sum = this.sum + lengthArray[i];
        }
    }


}
