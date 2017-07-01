/**
 * authors: Jan-Patrick Bollow 349891, Jan Tebrügge
 *
 */

var express = require('express');
var router = express.Router();

// I didnt add any logger to my nodejs

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

/* GET Userlist page. 
   Added the Userlist page
*/
router.get('/getjson', function (req, res) {
  var db = req.db;
  var collection = db.get('layercollection');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

/* POST to add GeoJSON to the DB
*/
router.post('/postjson', function (req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var geojson = req.body;

  // Set our collection
  var collection = db.get('layercollection');

  // Submit to the DB
  collection.insert({
    geojson
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    } else {
      // And forward to success page
      res.send(doc._id);
    }
  });
});

module.exports = router;