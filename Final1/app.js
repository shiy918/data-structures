var express = require('express'),
    app = express();
var fs = require('fs');
var moment = require('moment-timezone'); // npm install moment-timezone


// Mongo
var collName = 'meetings';
var MongoClient = require('mongodb').MongoClient;
var url = process.env.ATLAS;

// HTML wrappers for AA data
var index1 = fs.readFileSync("index1.txt");
var index3 = fs.readFileSync("index3.txt");


app.get('/aa', function(req, res) {

    MongoClient.connect(url, function(err, db) {
         if (err) {return console.dir(err);}
         var days =['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];

        var dayIndex = moment.tz(new Date(),"America/New_York").days();
        var dayNow=days[dayIndex];
        var tomorrowIndex;
        if (dayIndex == 6) {tomorrowIndex = 0;}
        else {tomorrowIndex = dayIndex + 1}
        var tomorrow=days[tomorrowIndex];
       
        var hour =moment.tz(new Date(),"America/New_York").hours() ;
        
        var collection = db.collection(collName);
    
        collection.aggregate([ // start of aggregation pipeline
            // match by day and time
            
            { $unwind: "$meetingTimes"},
            { $match : 
                { $or : [
                    { $and: [
                        { "meetingTimes.Day" : dayNow } , { "meetingTimes.StartHourMil" : { $gte: hour } }
                    ]},
                    { $and: [
                        { "meetingTimes.Day" : tomorrow } , { "meetingTimes.StartHourMil" : { $lte: 4 } }
                    ]}
                ]}
            },

               
            
            // group by meeting group
            { $group : { _id : {
                latLong : "$latLong",
                Content : "$Content",
                Address : "$Address",
                Church:"$Church",
                WheelchairAccess : "$WheelchairAccess",
                },
                    Day : { $push : "$meetingTimes.Day" },
                    Start : { $push : "$meetingTimes.Start" },
                    End:{ $push: "$meetingTimes.End"},
                    Type : { $push : "$meetingTimes.Type" }
            }
            },
            
            // group meeting groups by latLong
            {
                $group : { _id : { 
                    latLong : "$_id.latLong"},
                    meetingGroups : { $push : {groupInfo : "$_id", Day : "$Day", Start : "$Start", End: "$End",Type : "$Type" }}
                }
            }
        
            ]).toArray(function(err, docs) { // end of aggregation pipeline
            if (err) {console.log(err)}
            
            else {
                res.writeHead(200, {'content-type': 'text/html'});
                res.write(index1);
                res.write(JSON.stringify(docs));
                res.end(index3);
            }
            db.close();
        });
    });
    
});

// app.listen(process.env.PORT, function() {
app.listen(3000, function() {
    console.log('Server listening...');
});