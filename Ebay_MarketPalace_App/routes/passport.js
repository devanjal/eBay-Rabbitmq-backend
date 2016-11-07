var bcrypt = require('bcryptjs');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";

exports.login=function(msg,callback){
    var res = {};

                    mongo.connect(mongoURL, function() {
                        var loginCollection = mongo.collection('user');
                        loginCollection.findOne({email : msg.username}, function(err, results) {

                            if(err){ console.log("Login Error!!!");

                                callback(null,err);
                            }
                            else if(results.length == 0) {console.log("rows = 0");

                                callback(null,false);}
                            else if(!bcrypt.compareSync(msg.password, results.password)) {
                                console.log("password Incorrect");

                                callback(null,false);
                            }

                            console.log(results.email);

                            callback(null,results);
                        });
                });
            };

exports.signup=function(msg,callback){
    var res = {};

    mongo.connect(mongoURL, function () {
                var loginCollection = mongo.collection('user');

                loginCollection.findOne({email: msg.email}, function (err, results) {
                    if (err) callback(null,err);
                    if (results){
                        console.log("Existing User")
                        callback(null,false);
                    }
                    else {

                        var encryption = bcrypt.hashSync(msg.password, bcrypt.genSaltSync(8), null);
                        console.log(encryption);
                        var user =
                        {
                            first_name: msg.data.first_name,
                            last_name: msg.data.last_name,
                            email: msg.email,
                            password: encryption
                        };

                        loginCollection.insertOne(user, function (err, rows) {
                            if (err) console.error("Error!!!!" + err);
                            callback(null,user);
                        });
                    }
                });
            });
        };

