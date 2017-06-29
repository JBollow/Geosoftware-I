Command C:\mongo\bin\
#1
mongod --dbpath c:\node\nodetest1\data\

#2
mongo
use nodetest1
db.usercollection.insert({ "username" : "testuser1", "email" : "testuser1@testdomain.com" })
newstuff = [{ "username" : "testuser2", "email" : "testuser2@testdomain.com" }, { "username" : "testuser3", "email" : "testuser3@testdomain.com" }]
db.usercollection.insert(newstuff);
db.usercollection.find().pretty()