var http_content_util=require('./http_content_util');
var app_conf = require('./app-conf');
var fs = require('fs');
var getUserIds=function(){
    var result=http_content_util.getAllFiles("C:/Users/Wind/Desktop/R8");
    result.forEach(function(file) {
        var content = fs.readFileSync(file, "utf8");
        console.log("\""+http_content_util.getPostDate(content)["user_id"]+"\",");
    });
}

var delRepeat=function(){
    var userIds=app_conf["lv4_userIds"];
    var newUserIds=[];
    userIds.forEach(function(userId) {
         if(newUserIds.indexOf(userId)==-1){
             newUserIds.push(userId);
         }
    });
    console.log(newUserIds);
}
delRepeat();