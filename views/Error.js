/**
 * Created by Arpad Budai on 2015. 06. 27..
 */
module.exports = {
   getErrorView: function(err, callback) {
       var errorView = '<html><br>Error: ' + err + '<br>' +
       '<a href="/box">Go back</a>' +
       '</body></html>';

       callback(errorView);
   }
}

