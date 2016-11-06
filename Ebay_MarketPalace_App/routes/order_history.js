var mysql= require('./mysql')
var ejs=require('ejs');
var session = require('express-session');
var object_id="vp_id";
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var ObjectID = require('mongodb').ObjectID;
exports.post_order_history=function(msg,callback){

    var res = {};


    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('ad_post');


        coll.find({user_id:msg.user_id}).toArray(function(err, user){
            if (user) {


                res.code = "200";
                res.user=user;
                callback(null,res);

            } else {
                console.log("returned false");
                res.code = "401";
                callback(null,res);
            }
        });
    });

}
exports.buy_history=function(msg,callback){

    var res = {};


    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('order_history');


        coll.find({user_id:msg.user_id}).toArray(function(err, user){
            if (user) {


                res.code = "200";
                res.user=user;
                callback(null,res);

            } else {
                console.log("returned false");
                res.code = "401";
                callback(null,res);
            }
        });
    });

}