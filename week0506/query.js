var fs = require('fs');

var dbName = 'zone8meetings';
var collName = 'meetingInfo';

var myQuery =[
    
      { $match : { "MeetingTimesArr.Day" : "Tuesdays" } },
      { $unwind :  "$MeetingTimesArr" }, //get each object seperated from the set
      { $match: { "MeetingTimesArr.Day" : "Tuesdays" }},
      { $match: { $or: [{"MeetingTimesArr.Start" : "7:00 PM"}, {"MeetingTimesArr.Start" : "8:00 PM"}]} }
    
     
    ]


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