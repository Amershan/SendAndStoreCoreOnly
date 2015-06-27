/**
 * Created by Arpad Budai on 2015. 06. 26..
 */

module.exports = {
    sort: function (attribute, order) {
        var result = {};
        var sortOrder = 1;

        if(order === "-") {
            sortOrder = -1;
        }
        return function (a,b) {
            if (attribute === 'items') {
                result = (a[attribute].length < b[attribute].length) ? -1 : (a[attribute].length > b[attribute].length) ? 1 : 0;
            } else if (attribute === 'createdAt'){
                var aDay = a[attribute].slice(0,3);
                var aMonth = a[attribute].slice(3,5);
                var aYear = a[attribute].substring(5);

                var bDay = b[attribute].slice(0,3);
                var bMonth = b[attribute].slice(3,5);
                var bYear = b[attribute].substring(5);

                var aTime =  aDay + '/' + aMonth + '/' + aYear;
                var bTime =  bDay + '/' + bMonth + '/' + bYear;

                result = (new Date(aTime) < new Date(bTime)) ? -1 : new Date(aTime) > new Date(bTime) ? 1 : 0;
            } else {
                result = (a[attribute] < b[attribute]) ? -1 : (a[attribute] > b[attribute]) ? 1 : 0;
            }
            return result * sortOrder;
        }
    }
}