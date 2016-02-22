var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var base58 = require('./base58');

// grab the url model
var Url = require('./models/url');

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);


app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/api/shorten', function(req, res){
  var longUrl = req.body.url;
  var shortUrl = '';
    console.log('1. Short URL: ' + shortUrl);
  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      shortUrl = config.webhost + base58.encode(doc._id);
        console.log('2. Short URL: ' + shortUrl);

      // the document exists, so we return it without creating a new entry
      res.send({'shortUrl': shortUrl});
    } else {
      // since it doesn't exist, let's go ahead and create it:
      var newUrl = Url({
        long_url: longUrl
      });
        console.log('3. New URL: ' +newUrl);
      // save the new link
      newUrl.save(function(err) {
        if (err){
          console.log(err);
        }

        console.log('4. Short URL: ' + shortUrl);
        shortUrl = config.webhost + base58.encode(newUrl._id);

        res.send({'shortUrl': shortUrl});
      });
    }

  });

});

app.get('/:encoded_id', function(req, res){

  var base58Id = req.params.encoded_id;

  var id = base58.decode(base58Id);

  // check if url already exists in database
  Url.findOne({_id: id}, function (err, doc){
    if (doc) {
      res.redirect(doc.long_url);
    } else {
      res.redirect(config.webhost);
    }
  });

});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
