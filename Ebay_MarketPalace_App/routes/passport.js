

//var passport = require('passport');
//var localStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";

exports.login=function(msg,callback){
    var res = {};

                    mongo.connect(mongoURL, function() {
                        var loginCollection = mongo.collection('user');
                        loginCollection.findOne({email : msg.username}, function(err, rows) {

                            if(err){ console.log("error in login");
                                //return done(err);
                                callback(null,err);
                            }
                            else if(rows.length == 0) {console.log("rows = 0");
                                //return done(null, false);
                                callback(null,false);}
                            else if(!bcrypt.compareSync(msg.password, rows.password)) {
                                console.log("password didnt match");
                                //return done(null, false);
                                callback(null,false);
                            }
                            //mongo.close();
                            console.log(rows.email);
                            //return done(null, rows);
                            callback(null,rows);
                        });
                });
            };

exports.signup=function(msg,callback){
    var res = {};

    mongo.connect(mongoURL, function () {
                var loginCollection = mongo.collection('user');

                loginCollection.findOne({email: msg.email}, function (err, rows) {
                    if (err) callback(null,err);
                    if (rows){
                        console.log("Existing User")
                        //return done(null, false);
                        callback(null,false);
                    }
                    else {

                        var pass = bcrypt.hashSync(msg.password, bcrypt.genSaltSync(8), null)
                        console.log(pass);
                        var data =
                        {
                            first_name: msg.data.first_name,
                            last_name: msg.data.last_name,
                            email: msg.email,
                            password: pass
                        };

                        loginCollection.insertOne(data, function (err, rows) {
                            if (err) console.error("Error!!!!" + err);
                          //  mongo.close();
                           // return done(null, data);
                            callback(null,data);
                        });
                    }
                });
            });
        };

