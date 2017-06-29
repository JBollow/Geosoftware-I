Command C:\mongo\bin\
#1
mongod --dbpath "Y:\OneDrive\Dokumente\Uni\Uni Münster\SS17\Geosoftware I\Übung\06\node\geojsondb\data"

#2
mongo
use geojsondb
db.usercollection.insert({ "username" : "testuser1", "email" : "testuser1@testdomain.com" })
newstuff = [{ "username" : "testuser2", "email" : "testuser2@testdomain.com" }, { "username" : "testuser3", "email" : "testuser3@testdomain.com" }]
db.usercollection.insert(newstuff);
db.usercollection.find().pretty()