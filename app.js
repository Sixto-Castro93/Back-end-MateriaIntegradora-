/**
 * Module dependencies.
 */
var express = require('express');
var crypto = require('crypto');   
var md5 = require('md5');
var CryptoJS = require("crypto-js");
var sha512 = require('js-sha512');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var HashMap = require('hashmap');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/data";
var bodyParser = require('body-parser');

var connections = 0;
var salt= '';
var passwordData = '';
var passwordHash = '';
var nombre = '';
var passAdminHash = '';
var resultDB = '';
var resultStr = '';
var finalJson = '';
var finalPassDB = '';

var app = express();
var server = http.createServer(app);
io = io.listen(server);
var map_ids_idsonido = new HashMap();
// all environments
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies
app.set('port', process.env.PORT || 3331);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.post('/jsonConf', function(req, res) {
    var json_confi = req.body.schema2;
    console.log("Table json_contenidos_subidos!" + json_confi);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myobj = {
            name: "config",
            json: json_confi
        };
        var query = {
            name: "config"
        };
        db.collection("Json_Config").find(query).toArray(function(err, result) {
            if (err) {
                throw err;
                res.render('config_json', {
                    title: 'Configuración Json',
                    json: '',msm:'error'
                });
            } else if (result.length > 0) {
                var newvalues = {
                    $set: {
                        json: json_confi
                    }
                };
                db.collection("Json_Config").update(query, newvalues, function(err, result) {
                    if (err){ throw err
                                    res.render('config_json', {
                    title: 'Configuración Json',
                    json: '',msm:'error'
                })}
                    else {
                        console.log(result.result.nModified + " record updated");
                        res.render('vista_json', {
                            title: 'Vista Json',
                    json: json_confi,msm:'OK'
                        });
                    }
                });
            } else {
                db.collection("Json_Config").insertOne(myobj, function(err, result) {
                           if (err){ throw err
                                    res.render('config_json', {
                    title: 'Configuración Json',
                    json: '',msm:'error'
                })}
                    else {
                        console.log("1 record inserted");
                        res.render('vista_json', {
                            title: 'Vista Json',
                    json: json_confi,msm:'OK'
                        });
                    }
                });
            }
            console.log(result.length);
            db.close();
        });

    });

    // res.render('page_contenido', { title: 'Subir Contenido' });
    //res.render('index', { title: '1 Pantalla DEMO' });
});
app.get('/', function(req, res) {
    res.render('index', {
        title: '1 Pantalla DEMO'
    });
});
app.get('/2v', function(req, res) {
    res.render('test_secondScreen', {
        title: '2 Pantalla DEMO'
    });
});
app.get('/vista_json', function(req, res) {
  MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
                     res.render('vista_json', {
                            title: 'Vista Json',
                    json: '',msm:'error'
                        });

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config").find(query).toArray(function(err, result) {
            if (err) {
                     res.render('vista_json', {
                            title: 'Vista Json',
                    json: '',msm:'error'
                        });
                throw err;

            } else if (result.length > 0) {
                console.log(result);
                res.render('vista_json', {
                    title: 'Vista Json',
                    json: result[0].json,msm:'view'
                });
            } else {
               res.render('vista_json', {
                    title: 'Vista Json',
                    json: '',msm:'view'
                });

            }
            console.log(result.length);
            db.close();
        });
    });
});
app.get('/contenido', function(req, res) {
    res.render('page_contenido', {
        title: 'Subir Contenido'
    });
});
app.get('/login', function(req, res){
  //res.render('login_admin', { title: 'Login Admin' });
  res.render('login_admin', {
    title: 'Login Admin',
    band: 'false',
    msm : 'OK',
    username: ''

            });
});
app.get('/subir_cont', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
            res.render('config_json', {
                title: 'Configuración Json',
                msm: 'error al conectar con la bse mongodb',
                json: ''
            });

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config").find(query).toArray(function(err, result) {
            if (err) {
                res.render('subir_cont', {
                    title: 'Subir Contenido',
                    msm: 'error al conectar con la bse mongodb',
                    json: ''
                });
                throw err;

            } else if (result.length > 0) {
                console.log(result);
                res.render('subir_cont', {
                    title: 'Subir Contenido',
                    json: result[0].json
                });
            } else {
                res.render('subir_cont', {
                    title: 'Subir Contenido',
                    json: ''
                });

            }
            console.log(result.length);
            db.close();
        });
    });

});
app.get('/config_json', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
            res.render('config_json', {
                title: 'Configuración Json',
                msm: 'error al conectar con la base mongodb',
                json: ''
            });

        }
        var query = {
            name: "config"
        };
        db.collection("Json_Config").find(query).toArray(function(err, result) {
            if (err) {
                res.render('config_json', {
                    title: 'Configuración Json',
                    msm: 'error al conectar con la base mongodb',
                    json: ''
                });
                throw err;

            } else if (result.length > 0) {
                console.log(result);
                res.render('config_json', {
                    title: 'Configuración Json',
                    json: result[0].json,msm:'OK'
                });
            } else {
                res.render('config_json', {
                    title: 'Configuración Json',
                    json: '',msm:'OK'
                });

            }
            console.log(result.length);
            db.close();
        });
    });
});

io.set('log level', 1);

// Escuchamos conexiones entrantes
io.sockets.on('connection', function(socket) {
    connections++;
    console.log('connected', connections);

    // socket.broadcast.emit('move', data);

    socket.on('opcion_2c', function(data) {
        console.log('Sala:', data.sala);
        console.log('Sala:', data.option);
        io.to(data.sala).emit('opcion_1c', data.option);
    });
    socket.on('opciones', function(data) {
        // transmitimos el movimiento a todos los clienntes conectados
        console.log('Opciones:', data.opciones);
        io.to(data.sala).emit('op_second_screen', data.opciones);
    });
    socket.on('crearSala', function(data, callback) {
        // transmitimos el movimiento a todos los clienftes conectados
        console.log('Sala:', data.sala);
        socket.join(data.sala);
        callback({
            sala: data.sala
        });
    });
    socket.on('registrar_id_socket', function(data) {
        // transmitimos el movimiento a todos los clientes conectados
        console.log('is socket:', data.id_s);
        map_ids_idsonido.set(data.id_audio, data.id_s);

    });
    socket.on('unir_Sala', function(data) {
        // transmitimos el movimiento a todos los clientes conectados
        console.log('unir_Sala:', data.sala);
        console.log('Invitado:', data.invitado);
        var ids = map_ids_idsonido.get(data.invitado)
        socket.broadcast.to(ids).emit('invitacion_Sala', {
            sala: data.sala,
            invitado: data.invitado
        });
    });
    socket.on('disconnect', function() {
        connections--;
        console.log('connected', connections);
        map_ids_idsonido.remove(socket.id)
        socket.broadcast.emit('connections', {
            connections: connections
        });
    });
});
app.get('/movies/:movieName', (req, res) => {
    const movieName = req.params.movieName;
    const movieFile = './movies/' + movieName;

    screen(movieFile, res, req);
});

function screen(path, res, req, ban) {
    var stat = fs.statSync(path);
    var total = stat.size;
    if (req.headers['range']) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total - 1;
        var chunksize = (end - start) + 1;
        console.log('RANGE : ' + start + ' - ' + end + ' = ' + chunksize);

        var file = fs.createReadStream(path, {
            start: start,
            end: end
        });

        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        });

        console.log('ALL: ');
        file.on('open', () => file.pipe(res));
        console.log('ALL2: ');
        file.on('end', function() { // done
            console.log("fin");

        });
        file.on('error', (streamErr) => res.end('errr' + streamErr));
    } else {
        console.log('ALL: ' + total);
        res.writeHead(200, {
            'Content-Length': total,
            'Content-Type': 'video/mp4'
        });
        var file = fs.createReadStream(path);
        file.on('open', () => file.pipe(res));
        file.on('end', function() { // done
            console.log("fin");

        });
    }

}

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

var sha512f = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    console.log("sha512f salt: "+salt);
    console.log("sha512f pass: "+password);
    hash.update(password);
    var value = hash.digest('hex');
    console.log("sha512f value: "+value);
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    salt = genRandomString(16); /** Gives us salt of length 16 */
    passwordData = sha512f(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
}

/*var passwordMD5 = md5("awesome6");
console.log("awesome6: "+passwordMD5);
MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var myobj = { username: "sjcastro", password: passwordMD5};
      db.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 record inserted");
      db.close();
      });
  });*/

app.post('/config_json2',function(req,res){
  var params;
  nombre=req.body.username;
  console.log("User name = "+nombre);
  //res.send(nombre);
  passwordHash=req.body.password;
  var salt=req.body.salt;
  var bytes  = CryptoJS.AES.decrypt( salt.toString(), 'My Secret Passphrase');
  var saltDecAes = bytes.toString(CryptoJS.enc.Utf8);
  console.log('saldDecrypt AES: ', saltDecAes);
  console.log("User name = "+nombre+", password is "+passwordHash+", salt is "+saltDecAes);
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
       db.collection("users").find({username: nombre}).toArray(function(err, result) {
        if (err) throw err;
        resultDB = result; 
        resultStr = JSON.stringify(resultDB)
        console.log("dd: " +resultStr);
        resultStr = resultStr.replace('[','')
        resultStr = resultStr.replace(']','')
        console.log("frase2: "+ resultStr);
        finalPassDB = JSON.parse(resultStr); //password de la base
        console.log("PassDB: "+ finalPassDB.password);

        params = sha512f(finalPassDB.password, saltDecAes); 
        console.log("Param HashPassDB: "+ params.passwordHash);
        var compare = params.passwordHash.localeCompare(passwordHash);
        if(compare == 0){
            console.log("CORRECTO");
            res.redirect('/config_json');
        }
        else{
          console.log("inCORRECTO");
          //res.send("error: "+nombre);
          res.render('login_admin', {
                 msm: 'error',
                 band: 'true',
                 username: nombre
            });
          
        }
        
        db.close();
       });
  
}); 


  /*MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var myobj = { username: nombre, password: passwordHash};
      db.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 record inserted");
      db.close();
      });
  });*/
});

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});