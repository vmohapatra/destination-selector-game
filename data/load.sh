#!/bin/sh
#http://stackoverflow.com/questions/6753330/specify-which-database-to-use-in-mongodb-js-script
#mongo <name of db> --eval "db.runCommand( <js in here> );"
mongo prototype --eval 'db.imagetags.drop()'
mongo prototype --eval 'db.desttags.drop()'
mongo prototype --eval 'db.imagelocations.drop()'
mongoimport -d prototype -c imagetags --type csv --file imageTags.csv --headerline
mongoimport -d prototype -c desttags --type csv --file destTags2.csv --headerline
mongoimport -d prototype -c imagelocations --type csv --file imageLocations.csv --headerline
