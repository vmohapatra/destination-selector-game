var mongoose = require('mongoose');

var imageLocationsSchema = new mongoose.Schema({
	"image" : { type: String },
	"dest" : { type: String },
});

module.exports = mongoose.model('imageLocations', imageLocationsSchema);