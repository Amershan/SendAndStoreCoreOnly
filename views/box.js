/**
 * Created by Arpad Budai on 2015. 06. 26..
 */

module.exports = {
    getBoxView: function (sortBy, boxDatas, callback) {
        var view = '<!DOCTYPE html>' +
        '<html lang="en">' +
            '<head>' +
            '<meta charset="UTF-8">' +
            '<script src="http://code.jquery.com/jquery-1.10.2.js"></script>' +
            '<script>' +
            'function sendDeleteReq(obj){   \n' +
            '   if (obj.checked) {' +
                    "$.ajax({\n" +
                        "url: 'http://localhost:8080/box?' + $.param({'id': obj.id}),\n" +
                        "type: 'DELETE',\n" +
                        "dataType: 'json',\n" +
                        "data:obj.id,\n" +
                        "success: function (data, textStatus, xhr) {\n" +
                            "    console.log(data);\n" +
            '               location.reload();                                ' +
                        "},\n" +
                         "error: function (xhr, textStatus, errorThrown) {\n" +
                            "    console.log('Error in Operation');\n" +
            "                    console.log(xhr, textStatus, errorThrown);\n       " +
                         "}\n" +
                    "});\n" +
            "   }else {" +
            "       return" +
            "   }" +
            '}\n' +
            '</script>' +
            '<script>' +
            'function sortBy() {' +
            'var selectedIndex=0; ' +
            'selectedIndex=document.forms["sort"].sortList.selectedIndex;' +
            'document.forms["sort"].sortList.selectedIndex=selectedIndex;' +
            'document.forms["sort"].submit() ;' +
            '}' +
             '</script>' +
            '<title>Send and Store</title>\n' +
        '</head>\n' +
        '<h1 align="center">Send And Store</h1>\n' +
         '<div></div>\n' +
          '<div id="error"></div>\n' +
            '<div id="inputFields" align="center">\n' +
            '<form action="/box" method="POST">\n' +
            'Id:<br>\n' +
            '<input type="text" name="id" placeholder="id" required ="true">\n' +
            '<br>\n' +
            'Created:<br>\n' +
            '<input type="text" name="createdAt" placeholder="06192015" required ="true">\n' +
            '<br>\n' +
            'Customer Name:<br>\n' +
            '<input type="text" name="customerName" placeholder="John Doe" required ="true">\n' +
            '<br>\n' +
            'Adress:<br>\n' +
            '<input type="text" name="address" placeholder="address" required ="true">\n' +
            '<br>\n' +
            'Items:<br>\n' +
            '<input type="text" name="items" placeholder="item1 / item2 / etc" required ="true">\n' +
            '<br><br>\n' +
            '<input type="submit" value="Submit">' +
            '</form><br>' +
            '</div>' +
            ' <div id="listData" align="center">\n' +
            '<form name="sort" method="GET"  action="/find">' +
            '<select name="sortList" onchange="sortBy()" id="sortList">' +
            '<option value="createdAt" name="createdAt" id="createdAt">Created Asc' +
            '<option value="-createdAt" name="createdAt" id="-createdAt">Created Desc' +
            '<option value="address" name="address" id="address">Address Asc' +
            '<option value="-address" name="address" id="-address">Address Desc' +
            '<option value="items" name="items" id="items">Weight Asc' +
            '<option value="-items" name="items" id="-items">Weight Desc' +
            '</select> ' +
            '</form>' +
            '<script>document.getElementById("sortList").value="' + sortBy + '"</script>' +
            '<table style="width:50%" align="center">\n' +
            '<tr>\n' +
            '<tr>\n' +
            '<td>Id<td>\n' +
            '<td>createdAt<td>\n' +
            '<td>Name<td>\n' +
            '<td>Address<td>\n' +
            '<td>Items<td>\n' +
            '<td>Delete<td>\n' +
            '</tr>\n';

        var tableView = '';
        for (var i in boxDatas) {
            tableView += '<tr>\n' +
            '<td>' + boxDatas[i].id +'<td>\n' +
            '<td>' + boxDatas[i].createdAt +'<td>\n' +
            '<td>' + boxDatas[i].customerName +'<td>\n' +
            '<td>' + boxDatas[i].address +'<td>\n' +
            '<td>' + boxDatas[i].items.toString() +'<td>\n' +
            '<td><input type="checkbox" name="checkbox" id="' + boxDatas[i].id +'" onclick="sendDeleteReq(this)">\n' +
            '</tr>\n';
        }
        view += tableView;
        view += '</table>\n</div>\n';
        callback(view);
    }
}