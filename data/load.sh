#!/bin/sh
mongo prototype --eval 'db.imagetags.drop()'
mongo prototype --eval 'db.desttags.drop()'
mongo prototype --eval 'db.imagelocations.drop()'
mongoimport -d prototype -c imagetags --type csv --file imageTags.csv --headerline
mongoimport -d prototype -c desttags --type csv --file destTags2.csv --headerline
mongoimport -d prototype -c imagelocations --type csv --file imageLocations.csv --headerline
