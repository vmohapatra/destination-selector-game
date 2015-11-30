var db = require('./db');

var stream = db[process.argv[2]].find().stream();

stream.on('data', function (doc) {
    var norm = 0;
    for (var key in doc.toObject()) {
        if (key != '_id' && key != '__v' && key != 'image' && key != 'dest' && key != 'RegionName' && key != 'Reviews' && key != 'Hotels' && key != 'INSPIRE_RELAXING' && key != 'INSPIRE_SIGHTSEEING') {  
            norm += Math.pow(doc[key], 2);
        }
        console.log(key + ' ' + norm);
    }
    norm = Math.sqrt(norm);
    for (var key in doc.toObject()) {
        if (key != '_id' && key != '__v' && key != 'image' && key != 'dest' && key != 'RegionName' && key != 'Reviews' && key != 'Hotels' && key != 'INSPIRE_RELAXING' && key != 'INSPIRE_SIGHTSEEING') {  
            var newval = doc[key] / norm;
            console.log('new: ' + newval + ', old: ' + doc[key]);
            doc[key] = newval;
        }
    }
    var dot = 0;
    for (var key in doc.toObject()) {
        if (key != '_id' && key != '__v' && key != 'image' && key != 'dest' && key != 'RegionName' && key != 'Reviews' && key != 'Hotels' && key != 'INSPIRE_RELAXING' && key != 'INSPIRE_SIGHTSEEING') {  
            dot += doc[key] * doc[key];
        }
    }
    console.log('dot: ' + dot);

    doc.save(function (err) {
        if (err) console.log(err);
    });
}).on('close', function() {
    process.exit();
});
