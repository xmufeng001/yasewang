var cronJob = require('cron').CronJob;
var app_conf = require('./../app-conf');
var mock_client = require('./../mock_client');
var log = require('./../logger');
var fs = require('fs');
var request = require('request');
var querystring = require('querystring');
var loginCookie;
/*{ headers:
 { 'User-Agent': 'Million/100 (GT-I9100; GT-I9100; 4.0.3) samsung/GT-I9100/GT-I9100:4.0.3/IML74K/ZSLPG:user/release-keys',
 'Accept-Encoding': 'gzip, deflate',
 'Content-Length': '122',
 'Content-Type': 'application/x-www-form-urlencoded',
 Host: 'game1-CBT.ma.sdo.com:10001',
 Connection: 'Keep-Alive',
 Cookie: 'S=ne1qsk9tjvju2oheqgsvrh94j7',
 Cookie2: '$Version=1' },
 method: 'POST',
 url: 'http://game1-CBT.ma.sdo.com:10001/connect/app/battle/battle?cyt=1',
 proxy: 'http://localhost:8888',
 form:
 { lake_id: 'NzgOGTK08BvkZN5q8XvG6Q==',
 parts_id: 'NzgOGTK08BvkZN5q8XvG6Q==',
 user_id: 'pCnhxxWVAZFRsn/J2u50aA==' } }*/

//transport.transportProductClickLogByServerLocal('CN');
if (!loginCookie) {
    var form =
    { login_id: 'psem1RkBQBKZgIaV1nAMmQ==',
        password: 'RrgMF6cPe4WRztN4BsCK2Q==' };
    var requestObject = {
        headers: { 'User-Agent': 'Million/100 (GT-I9100; GT-I9100; 4.0.3) samsung/GT-I9100/GT-I9100:4.0.3/IML74K/ZSLPG:user/release-keys',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Length': '122',
            'Content-Type': 'application/x-www-form-urlencoded',
            Host: 'game1-CBT.ma.sdo.com:10001',
            Connection: 'Keep-Alive',
            Cookie: 'S=k2ubgkimhphmj0v90uts0bbfp3',
            Cookie2: '$Version=1' },
        method: 'POST',
        url:  'http://game1-CBT.ma.sdo.com:10001/connect/app/login?cyt=1',
        proxy: 'http://localhost:8888',
        body: querystring.stringify(form)


    };
    //request.post('http://service.com/upload').form({key:'value'})
//    request.post( 'http://game1-CBT.ma.sdo.com:10001/connect/app/battle/battle?cyt=1').form( { lake_id: 'NzgOGTK08BvkZN5q8XvG6Q==',
//        parts_id: 'NzgOGTK08BvkZN5q8XvG6Q==',
//        user_id: 'pCnhxxWVAZFRsn/J2u50aA==' });


    request.post({
        headers: { 'User-Agent': 'Million/100 (GT-I9100; GT-I9100; 4.0.3) samsung/GT-I9100/GT-I9100:4.0.3/IML74K/ZSLPG:user/release-keys',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/x-www-form-urlencoded' ,
            Cookie: 'S=ne1qsk9tjvju2oheqgsvrh94j7',
            Cookie2: '$Version=1'
        },
        uri: 'http://game1-CBT.ma.sdo.com:10001/connect/app/login?cyt=1',
        proxy: 'http://localhost:8888',
        body: querystring.stringify(form)}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
//                console.log(body);
//                console.log(body.length);
                loginCookie = response.Cookie;
                console.dir(response.headers['set-cookie']);
            } else {
                console.log('no new log now from ');
            }
        } else {
            log.error(error);
            console.error(error);

        }
    });
} else {
    console.log(loginCookie);
}
