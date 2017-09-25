var fs= require('fs');
var dbName = 'meetings'; // name of Mongo database (created in the Mongo shell)    
var collName = 'meetingLocation'; // name of Mongo collection (created in the Mongo shell)

var locations = JSON.parse(fs.readFileSync('../data/finalarray.txt','utf8'));
    

    // Connection URL
    var url = 'mongodb://' + process.env.IP + ':27017/' + dbName;  

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; 

    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}

        var collection = db.collection(collName);

        // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        collection.insert(locations);
        db.close();

    }); //MongoClient.connect
