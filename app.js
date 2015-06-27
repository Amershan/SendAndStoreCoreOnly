/**
 * Created by Arpad Budai on 2015. 06. 26..
 */

var http = require('http');
var path = require('path');
var appPath = path.dirname(require.main.filename);
var url = require('url');
var box = require(path.join(appPath, "views", "box.js"));
var error = require(path.join(appPath, "views", "error.js"));
var manipulateBoxData = require(path.join(appPath, "accessories", "manipulateBoxData.js"));
var sortObj = {};

var server = http.createServer(function(req, res) {
  //Parse post request
  var parsePost =  function (req, callback) {
      var qs = require('querystring');
      var data = '';

      req.on('data', function(chunk) {
          data += chunk;
      });
      req.on('end', function() {
          data = qs.parse(data);
          callback(data);
      });
    };

    var url_parts = url.parse(req.url, true);
    switch(url_parts.pathname) {
        case '/':
        case '/index.html':
            res.statusCode = 302;
            res.setHeader('Location', '/box');
            res.end();
            break;

        case '/box':

            switch(req.method) {
                case "POST":
                    parsePost(req, function (data) {
                        manipulateBoxData.addBoxDatas(data, function(err) {
                            if (!!err) {
                                 error.getErrorView(err, function (errView) {
                                     res.write(errView);
                                     return res.end();
                                 })
                            }
                            res.statusCode = 302;
                            res.setHeader('Location', '/box');
                            res.end();
                        })
                    });
                    break;

                case "DELETE":
                    //only accept number for ids
                    var id = parseInt(url_parts.query.id);
                    if (!isNaN(id)){
                        manipulateBoxData.deleteBoxDatas([id], function(err){
                            //requires JSON reply
                            if(!!err) {
                                res.write({
                                    Success:false,
                                    Error: err
                                });
                                return res.end();
                            }
                            res.write(JSON.stringify({Success:true}));
                            return res.end();
                        })
                    } else {

                        res.write({
                            Success:false,
                            Error: 'NaN'
                        });
                    }
                    break;

                default :
                    //get the box list with default/selected sorting
                    if (!sortObj.sortBy) {
                        sortObj = {
                            sortBy: 'address',
                            order: ''
                        }
                    }
                    //save the ordering
                    if(!!sortObj.order){
                        var sortBy = sortObj.order + sortObj.sortBy;
                    } else {
                        var sortBy = sortObj.sortBy;
                    }
                    manipulateBoxData.sortBoxdatas(sortObj, function (err, sortedList) {
                        if (!!err) {
                            error.getErrorView(err, function (errView) {
                                res.write(errView);
                                return res.end();
                            })
                        }
                        //get the default / last set sorting view
                        box.getBoxView(sortBy, sortedList, function (boxView) {
                            res.write(boxView);
                            return res.end();
                        })
                    });
                    break;
            }
            break;

        case '/find':
            //set the selected sorting
            if (url_parts.query.sortList.indexOf('-') > -1) {
                sortObj.order = '-';
                sortObj.sortBy = url_parts.query.sortList.substring(url_parts.query.sortList.indexOf('-')+1);
            } else {
                sortObj.sortBy = url_parts.query.sortList;
                sortObj.order = '';
            }
            //set default sorting if the user enters the link directly
            if (!sortObj.sortBy) {
                console.log("no sorting set");
                sortObj = {
                    sortBy: 'createdAt',
                    order: ''
                }
            }
            //save the selected ordering
            if(!!sortObj.order){
                var sortBy = sortObj.order + sortObj.sortBy;
            } else {
                var sortBy = sortObj.sortBy;
            }

            manipulateBoxData.sortBoxdatas(sortObj, function (err, sortedList) {
                if (!!err) {
                    error.getErrorView(err, function (errView) {
                        res.write(errView);
                        return res.end();
                    })
                }
                //get the sorted list view
                box.getBoxView(sortBy, sortedList, function (boxView) {
                    res.write(boxView);
                    return res.end();
                })
            });
            break;

        default:
            var err = 'Error 404 page not found!';
            error.getErrorView(err, function (errView) {
                res.statusCode = 404;
                res.write(errView);
                return res.end();
            })

    }

});
server.listen(8080, 'localhost');