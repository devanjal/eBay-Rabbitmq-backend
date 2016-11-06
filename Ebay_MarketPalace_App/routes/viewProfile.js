var mysql= require('./mysql')
var ejs=require('ejs');
var session = require('express-session');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
exports.viewProfile=function(msg,callback){

    var res = {};


    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('user_profile');


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