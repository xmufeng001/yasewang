var fs = require('fs');
exports.getAllFiles = function(root) {
    var result = [], files = fs.readdirSync(root) ;
    files.forEach(function(file) {
        var pathname = root+ "/" + file
            , stat = fs.lstatSync(pathname)
        if (stat === undefined) return

        // 不是文件夹就是文件
        if (!stat.isDirectory()) {
            result.push(pathname)
            // 递归自身
        } else {
            result = result.concat(getAllFiles(pathname))
        }
    });
    return result;
}

exports.getPostDate= function(request_content_text){
   var content_array= request_content_text.split("\r\n") ;
   var post_text=content_array[content_array.length-1];
   var keyValueText=post_text.split("&");
   var post_data={};
   keyValueText.forEach(function(keyValueText) {
        var key_value_array=keyValueText.split("=");
        var key=key_value_array[0];
        var value=decodeURIComponent(key_value_array[1]).replace("\n","").replace("\r","");
        post_data[key]= value;
   });
   return post_data;
}
//POST /connect/app/login?cyt=1 HTTP/1.1
exports.getUri=function(request_content_text){
    var content_array= request_content_text.split("\r\n") ;
    var text=content_array[0];
    var text_array=text.split(" ");
    return text_array[1];
}
exports.getMethod =function(request_content_text){
    var content_array= request_content_text.split("\r\n") ;
    var text=content_array[0];
    var text_array=text.split(" ");
    return text_array[0];
}
//User-Agent: Million/100 (GT-I9100; GT-I9100; 4.0.3) samsung/GT-I9100/GT-I9100:4.0.3/IML74K/ZSLPG:user/release-keys
//Accept-Encoding: gzip, deflate
//Content-Length: 159
//Content-Type: application/x-www-form-urlencoded
//Host: game1-CBT.ma.sdo.com:10001
//Connection: Keep-Alive
//Cookie: S=ar7sedqkq2um15skddhoeshur6
//Cookie2: $Version=1
exports.getHeaders=function(request_content_text){
    var content_array= request_content_text.split("\r\n") ;
    content_array.pop();
    content_array.shift();
    var headers={};
    content_array.forEach(function(keyValueText) {
        var key_value_array=keyValueText.split(":");
        var key=key_value_array[0];
        var value=keyValueText.replace(key+":","").trim();
        if(""!=key){
            headers[key]= value;
        }
    });
     return headers;
}

exports.updateCookie=function(headers,new_cookie_value){
    headers.Cookie=new_cookie_value;
    return headers;
}

//var result1=getAllFiles("C:/Users/Wind/Desktop/r2/4");
//result1.forEach(function(file) {
//    var content = fs.readFileSync(file, "utf8");
//    console.log("\""+getPostDate(content)["user_id"]+"\",");
////   var content= fs.readFileSync(file) ;
////    console.log(content);
//});
//console.dir(result1);
