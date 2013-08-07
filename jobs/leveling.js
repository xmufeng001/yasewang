var cronJob = require('cron').CronJob;
var app_conf = require('./../app-conf');
var mock_client = require('./../mock_client');
var http_content_util=require('./../http_content_util');
var log = require('./../logger');
var fs = require('fs');
var request = require('request');
var async = require('async')
var moment  = require('moment');
var querystring = require('querystring');

//var loginCookie;
//var job = new cronJob({
//    cronTime: '00,10,20,30,40,50 * * * * *',
//    onTick: function () {
//        if (!loginCookie) {
//            console.log("not login,then login first");
//            var content = fs.readFileSync("./../login_request/login_Request.txt", "utf8");
//            var requestObject = mock_client.getRequest(content)
//            request(requestObject, function (error, response, body) {
//                if (!error && response.statusCode == 200) {
//                    if (body) {
//                        console.log(body);
//                        console.log(body.length);
//                        loginCookie=response.Cookie;
//                    } else {
//                        console.log('no new log now from ');
//                    }
//                } else {
//                    log.error(error);
//                    console.error(error);
//
//                }
//            });
//        }else{
//            console.log(loginCookie);
//        }
//
//    },
//    start: false
//});
//job.start();
//log.info('marketing analyser is start, cronTime is: %s', '00,15,30,45 * * * * *');
//console.log('marketing analyser is start, cronTime is: %s', '00,15,30,45 * * * * *');

//transport.transportProductClickLogByServerLocal('CN');

async.waterfall([
    function(callback){
        login(callback);
    },
//    function(cookieString,callback){
//        changeBattleCards(cookieString,callback);
//    },
    function(cookieString, callback){

        var lv4_userIds =app_conf["lv4_userIds"];
        var lv4_userIds_length=lv4_userIds.length;
        var i=0;

        var job = new cronJob({
            cronTime: '00,20,40 * * * * *',
            onTick: function () {
                async.waterfall([
                    function(callback){
                        getUserInfo(callback);
                    } ,
                    function(status,callback){
                        var ap=status["AP"];
                        var bc=status["BC"];
                        i++;
                        console.log("time:["+i+"]is begin,bc:"+bc+",ap:"+ap);
                        var lastAPUpdate = moment(status["lastAPUpdate"], "YYYY-MM-DD HH:mm:ss");
                        var lastBCUpdate = moment(status["lastBCUpdate"], "YYYY-MM-DD HH:mm:ss") ;

                        if(ap>2||moment().add('minutes', -15).isAfter(lastAPUpdate)){
                            goMap(cookieString);
                        }
                        if(bc>5||moment().add('minutes', -15).isAfter(lastBCUpdate)){
                            var randomIndex=Math.floor(Math.random()*lv4_userIds_length);
                            //console.log(randomIndex);
                            var userId=lv4_userIds[randomIndex] ;
                            battleLv4User(cookieString,userId);
                        }


                    }],
                    function (err, result) {
                        console.error(error);
                    })


            },
            start: false
        });
        job.start();
        log.info('marketing analyser is started, cronTime is: %s', '00,30 * * * * *');
    }
], function (err, result) {
    console.error(error);
});

var login=function(callback){
    var request_content_text = fs.readFileSync("./../login_request/login_Request.txt", "utf8");
    var headers=http_content_util.getHeaders(request_content_text);
    delete headers['Content-Length'];
    var postDate=http_content_util.getPostDate(request_content_text);
    var host=headers["Host"] ;
    var uri =http_content_util.getUri(request_content_text);
    var method= http_content_util.getMethod(request_content_text);
    var requestObject={
        headers: headers,
        uri: "http://"+host+uri,
        body: querystring.stringify(postDate)
    };
    if(app_conf["proxy"]){
        requestObject["proxy"]="http://"+app_conf["proxyAddress"] +":" + app_conf["proxyPort"]
    }
    request.post(requestObject, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                console.dir(response.headers['set-cookie']);
                var cookieString=response.headers['set-cookie'].toString();
                cookieString=cookieString.substr(0,cookieString.lastIndexOf(";"))
                console.dir(cookieString);
                callback(null,cookieString);
            } else {
                throw new Error(' response.statusCode:'+ response.statusCode);
            }
        } else {
            log.error(error);
            console.error(error);

        }
    });
}

var changeBattleCards=function(callback,cookieString){
    var request_content_text = fs.readFileSync("./../change_card_request/nvpu.txt", "utf8");
    var headers=http_content_util.getHeaders(request_content_text);
    delete headers['Content-Length'];
    headers["Cookie"]=cookieString;
    var postDate=http_content_util.getPostDate(request_content_text);
    var host=headers["Host"] ;
    var uri =http_content_util.getUri(request_content_text);
    var method= http_content_util.getMethod(request_content_text);
    var requestObject={
        headers: headers,
        uri: "http://"+host+uri,
        body: querystring.stringify(postDate)

    };
    if(app_conf["proxy"]){
        requestObject["proxy"]="http://"+app_conf["proxyAddress"] +":" + app_conf["proxyPort"]
    }
    request.post(requestObject, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                console.log("changge card success");
                callback(null,cookieString);
            } else {
                throw new Error(' response.statusCode:'+ response.statusCode);
            }
        } else {
            log.error(error);
            console.error(error);

        }
    });
}
var getUserInfo=function(callback){
    var request_content_text = fs.readFileSync("./../ma_assistant/get_user_info_request.txt", "utf8");
    var headers=http_content_util.getHeaders(request_content_text);
    delete headers['Content-Length'];
    var postDate=http_content_util.getPostDate(request_content_text);
    var host=headers["Host"] ;
    var uri =http_content_util.getUri(request_content_text);
    var method= http_content_util.getMethod(request_content_text);
    var requestObject={
        headers: headers,
        uri: "http://"+host+uri,
        body: querystring.stringify(postDate)
    };
    if(app_conf["proxy"]){
        requestObject["proxy"]="http://"+app_conf["proxyAddress"] +":" + app_conf["proxyPort"]
    }

    request.post(requestObject, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                var result=JSON.parse(body.toString());
                console.log(body);
                callback(null,result["data"]);
            } else {
                throw new Error(' response.statusCode:'+ response.statusCode);
            }
        } else {
            log.error(error);
            console.error(error);
            var status = {"AP":9999,"BC":9999,"lastAPUpdate":moment().format("YYYY-MM-DD HH:mm:ss"),"lastBCUpdate":moment().format("YYYY-MM-DD HH:mm:ss")}
            callback(null,status);

        }
    });
}
var battleLv4User=function(cookieString,user_id){
    var headers={ 'User-Agent': 'Million/100 (GT-I9100; GT-I9100; 4.0.3) samsung/GT-I9100/GT-I9100:4.0.3/IML74K/ZSLPG:user/release-keys',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: 'game1-CBT.ma.sdo.com:10001',
        Connection: 'Keep-Alive',
        Cookie2: '$Version=1' };
    headers["Cookie"]=cookieString;
    var postDate={ lake_id: 'NzgOGTK08BvkZN5q8XvG6Q==',
        parts_id: 'NzgOGTK08BvkZN5q8XvG6Q==' };
    postDate["user_id"] =user_id;       //set battle user_id
    var host='game1-CBT.ma.sdo.com:10001' ;
    var uri ='/connect/app/battle/battle?cyt=1';
    var method= 'POST';
    var requestObject={
        headers: headers,
        uri: "http://"+host+uri,
        body: querystring.stringify(postDate)
    };
    if(app_conf["proxy"]){
        requestObject["proxy"]="http://"+app_conf["proxyAddress"] +":" + app_conf["proxyPort"]
    }
    request.post(requestObject, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                var battle_result;
                if(body.length=1082){
                    battle_result="cold down"
                }
                if(body.length<2000){
                    battle_result="not ready"
                }
                else if(body.length>=2000){
                    battle_result="success"
                }
                console.log(" vs to ["+user_id+"],response.body.length:"+body.length+", the battle's result is "+battle_result);
            } else {
                throw new Error(' response.statusCode:'+ response.statusCode);
            }
        } else {
            log.error(error);
            console.error(error);
        }
    });
}

var goMap=function(cookieString){
    var request_content_text = fs.readFileSync("./../map_request/thursday/1.txt", "utf8");
    var headers=http_content_util.getHeaders(request_content_text);
    delete headers['Content-Length'];
    headers["Cookie"]=cookieString;
    var postDate=http_content_util.getPostDate(request_content_text);
    var host=headers["Host"] ;
    var uri =http_content_util.getUri(request_content_text);
    var method= http_content_util.getMethod(request_content_text);
    var requestObject={
        headers: headers,
        uri: "http://"+host+uri,
        body: querystring.stringify(postDate)
    };
    if(app_conf["proxy"]){
        requestObject["proxy"]="http://"+app_conf["proxyAddress"] +":" + app_conf["proxyPort"]
    }
    request.post(requestObject, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                var map_result;
                if(body.length>90000){
                    map_result="get a card"
                }else if(body.length==2000){
                    map_result="not ap"
                }
                else if(body.length>=2000){
                    map_result="success"
                }
                console.log(" response.body.length:"+body.length+", the map's result is "+map_result);
            } else {
                throw new Error(' response.statusCode:'+ response.statusCode);
            }
        } else {
            log.error(error);
            console.error(error);

        }
    });
}