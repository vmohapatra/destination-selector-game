// Configures the database

var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.db_url);

module.exports = {
    User: require('./models/user'),
    Game: require('./models/game'),
    ImageTag: require('./models/imageTag'),
    DestTag: require('./models/destTag'),
    ImageLocations: require('./models/imageLocations'),
    NewGame: require('./models/newGame')
};
