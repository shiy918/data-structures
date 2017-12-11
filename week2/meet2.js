var fs = require('fs');
var cheerio = require('cheerio');
var final = [];
// load the text into content
var content = fs.readFileSync('m08.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// select the corresponding element and print out the address and trim
$('td').each(function(i, elem) {
    if ($(elem).attr('style')=="border-bottom:1px solid #e3e3e3; width:260px") {
        console.log($(elem).contents().get(6).nodeValue.trim())
        final.push($(elem).contents().get(6).nodeValue.trim())
        
    };
});

fs.writeFileSync('output.json',JSON.stringify(final));