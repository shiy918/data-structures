var fs=require('fs');
var cheerio=require('cheerio');
var content=fs.readFileSync('m08.txt');
var $ = cheerio.load(content);
var request= require('request');
var async = require('async');
var asyncEachObject = require('async-each-object');
var APIkey=fs.readFileSync('APIkey.txt');

//create a array for final push
var meetingsFinal=[];

//select each table row
$('tbody tr').each(function(i,elem){
        
      var items={};
      
     // loop through each table row 
    $(elem).find('td').each(function(i,elem){
        
       //find the td that matches the attr style of cell 2  
      if ($(elem).attr('style') == 'border-bottom:1px solid #e3e3e3;width:350px;'){
          
       //store all the content from cell 2 into data
       var data = $(elem).eq(0).html().replace('\n                   \t \t\n\t\t\t\t  \t   ','')
                                   .replace('\n                    \t\n\t\t\t\t  \t   ','')
                                   .split('<br>');
       

        //create a set for all the meeting hours from cell 2 in each row 
       items.MeetingTimesArr = [];
        
        //loop through data
       for (var j = 0; j < data.length; j++){
           
        //ignore empty lines
          if (data[j].match(/From/gi) !== null){
              
            var eachMeeting={}; 
            
            //store all the meeting time into a variable line
             var line = data[j].replace(/[\r\n\t\/]/g, '').replace(/(<b>)/g, '');
            //store all the meeting type into line2
             var line2 = data[j+1];
             //store all the meeting interest into line3
             var line3 = data[j+2];
             
            //  console.log(line);
             eachMeeting.Day=line.split('From')[0].trim();
             eachMeeting.Start=line.split('From')[1].split('to')[0].trim();
             eachMeeting.End=line.split('to')[1].trim();
             eachMeeting.Type = line2.slice(20,line2.length).trim();
             eachMeeting.Interest = line3.slice(23,line2.length).trim();
             
             items.MeetingTimesArr.push(eachMeeting);
          }
          
        }
         
     }
        
        
    //get the content from cell 1  
    if($(elem).attr('style')=='border-bottom:1px solid #e3e3e3; width:260px'){
         
         items.Address= $(elem).contents().get(6).nodeValue.split(',')[0].trim()+',New York, NY';
    
         items.WheelchairAccess=$(elem).eq(0).find('span').text().trim();
  
         items.Church = $(elem).eq(0).find('h4').text().trim();
   
         items.Content = $(elem).eq(0).find('b').text().trim();
    
    }
    
    })
  
      
      
       meetingsFinal.push(items);
    //   console.log(items);

 });

 //get rid of all the empty objects
 var meetingsFinalCorrected = meetingsFinal.filter(value => Object.keys(value).length !== 0);

//  console.log(meetingsFinalCorrected);


async.eachObject(meetingsFinalCorrected, function(value, key, callback) {
    
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.Address.split(' ').join('+') + '&key=' + APIkey;
    request(apiRequest, function(err, resp, body) {
        if (err) { throw err; }
        
        value.latLong = JSON.parse(body).results[0].geometry.location;
    });
    
    setTimeout(callback, 2000);
}, function() {
    // console.log(meetingsFinalCorrected);

    // Write the meetings data to output.txt
    fs.writeFileSync('/home/ubuntu/workspace/data/week0506/output.txt', JSON.stringify(meetingsFinalCorrected));
 });