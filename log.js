// Parses the environment and port; sets defaults if not provided
// Also makes a list of images from the file of all images

var log = {};

log.simple = function (req, res, next) {
    console.log(req.method + ' ' + req.url);
    next();
}

module.exports = log
