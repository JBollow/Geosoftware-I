/**
 *  @author Jan-Patrick Bollow 349891
 */

var express = require('express');
var router = express.Router();

// I didnt add any logger to my nodejs

/* GETjson 
   handles GET request 
*/
router.get('/getjson', function (req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Set our collection
  var collection = db.get('layercollection');

  // Query from our DB
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

/* POSTjson
   Posting json to mongodb
*/
router.post('/postjson', function (req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our geojson, this comes from our drawer
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

      // Or print object id
      res.send(doc._id);
    }
  });
});


// New code using routecollection

/* GETjson 
   handles GET request 
*/
router.get('/getroute', function (req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Set our collection
  var collection = db.get('routecollection');

  // Query from our DB
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

/* POSTjson
   Posting route to mongodb
*/
router.post('/postroute', function (req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our geojson, this comes from our drawer
  var geojson = req.body;

  // Set our collection
  var collection = db.get('routecollection');

  // Submit to the DB
  collection.insert({
    geojson
  }, function (err, doc) {
    if (err) {

      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    } else {

      // Or print object id
      res.send(doc._id);
    }
  });
});

// Delete json
router.get('/deletejson/:id', function (req, res) {

  var db = req.db;

  var uid = req.params.id.toString();
  var collection = db.get('layercollection');

  collection.remove({
    "_id": uid
  }, function (err, result) {
    res.send((result === 1) ? {
      msg: 'Deleted'
    } : {
      msg: 'error: ' + err
    });
  });

});

// Delete route
router.get('/deleteroute/:id', function (req, res) {

  var db = req.db;

  var uid = req.params.id.toString();
  var collection = db.get('routecollection');

  collection.remove({
    "_id": uid
  }, function (err, result) {
    res.send((result === 1) ? {
      msg: 'Deleted'
    } : {
      msg: 'error: ' + err
    });
  });

});

// Delete all json
router.get('/deletealljson', function (req, res) {

  var db = req.db;
  var collection = db.get('layercollection');

  collection.remove({}, function (err, result) {
    res.send((result === 1) ? {
      msg: 'Deleted'
    } : {
      msg: 'error: ' + err
    });
  });

});

// Delete all route
router.get('/deleteallroute', function (req, res) {

  var db = req.db;
  var collection = db.get('routecollection');

  collection.remove({}, function (err, result) {
    res.send((result === 1) ? {
      msg: 'Deleted'
    } : {
      msg: 'error: ' + err
    });
  });

});

/* GETstage 
   handles GET request 
*/
router.get('/getstage', function (req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Set our collection
  var collection = db.get('stagecollection');

  // Query from our DB
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

/* POSTstage
   Posting stage to mongodb
*/
router.post('/poststage', function (req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our geojson, this comes from our drawer
  var geojson = req.body;

  // Set our collection
  var collection = db.get('stagecollection');

  // Submit to the DB
  collection.insert({
    geojson
  }, function (err, doc) {
    if (err) {

      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    } else {

      // Or print object id
      res.send(doc._id);
    }
  });
});

// Delete all stages
router.get('/deleteallstages', function (req, res) {

  var db = req.db;
  var collection = db.get('stagecollection');

  collection.remove({}, function (err, result) {
    res.send((result === 1) ? {
      msg: 'Deleted'
    } : {
      msg: 'error: ' + err
    });
  });

});

// Delete stage
router.get('/deletestage/:id', function (req, res) {
  
    var db = req.db;
  
    var uid = req.params.id.toString();
    var collection = db.get('stagecollection');
  
    collection.remove({
      "_id": uid
    }, function (err, result) {
      res.send((result === 1) ? {
        msg: 'Deleted'
      } : {
        msg: 'error: ' + err
      });
    });
  
  });

module.exports = router;