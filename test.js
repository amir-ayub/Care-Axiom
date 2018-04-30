var express = require('express');
var app = express();
var url = require('url');
var cheerio = require('cheerio');
var request = require('request');

//var ejs = require('ejs');
//app.set('view engine', 'ejs');




app.get('/I/want/title/', function(req, res){
    var singleUrl;
    var multiUrl;
    var pageTitle;
    var urlList= [];
    var titleArray = [];
    var requestUrl =  req.url;
   
    var myUrl =  req.query.address;


	if(requestUrl.indexOf('&') > -1){

	  multiUrl  = Object.keys(req.query.address).length;
	  res.write('<h1> Following are the titles of given websites: </h1>');
	  for(var i = 0;i < multiUrl;i++){
            urlList[i]  = req.query.address[i];
            
            request(urlList[i], function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
                titleArray[i] =  $('title').text();
                multiAddress(res,req,i);
             }
        })
		}
	}
	else{
		singleUrl = req.query.address
		var domain = singleUrl.indexOf("com") !== -1;
		if(domain){
			console.log("Url:" + singleUrl)
            
            request(singleUrl, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(body);
                    pageTitle=  $('title').text();
                    singleAddress(res,req,pageTitle); 
                }
             })

		}
		
    }
    
    function singleAddress(res,req,pageTitle) {
        res.write('<h1> Following are the titles of given websites: </h1>');
        res.write('<ul><li><span>'+singleUrl+'</span>'+'---'+ '<span>'+ pageTitle +'</span></li></ul>');
        return;
    }

   
    function multiAddress(res,req,index) {
        res.write('<ul><li>'+urlList[index]+ '---'+ titleArray[index]+'</li></ul>');
         return;
    }

    console.log(urlList);
    
});


app.get('*', function(req, res){
	res.send("Oh! Wrong Address---Not Found");

});

app.listen('3000', () => console.log('server running on http://localhost:3000'));
