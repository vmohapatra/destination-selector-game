var mongoose = require('mongoose');

var newGameSchema = new mongoose.Schema({
	userid: {type: String},
	timestamp: { type: Date, default: Date.now },
	accepted: {type: [String], default: []},
	seen: {type: [String], default: []}
});

module.exports = mongoose.model('NewGame', newGameSchema);


