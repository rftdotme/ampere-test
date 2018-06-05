import express from 'express'

const port = process.env.PORT || 5000
const app = express()

import webpack from 'webpack'                               
import webpackMiddleware from 'webpack-dev-middleware'      
import webpackHotMiddleware from 'webpack-hot-middleware'   
import webpackConfig from '../webpack.config.dev'           
 
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig)                     
  app.use(webpackMiddleware(compiler, {                       
    hot: true,                                                
    publicPath: webpackConfig.output.publicPath,              
    noInfo: true                                              
  }))                                                         
  app.use(webpackHotMiddleware(compiler)) 
}

import path from 'path'



//=-------------------------------------------------

var request = require('request'),
		cheerio = require('cheerio');

var	articles = [];
var	start_url = 'https://www.ampereanalysis.com/blog/page';

var is_server_loading_data = true; //state
var page_num = 1; //counter

//builds url from counter value
function makeURL() {
  return start_url + page_num;
}

//sends request to fetch data. if request is successful - launches another request(recursively?), otherwise - stops a request chain(when request has failed)
function fetchDataFromPage(url) {
  if (!is_server_loading_data) {
    return;
  }

  request(url, function(err, resp, body){    
    console.log("Requesting page: " + url);
    if (!err && resp.statusCode == 200) {      
      var $ = cheerio.load(body);      

      //check lenght of div
      if ( $('.item').children().length > 0 ) {
        $('.item').each(function(index, val) {
          var name = $(val).find('.pad-10 a').text();
    
          res = $(val).find('span').text();
          var re1='.*?';	// Non-greedy match on filler
          var re2='((?:(?:[0-2]?\\d{1})|(?:[3][01]{1}))[-:\\/.](?:[0]?[1-9]|[1][012])[-:\\/.](?:(?:\\d{1}\\d{1})))(?![\\d])';	// DDMMYY 1
    
          var p = new RegExp(re1+re2,["i"]);
          var m = p.exec(res);
          if (m != null) {
              var res=m[1];
          }
    
          var date = res;
          var title = $(val).find('u').text();
          var article = {
            date: date,
            author: name,
            title: title
          };
    
          articles.push(article);
        });

        //Moving to the next request
        page_num++;
        fetchDataFromPage(makeURL());
      }
      else {
        //we are getting an empty pages - stopping our request machine
        is_server_loading_data = false;
        console.log("Requesting has stopped");
      }
    }
    else {
      //fail
      is_server_loading_data = false;
      console.log("Requesting has stopped. Received an Error.");
    }
  });  
}


console.log("Requesting has begun");

//Note: We are starting from start_page and building a new query with makeURL()
var start_page = 'https://www.ampereanalysis.com';
fetchDataFromPage(start_page);

//=-------------------------------------------------





app.get('/', (req, res) => res.sendFile(path.join(__dirname,"../index.html")))
//api get all data from ampere
app.get('/api', (req, res) => res.send(articles))
app.get('/isServerLoadingData', (req, res) => res.send(is_server_loading_data))

app.listen(port, () => console.log('Server listen on port =', port, 'ENV =', process.env.NODE_ENV))