var request = require('request');
var moment = require('moment');
var log = require('./logger');
var http_content_util=require('./http_content_util');
var app_conf = require('./app-conf');
var querystring = require('querystring');

//http://game1-CBT.ma.sdo.com:10001/connect/app/exploration/explore?cyt=1
//http://game1-CBT.ma.sdo.com:10001/connect/app/mainmenu?cyt=1

exports.login = function(request_content_text,callback) {


    var headers=http_content_util.getHeaders(request_content_text);
    delete headers['Content-Length'];
    var postDate=http_content_util.getPostDate(request_content_text);
    var host=headers["Host"] ;
    var uri =http_content_util.getUri(request_content_text);
    var method= http_content_util.getMethod(request_content_text);
//    var  requestObject=
//    {
//        headers: headers,
//        method:method,
//        url: "http://"+host+uri,
//        proxy: "http://"+app_conf["proxyAddress"] +":" + app_conf["proxyPort"],
//        form:postDate
//
//    };
//
    // 'Content-Length': '81',
    request.post({
        headers: headers,
        uri: "http://"+host+uri,
        proxy: "http://"+app_conf["proxyAddress"] +":" + app_conf["proxyPort"],
        body: querystring.stringify(postDate)}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
//                console.log(body);
//                console.log(body.length);
              //  loginCookie = response.Cookie;
                console.dir(response.headers['set-cookie']);
                var cookieString=response.headers['set-cookie'].toString();
                cookieString=cookieString.substr(0,cookieString.lastIndexOf(";"))
                console.dir(cookieString);

            } else {
                console.log('no new log now from ');
            }
        } else {
            log.error(error);
            console.error(error);

        }
    });


//    return requestObject

//    request(request_object, function (error, response, body) {
//        if (!error && response.statusCode == 200) {
//            if (body) {
//                console.log(body);
//                console.log(body.length);
//            } else {
//                console.log('no new log now from ');
//
//            }
//        } else {
//            log.error(error);
//            console.error(error);
//
//        }
//    });

//    request({uri:serverLocal.url+'?fromTime='+lastId+"&serverLocal="+serverLocal.name}, function (error, response, body) {
//        if (!error && response.statusCode == 200) {
//            if(body){
//
//            } else{
//                log.info('no new log now from %s,',serverLocal.name);
//                console.log('no new log now from %s,',serverLocal.name);
//
//            }
//        } else{
//            log.error(error);
//            console.error(error);
//
//        }
//    })
}



//getLastAnProductLogByServerLocal("CN");
