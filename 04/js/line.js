/**
 * author: Jan-Patrick Bollow, 349891#
 * 
 */

/**
 * @desc line class used to compute lengths
 * reuses Haversine formula from assignment 1
 * @param pt1 first point constructed with coordinates
 * @param pt2 second point constructed with coordinates
 */
function Line(pt1, pt2) {

    //attributes
    this.pt1 = pt1;
    this.pt2 = pt2;

    //methods
    this.buildLine = function (pt1, pt2) {

        // Computing data by using Haversine formula specified in linked documents
        var radius = 6371; //Radius of the earth in km
        var degreeLatitude = degree2radians(this.pt2.lat - this.pt1.lat);
        var degreeLongitude = degree2radians(this.pt2.long - this.pt1.long);
        var temp1 =
            Math.sin(degreeLatitude / 2) * Math.sin(degreeLatitude / 2) +
            Math.cos(degree2radians(this.pt1.lat)) * Math.cos(degree2radians(this.pt2.lat)) *
            Math.sin(degreeLongitude / 2) * Math.sin(degreeLongitude / 2)
            ;
        var temp2 = 2 * Math.atan2(Math.sqrt(temp1), Math.sqrt(1 - temp1));
        var temp3 = radius * temp2; //temp3 = distance in km

        this.length = temp3;

        /*
        *  Sixth logger
        *  temp3 = distance between points
        */
        // console.log(temp3);
        console.log("logger.info(temp3);");
        logger.info(temp3);

    }
}