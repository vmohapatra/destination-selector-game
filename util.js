// Return random images before implementing actual images

var config = require('./config');

var util = {};

util.nRandomElements = function (arr, n) {
    return Array.shuffle(arr).slice(0,n);
};

Array.shuffle = function (o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

Array.diff = function (a, b) {
    return a.filter(function (elem) { return b.indexOf(elem) == -1; });
};

Object.filter = function (obj, pred){
    var result = {};
    for (var key in obj){
        if (obj.hasOwnProperty(key) && pred(obj[key])){
            result[key] = obj[key];
        }
    }
    return result;
};

module.exports = util
