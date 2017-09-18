var fs = require('fs');

    addresses = JSON.parse(fs.readFileSync('../data/output.json'));  
    //convert the street addresses to a JS object

for(var i = 0; i< addresses.length; i++){
    addresses[i] = addresses[i].split(',')[0] +', New York, NY';
    //console.log(addresses[i]);
}

var request = require('request'); 
var async = require('async');
APIkey=fs.readFileSync('../data/APIkey.txt');
var meetings=[];
var finalarray=[];

async.eachSeries(addresses, function(value, callback) {
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+')+ '&key=' + APIkey;
    var thisMeeting = new Object;
    thisMeeting.address = value;
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
        meetings.push(thisMeeting);
    });
    setTimeout(callback, 2000);
}, function() {
    //console.log(meetings);
    fs.writeFileSync('finalarray.txt',JSON.stringify(meetings));
});
