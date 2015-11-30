var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
	user: mongoose.Schema.ObjectId,
	timestamp: { type: Date, default: Date.now },
	accepted: {type: [String], default: []},
	seen: {type: [String], default: []}
});

module.exports = mongoose.model('Game', gameSchema);
