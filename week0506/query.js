var fs = require('fs');

var dbName = 'zone8meetings';
var collName = 'meetingInfo';

var myQuery =[
    { $match:{Day: 'Tuesday'}},
    { $match:{ $or: [{Start:'7 PM'}, {Start: '8 PM'}]}} 
    ];


// Connection URL
var url = 'mongodb://' + process.env.IP + ':27017/' + dbName;

// Retrieve
var MongoClient = require('mongodb').MongoClient;


MongoClient.connect(url, function(err, db) {
    if (err) {return console.dir(err);}

    var collection = db.collection(collName);

    collection.aggregate( myQuery ).toArray(function(err, docs) {
        if (err) {console.log(err)}
        
        else {
            console.log("Writing", docs.length, "documents as a result of this aggregation.");
            fs.writeFileSync('mongo_aggregation_meetings.JSON', JSON.stringify(docs, null, 4));
        }
        db.close();
        
    });

}); //MongoClient.connect