var ejs=require('ejs');
var mysql= require('./mysql');
var passwordHash = require("password-hash");
var session = require('express-session');
var object_id="lo_id";
var description="Logged on";
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

exports.checkLogin = function(msg,callback){

	var res = {};


	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user');


		coll.findOne({email: msg.email, password:msg.password}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.

				// req.session.email = user.last_name;
				// req.session.first_name = user.first_name;
				// req.session.last_name = user.last_name;
				// req.session.user_id = user._id;
				// req.session.devanjal = user.last_login;
				//console.log(req.session.username + " is the session");
				coll.update({_id:mongo.ObjectId(user._id)},
					{
						$set:{last_login: new Date().toLocaleString()}
					}

				);
				res.code = "200";
				res.email=user.email;
				res.first_name=user.first_name;
				res.last_name=user.last_name;
				res.user_id=user.user_id;
				res.devanjal=user.last_login;
				callback(null,res);

			} else {
				console.log("returned false");
				res.code = "401";
				callback(null,res);
			}
		});
	});
};

exports.logout=function (req, res) {
	req.session.destroy();
	res.send("logout success!");
};