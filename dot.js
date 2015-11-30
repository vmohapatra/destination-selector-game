var db = require('./db');

dot = function(image1,image2){
    var result = 0;
    for (var key in image1){
        if (key in image2) result += image1[key]*image2[key];
    }
    return result;
}

rankList = function(obj){
    var ranked = [];
    for(var key in obj){
        ranked.push([key, obj[key]]);
    }
    ranked.sort(function(a,b){return a[1]-b[1]}).reverse();
    return ranked.slice(0,10);
}

if (process.argv.length == 4) {
    var arg1 = process.argv[2];
    var arg2 = process.argv[3];
} else {
    var arg1 = process.argv[2];
    var arg2 = arg1;
}

db.ImageTag.findOne({ image: arg1 })
.exec(function (err, image1) {
    db.ImageTag.findOne({ image: arg2 })
    .exec(function (err, image2) {
        if (image1 && image2) {
            image1 = image1.toObject();
            image2 = image2.toObject();
            var image1sum = 0;
            var image2sum = 0;

            var results = {}
            var dotval = 0;
            for (var key in image1){
                if (key in image2) {
                    if (key != '_id' && key != 'image' && key != '__v') {
                        results[key] = image1[key] * image2[key];
                        dotval += image1[key] * image2[key];
                        image1sum += image1[key];
                        image2sum += image2[key];
                    }
                }
            }
            var rank = rankList(results);
            
            console.log('Image1 sum: ' + image1sum);
            console.log('Image2 sum: ' + image2sum);
            console.log('Dot product: ' + dotval);
            console.log('Contributions:');
            for (var i = 0; i < rank.length; ++i) {
                console.log(rank[i][1].toFixed(8) + ' from ' + rank[i][0] + ' (' + ((rank[i][1]/dotval) * 100).toFixed(2) + '%)');
            }
        } else {
            if (!image1) console.log("image1 not found");
            if (!image2) console.log("image2 not found");
        }
        process.exit()
    });
});
