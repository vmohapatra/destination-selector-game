var config = require('./config');
var db = require('./db');
var util = require('./util')

var cheerio = require('cheerio');
var request = require('request');

var backend = {};

// Starting Images:
// TODO move this to the database or a config file

var testimages = [ '/images/0_60003055.jpg', '/images/0_57577311.jpg', '/images/0_59767132.jpg', '/images/0_57452674.jpg', '/images/0_57577323.jpg', '/images/0_74072.jpg', '/images/0_1802R-136709.jpg', '/images/0_56807774.jpg', '/images/0_62735161.jpg', '/images/0_56402771.jpg', '/images/0_56810422.jpg', '/images/0_602058.jpg' ];

// list 1 = beach-like images
var list1 = [ '/images/0_60003055.jpg', '/images/0_57577311.jpg', '/images/0_59767132.jpg', '/images/0_55844951.jpg', '/images/0_55844928.jpg', '/images/0_74075720.jpg', '/images/0_71809011.jpg', '/images/0_200346317-001.jpg', '/images/0_medwt1022.jpg', '/images/0_113555190.jpg', '/images/0_10192450.jpg', '/images/0_10166429.jpg', '/images/0_157140397_5.jpg', '/images/0_1828R-24062.jpg', '/images/0_1525R-109358.jpg', '/images/0_14957539.jpg' ];

// list '/images/2 = mountain-like images
var list2 = [ '/images/0_57452674.jpg', '/images/0_57577323.jpg', '/images/0_74072.jpg', '/images/0_73867900.jpg', '/images/0_200465984-001.jpg', '/images/0_42-23811825.jpg', '/images/0_814728.jpg', '/images/0_NA004492.jpg', '/images/0_ITL0094B.jpg', '/images/0_dv1454023.jpg', '/images/0_E007764.jpg', '/images/0_SAL055.jpg', '/images/0_RVA0029B.jpg', '/images/0_ASP0059B.jpg', '/images/0_107641667.jpg', '/images/0_109408322.jpg', '/images/0_16327.jpg', '/images/0_19861111.jpg', '/images/0_143993928.jpg', '/images/0_14489795.jpg' ];

// list '/images/3 = historic cultural images
var list3 = [ '/images/0_1802R-136709.jpg', '/images/0_56807774.jpg', '/images/0_62735161.jpg', '/images/0_55845393.jpg', '/images/0_56807790.jpg', '/images/0_71446345.jpg', '/images/0_71809257.jpg', '/images/0_71809318.jpg', '/images/0_200553483-001.jpg', '/images/0_200567875-001.jpg', '/images/0_dv1581010.jpg', '/images/0_dv1715224.jpg', '/images/0_RL002211.jpg', '/images/0_AA024237.jpg', '/images/0_113049.jpg', '/images/0_112027.jpg', '/images/0_112037.jpg', '/images/0_1598R-9988843.jpg', '/images/0_139289624.jpg', '/images/0_150844444.jpg', '/images/0_1436R-440325.jpg', '/images/0_146629417.jpg', '/images/0_144477717.jpg' ];

// list '/images/4 = modern city-like images
var list4 = [ '/images/0_56402771.jpg', '/images/0_56810422.jpg', '/images/0_602058.jpg', '/images/0_81535903.jpg', '/images/0_74214726.jpg', '/images/0_55843957.jpg', '/images/0_200508417-001.jpg', '/images/0_22711284.jpg', '/images/0_200235921-001.jpg', '/images/0_200380607-001.jpg', '/images/1_85740415.jpg', '/images/0_AA024250.jpg', '/images/0_AA019766.jpg', '/images/0_B1YJMJ.jpg', '/images/0_124259250_4.jpg', '/images/0_122642468.jpg', '/images/0_122450038.jpg', '/images/0_120006307.jpg', '/images/0_102171382.jpg', '/images/0_107597459.jpg', '/images/0_157560239.jpg', '/images/0_17290.jpg', '/images/0_135271716.jpg' ];

var startimages = (config.test == 1 ?  testimages : list1.concat(list2.concat(list3.concat(list4))));

rankList = function(obj, num){
    var ranked = [];
    for(var key in obj){
        ranked.push([key, obj[key]]);
    }
    ranked.sort(function(a,b){return a[1]-b[1]}).reverse();
    return ranked.slice(0,num);
}

amalgamateTags = function (images, callback) {
    var vector = {};
    var count = 0;
    db.ImageTag.find().lean()
    .where('image').in(images)
    .stream()
    .on('data', function (doc) {
        for (key in doc) {
            if (key != '_id' && key != '__v' && key != 'image') {
                if (vector[key] == undefined) {
                    vector[key] = 0;
                }
                vector[key] += doc[key];
            }
        }
        count += 1;
    })
    .on('close', function (err) {
        for (key in vector) {
            vector[key] = vector[key] / count;
        }
        callback(err, vector);
    })
    .on('error', function(err) {
        callback(err);
    });
}
    
backend.images = function (game, num, callback) {
    // Constant for power in probability-selection
    var EXPONENT = 4;

    
    if (game.accepted.length == 0 && game.seen.length == 0) {
        var images = util.nRandomElements(startimages, num);
        game.seen = game.seen.concat(images);
        game.save(function (err) {
            if (err) {
                callback(err);
            }
            else {
                callback(err, images);
            }
        });
    }

    else if (game.accepted.length == 0) {
        unseen = Array.diff(config.images, game.seen);
        var images = util.nRandomElements(unseen, num);
        game.seen = game.seen.concat(images);
        game.save(function (err) {
            if (err) {
                callback(err);
            }
            else {
                callback(err, images);
            }
        });
    }

    else {
        amalgamateTags(game.accepted, function (err, target) {
            var dots = {};
            var cumulative = 0;
            db.ImageTag.find().lean()
            .where('image').nin(game.seen)
            .stream()
            .on('data', function (doc) {
                dots[doc.image] = 0;
                for (key in doc) {
                    if (key != '_id' && key != '__v' && key != 'image') {
                        //dots[doc.image] += doc[key] * target[key];
                        dots[doc.image] += Math.pow(doc[key] * target[key], EXPONENT);
                    }
                }
                //dots[doc.image] = Math.pow(dots[doc.image], EXPONENT);
                cumulative += dots[doc.image];
            })
            .on('close', function () {
                var images = [];
                for (var i=0; i < num; ++i) {
                    var p = Math.random() * cumulative;
                    var c = 0;
                    for (key in dots) {
                        c += dots[key];
                        if (c > p && images.indexOf(key) == -1) {
                            images.push(key);
                            break;
                        }
                    }
                }
                
                game.seen = game.seen.concat(images);
                game.save(function (err) {
                    if (err){ 
                        callback(err);
                    }
                    else{
                        callback(err, images);
                    }
                });
            })
            .on('error', function(err) {
                callback(err);
            });
        });
    }
}

function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return a.value - b.value; });
    //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
    return arr; // returns array
}

backend.dests = function (game, num, callback) {
    if (game.accepted.length == 0) {
        callback(undefined);
    } 
    else {
        amalgamateTags(game.accepted, function (err, target) {
            var dots = {};
            var productDestImgMatrix = [];
            db.DestTag.find().where('Hotels').gte(config.num_hotels).where('Reviews').gte(config.num_reviews)
            .lean().stream()
            .on('data', function (doc) {
                dots[doc.dest] = 0;
                for (key in doc) {
                    if (key != '_id' && key != '__v' && key != 'dest' && key != 'Hotels' && key != 'Reviews') {
                        dots[doc.dest] += doc[key] * target[key];
                        productDestImgMatrix.push({destName: doc.dest, tagName: key, destImgProduct: doc[key] * target[key]});
                        //key is tag name
                        //doc = dest name and tag
                        //target = image loc and tag
                        //dots = dest name and sum(dest tag * image tag)
                    }
                }
            })
            .on('close', function () {
                var dests = [];
                db.ImageLocations.find().lean()
                .where('image').in(game.accepted)
                .where('dest').ne('')
                .stream()
                .on('data', function (doc) {
                    var imgTagTemp = {};
                    //comment this line to disable actual match destinationa
                    //dests.push({ name: doc.dest, type: 'ACTUAL', displayTags: "N/A" });
                })
                .on('close', function () {
                    if (dests.length > 3) {
                        dests = Array.shuffle(dests).slice(0,3);
                    }
                    
                    var ranks = rankList(dots);
                    //for (var i=0; i < 6 - dests.length; ++i) {
                    for (var i=0; i < config.num_dests; ++i) {    
                        var rankedTags = [];
                        for(var dame in productDestImgMatrix)
                            {
                                if(ranks[i][0]== productDestImgMatrix[dame].destName) {
                                    rankedTags[productDestImgMatrix[dame].tagName]=productDestImgMatrix[dame].destImgProduct;
                                }
                            }
                        rankedTags= sortObject(rankedTags);
                        rankedTags.reverse();                        

                        var tagCount = 0;
                        var tagsDisplayed = '';
                        for(tagCount=0;tagCount< config.num_tags;tagCount++)
                        {
                            if(tagCount==0){
                                tagsDisplayed = config.userFriendly[rankedTags[tagCount].key];
                            }
                            else {
                                tagsDisplayed += ', '+ config.userFriendly[rankedTags[tagCount].key];
                            }
                        }

                        //Add display tags only for guessed images
                        dests.push({ name: ranks[i][0], type: 'GUESS', displayTags: tagsDisplayed});

                    }

                    for (var j=0; j < dests.length; ++j) {
                        var url = 'http://en.wikivoyage.org/wiki/'
                        + dests[j].name.replace(/,.*/, '').replace(/ /g, '_');
                        dests[j].url = url;
                        (function (dest) { 
                            request(url, function (err, res, body) {
                                $ = cheerio.load(body);
                                var text = $('#mw-content-text > p');
                                if(text && text != undefined)
                                {
                                text = text.first().text().match( /[^\.!\?]+[\.!\?]+/g );
                                }
                                else {
                                text = null;
                                }
                                dest.info = ' ';                                
                                if (text && text!=null && text[0]) {
                                    var idx = 0;
                                    while ((text[idx]) && (dest.info.length + text[idx].length < 275)) {
                                        dest.info += (' ' + text[idx]);
                                        idx += 1;
                                    }
                                    
                                }
                            
                            });
                        })(dests[j]);
                    }
                    // HACK: wait a second until the above async-loop is done.
                    setTimeout( function () {
                            callback(err, dests);
                    }, 1000);
                })
                .on('error', function(err){
                                callback(err)
                });
            })
            .on('error', function(err) {
                           callback(err)
            });
        });
    }
}

module.exports = backend;
