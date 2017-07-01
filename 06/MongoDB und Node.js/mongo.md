cmd.exe Ausführen in "C:\Program Files\MongoDB\Server\3.4\bin"

>#1
mongod --dbpath "Y:\OneDrive\Dokumente\Uni\Uni Münster\SS17\Geosoftware I\Übung\06\MongoDB und Node.js\geojsondb\leaflet_map\data"


>#2
mongo

use leaflet_map


db.layercollection.insert()

db.layercollection.remove({})

db.layercollection.find().pretty()