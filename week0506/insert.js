var fs = require('fs');

var dbName = 'zone8meetings';
var collName = 'meetingInfo';

var meetingsFinal = JSON.parse(fs.readFileSync('output.txt','utf8'));

// Connection URL
var url = 'mongodb://' + process.env.IP + ':27017/' + dbName;

// Retrieve

  var MongoClient = require('mongodb').MongoClient; 

    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}

        var collection = db.collection(collName);

        // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        collection.insert(meetingsFinal);
        db.close();

    }); //MongoClient.connect