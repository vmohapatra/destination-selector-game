var auth = require('./auth');
var backend = require('./backend');
var config = require('./config');
var db = require('./db');
var util = require('./util');

var express = require('express');


var app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: 'cdefaoeu4321htnsqwerty' }));

//Serve static content for the app from the “public” directory in the application directory:
app.use(express.static(__dirname + '/public'));
//Serve static content for the app from the “img” directory in the application directory:
app.use(express.static(__dirname + '/img'));

app.get('/', function (req, res) {
    auth.newgame(req, res, function (err, game) {
        if(game){
            res.sendfile(__dirname + '/public/main.html');
        }
        else{
            res.send(500, { error: 'Unable to create the game'});
        }
    });
});

// GET method for the AJAX entry-point
app.get('/live', function (req, res) {
    auth.session(req, res, function (err, game) {
        // console.log("/live GETBODY: " + JSON.stringify(req.query));
        // console.log(req.query);
        if(!err){
            if (req.query.resource === "IMAGES") {
                backend.images(game, req.query.num, function (err, images) {
                res.json({ images: images });
            });
            }
            else if (req.query.resource === "DESTS") {
                backend.dests(game,req.query.num, function (err, dests) {
                res.json({
                        dests: dests,
                        selectedImages: game.accepted.length,
                        optimumImages: config.optimum_img_selection,
                        postReqId: req.query.postId
                    });
                });
            }
        }
        else{
            res.send(500, { error: 'Unable to access the game'});
        }
    });
});

// POST method for the AJAX entry-point
app.post('/live', function (req, res) {
    auth.session(req, res, function (err, game) {
        // console.log("/live POSTBODY: " + JSON.stringify(req.body));
        if(!err){
            if (req.body.action === "ACCEPT") {
                game.accepted.addToSet(req.body.target);
            }
            else if (req.body.action === "UNACCEPT") {
                game.accepted = Array.diff(game.accepted, [req.body.target]);
            }
            // console.log("/live POST action: " + req.body.action);
            // console.log(JSON.stringify(game.accepted));
            game.save(function (err) {
                if (err){
                    res.send(500, { error: 'Unable to save the game!' });
                }
                else{
                        res.send(200);
                }
            });
        }
        else{
            res.send(500, { error: 'Unable to access the game'});
        }
    });
});

// HACK: wait 20ms to allow asynchronous calls in config.js to finish
setTimeout(function () {
    app.listen(config.http_port);
    console.log('Running application at ' + config.http_url);
}, 20);
