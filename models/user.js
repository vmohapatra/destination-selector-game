var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	timestamp: {type: Date, default: Date.now},
});

module.exports = mongoose.model('User', userSchema);
