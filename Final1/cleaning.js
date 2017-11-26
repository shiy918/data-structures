var fs=require('fs');
var cheerio=require('cheerio');
var content=fs.readFileSync('m09.txt');
var $ = cheerio.load(content);
var request= require('request');
var async = require('async');
var asyncEachObject = require('async-each-object');
var APIkey=fs.readFileSync('APIkey.txt');

//create a array for final push
var meetingsZone09=[];

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
       items.meetingTimes = [];
        
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
             
             items.meetingTimes.push(eachMeeting);
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
  
      
      
       meetingsZone09.push(items);
    //   console.log(items);

 });

 //get rid of all the empty objects
 var meetingsZone09 = meetingsZone09.filter(value => Object.keys(value).length !== 0);

 meetingsZone09.splice(0,2);
//   console.log(meetingsZone02);


async.eachObject(meetingsZone09, function(value, key, callback) {
    
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.Address.split(' ').join('+') + '&key=' + APIkey;
    request(apiRequest, function(err, resp, body) {
        if (err) { throw err; }
        
        value.latLong = JSON.parse(body).results[0].geometry.location;
    });
    
    setTimeout(callback, 2000);
}, function() {
    // console.log(meetingsFinalCorrected);

    // Write the meetings data to output.txt
    fs.writeFileSync('/home/ubuntu/workspace/data/Final1/zone9.json', JSON.stringify(meetingsZone09));
 });
 
 
// var fs=require('fs');
// var cheerio=require('cheerio');
// var zone01=fs.readFileSync('m02.txt');
// var $ = cheerio.load(zone01);
// var request= require('request');
// var async = require('async');
// var asyncEachObject = require('async-each-object');
// var APIkey=fs.readFileSync('APIkey.txt');

// var meetingsZone02=[];

// //locate tbody and tr 
// $('tbody tr').each(function(i, elem){
    
//     //for each tr, create an object called items
//     var items={};
    
//     //for element in each tr, and loop through each td under tr
//     $(elem).find('td').each(function(i,elem){
        
//         //find the second cell
//         if ($(elem).attr('style')=='border-bottom:1px solid #e3e3e3;width:350px;'){
            
//             var data=$(elem).eq(0).html()
//             //  .replace(/[\r\n\t\/]/g, '')
//             //  .replace(/(<b>)/g, '').split('<br>');
//              .replace('\n                   \t \t\n\t\t\t\t  \t   ','')
//                                   .replace('\n                    \t\n\t\t\t\t  \t   ','')
//                                   .split('<br>');
            
//               items.meetingTimes=[];
//             //   console.log(data);
//               for(var j=0;j<data.length;j++){
                
//                  if(data[j].match(/From/gi)!== null){
                
//                   var eachMeeting={};
                
//                 var line =data[j].replace(/[\r\n\t\/]/g, '').replace(/(<b>)/g, '');
//                 //   console.log(line);
//                 var line2=data[j+1];
//                 //   console.log(line2);
//                 var line3=data[j+2];
//                 //   console.log(line3);
//                  eachMeeting.Day=line.split('From')[0].trim();
//                 //  console.log(eachMeeting.Day);
//                  eachMeeting.Start=line.split('From')[1].split('to')[0].trim();
//                  eachMeeting.End=line.split('to')[1].trim();
//                  eachMeeting.Type = line2.slice(20,line2.length).trim();
//                 //   console.log(eachMeeting.Type);
//                  eachMeeting.Interest = line3.split('Interest')[1];
//                  if (eachMeeting.Interest !== ){
//                      eachMeeting.Interest=eachMeeting.Interest.split('</b>')[1];
//                  }
//                   console.log(eachMeeting.Interest);
                 
//                 //  items.meetingTimes.push(eachMeeting);
//                 //  console.log(items.meetingTimes);
                
//                  }
//               }
            
//         }
        
//         if ($(elem).attr('style')=='border-bottom:1px solid #e3e3e3; width:260px'){
            
//           items.Address= $(elem).contents().get(6).nodeValue.split(',')[0].trim()+',New York, NY';
//           items.WheelchairAccess=$(elem).eq(0).find('span').text().trim();
//           items.Church = $(elem).eq(0).find('h4').text().trim();
//           items.Content = $(elem).eq(0).find('b').text().trim();
    
//         }
//     })
    
//      meetingsZone02.push(items);
//     //  console.log(meetingsZone01);
    
// });

//  var meetingsZone02 = meetingsZone02.filter(value => Object.keys(value).length !== 0);

// // meetingsZone01.splice(0,2);


// // //   console.log(meetingsZone01);
// // async.eachObject(meetingsZone01, function(value, key, callback) {
    
// //     var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.Address.split(' ').join('+') + '&key=' + APIkey;
// //     request(apiRequest, function(err, resp, body) {
// //         if (err) { throw err; }
        
// //         value.latLong = JSON.parse(body).results[0].geometry.location;
// //     });
    
// //     setTimeout(callback, 2000);
// // }, function() {
// //     // console.log(meetingsFinalCorrected);

// //     // Write the meetings data to output.txt
// //     fs.writeFileSync('/home/ubuntu/workspace/data/Final1/zone1.json', JSON.stringify(meetingsZone01));
// //  });