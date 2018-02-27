// Configures the database

var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.db_url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:' + config.db_url));
db.once('open', function() {
  // we're connected!
  console.log('Connected successfully to :' + config.db_url);
});

module.exports = {
    User: require('./models/user'),
    Game: require('./models/game'),
    ImageTag: require('./models/imageTag'),
    DestTag: require('./models/destTag'),
    ImageLocations: require('./models/imageLocations'),
    NewGame: require('./models/newGame')
};
