/**
 * New node file
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var clientUrl = "http://10.0.0.152:5564";


exports.checkSignup = function(msg,callback){
	var res = {};


	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user');

		coll.insert({first_name: msg.first_name, last_name:msg.last_name,email: msg.email, password:msg.password}, function(err, user){
			if (user) {

				res.code = "200";
					callback(null,res);

			} else {
				console.log("returned false");
				res.code = "401";
					callback(null,res);
			}
		});
	});
};



//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};

