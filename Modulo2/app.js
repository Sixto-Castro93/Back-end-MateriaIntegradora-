var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose');
var http = require('http');
var path = require('path');
var urlp = require("url");
var HashMap = require('hashmap');
var cons= require('consolidate');
var cookieParser = require('cookie-parser'); 
var multipart = require('connect-multiparty');
/*var redis = require("redis");

var pub = redis.createClient();
var sub = redis.createClient();*/

var server = app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});  
var socket = require('socket.io')
var io = socket(server);

// Middlewares
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multipart())
//app.use(express.static('public'));



io.sockets.on('connection', function(socket) {  
  console.log('Alguien se ha conectado con Sockets');
   });
    
app.get('/hello', function(req, res) {  
  res.status(200).send("Hello World!");
});

/*var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/data";

// Connection to DB
/*mongoose.connect('mongodb://localhost/prueba', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});*/

mongoose.connect('mongodb://localhost/data', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});



// Import Models and controllers
var models     = require('./models/tvshow')(app, mongoose);
var TVShowCtrl = require('./controllers/tvshows');



// Example Route
var router = express.Router();
router.get('/', function(req, res) {
  res.send("Hello world!");
});
app.use(router);

// API routes
var tvshows = express.Router();

tvshows.route('/tvshows')
  .get(TVShowCtrl.findAllTVShows)
  .post(TVShowCtrl.addTVShow);

tvshows.route('/tvshows/:id')
  .get(TVShowCtrl.findById)
  .put(TVShowCtrl.updateTVShow)
  .delete(TVShowCtrl.deleteTVShow);

app.use(tvshows);
app.get('/2v', function(req, res) {
    //res.cookie('screen2', 1, { maxAge: minute });
    res.render('test_secondScreen', {
        title: '2 Pantalla DEMO'
        //cookie: req.cookies.screen2
    });
});
  
/*MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var myobj = {
        title: "LOST",
        year: 2004,
        country: "USA",
        poster: "http://ia.media-imdb.com/images/M/MV5BMjA3NzMyMzU1MV5BMl5BanBnXkFtZTcwNjc1ODUwMg@@._V1_SY317_CR17,0,214,317_.jpg",
        seasons: 6,
        genre: "Sci-Fi",
            summary: "The survivors of a plane crash are forced to live with each other on a remote island, a dangerous new world that poses unique threats of its own."
      }
      //var myobj = { username: "jg", password: "123"};
      db.collection("TVShow").insert(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 record inserted");
      db.close();
      });
  });*/

app.get('/:name', function (req, res, next) {

  var options = {
    root: __dirname + '/public/uploads/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile(__dirname + '/uploads/'+fileName, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
  

});

/*sub.subscribe("analytics");
sub.on("subscribe", function(channel, count) {
    console.log("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
    pub.publish("analytics", "Bon cul, petite salope");
});

sub.on("message", function(channel, message) {
    console.log("Message from channel " + channel + ": " + message);
});
*/



// Start server
/*server.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});*/
