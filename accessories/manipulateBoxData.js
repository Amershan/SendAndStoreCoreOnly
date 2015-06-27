/**
 * Created by Arpad Budai on 2015. 06. 26..
 */

var path = require('path');
var appPath = path.dirname(require.main.filename);
var fs = require('fs');
var shortObj = require(path.join(appPath, "accessories", "shortObj.js"));

module.exports =   {
    getBoxDatas: function (callback){
        console.log("getBox");
        var boxObjects =  [];

        fs.readFile(path.join(appPath, 'resources', 'boxes.csv'), function(err, data) {
            if (!!err){
              return callback(err, null);
            }
            var boxDatas = data.toString().split("\n");

            for (var i in boxDatas) {
                //get data from current line
                var boxData = boxDatas[i].replace("\r", "").split(",");
               if (boxData.length > 1) {
                   var boxObject = {
                       id: boxData[0],
                       createdAt: boxData[1],
                       customerName: boxData[2],
                       address: boxData[3],
                       items: boxData[4].split("/")
                   }
                   boxObjects.push(boxObject);
               }
            }
            return callback(null, boxObjects);
        });
    },

    deleteBoxDatas: function (boxIds, callback) {
        this.getBoxDatas(function (err, boxDatas) {
            if (!!err) {
                return callbak(err);
            }
            var newBoxData = boxDatas.filter(function(item){
                // delete the items
                return (boxIds.indexOf(parseInt(item.id)) < 0);
                })

            var itemsStrings = [];

            if (newBoxData.length > 0) {
                for (var i in newBoxData) {
                    var line = '';
                    line += newBoxData[i].id + ','
                        + newBoxData[i].createdAt + ','
                        + newBoxData[i].customerName + ','
                        + newBoxData[i].address + ','
                        + newBoxData[i].items.toString().replace(",", "/");
                    itemsStrings.push(line);
                }
                //write changes to file (simulate database)
                var file = fs.createWriteStream(path.join(appPath, 'resources', 'boxes.csv'));
                file.on('error', function(err) {
                    if (!!err){
                        return callback(err);
                    }
                });
                itemsStrings.map(function(v) {
                   file.write(v + '\n');
                });
                file.end();
                return callback(null, newBoxData);
            } else {
                return callback(null, newBoxData);
            }
        })
    },

    addBoxDatas: function (boxObj, callback) {
        var reg = /^\d+$/;
        var data = '\n';
        var error = '';

        if (!boxObj.id || !boxObj.createdAt || !boxObj.customerName || !boxObj.address || !boxObj.items) {
            error = 'Missing data, cannot save order!';
            return callback(error);
        }
        //check if the given fields are number
        if(reg.test(boxObj.id) && reg.test(boxObj.createdAt)){

            data += boxObj.id + ', '
                + boxObj.createdAt + ', '
                + boxObj.customerName + ', '
                + boxObj.address + ', '
                + boxObj.items;
            //create new entry in the file
            fs.appendFile(path.join(appPath, 'resources', 'boxes.csv'), data, function (err) {
                if (!!err) {
                    return callback(err);
                }
                return callback();
            });
        } else {
            error = 'Wrong data type, cannot save order!';
            return callback(error);
        }


    },

    sortBoxdatas: function (sortingParamObj, callback) {
        var shortattrib = sortingParamObj.sortBy;
        this.getBoxDatas(function (err, boxDatas) {
            if (!!err) {
                callback(err, null);
            }

           var shortedList =  boxDatas.sort(shortObj.sort(shortattrib, sortingParamObj.order));

            callback(null, shortedList)
        })
    }
}