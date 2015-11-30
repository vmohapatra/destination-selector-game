// Finds the old user associated with that unique ID (found via cookie),
// or logs a new user object in the database and sends a new cookie

var db = require('./db');
var uuid = require('node-uuid');

var auth = {};

auth.newgame = function (req, res, callback) {
    var game = new db.NewGame();
    if(game){
        game.userid = req.cookies.hmuser || uuid.v1();
        game.save(function (err) {
            if (err) {
                callback(err);
            }
            else {
                req.session.id = game._id;
                res.cookie('hmuser', game.userid, {maxAge: 3600000000000});
                callback(err, game);
            }
        });
    }
    else{
        callback(err, game);
    }
}

auth.session = function (req, res, callback) {
    db.NewGame.findOne({ _id: req.session.id })
        .sort('-timestamp')
        .exec(function (err, game) {
            if (err) {
                callback(err);
            }
            else {
                callback(err, game);
            }
        });         
}

module.exports = auth;
