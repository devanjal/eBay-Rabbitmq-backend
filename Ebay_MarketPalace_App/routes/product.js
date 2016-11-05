var mysql= require('./mysql')
var ejs=require('ejs');
var object_id="sp_id";
var description="Posting of Products";
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
exports.sell =function(msg,callback){
	var res = {};
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('advertisement');

		coll.insert({user_id: msg.user_id,
			item_price:msg.item_price,
			item_description:msg.item_description,
			item_name:msg.item_name,
			item_quantity:msg.item_quantity,
			ship_location:msg.ship_location,
			bid_value:msg.bid_value,
			seller_name:msg.seller_name}, function(err, user){
			if (user) {
				res.code = "200";
				callback(null,res);

			} else {
				console.log("returned false");
				res.code = "401";
				callback(null,res);
			}
		});
		var ad=mongo.collection('ad_post');
		ad.insert({user_id:msg.user_id, item_name:msg.item_name,item_price:msg.item_price,
			item_quantity:msg.item_quantity},function(err,user){
				if(err){
					throw err;
				}
				else{
					console.log("success ad_post insertion");
				}
		})
	});
};

	//
// 	function(req,res){
// 	var item_price
// 	var json_responses;
//
// 	mongo.connect(mongoURL, function(){
// 		console.log('Connected to mongo at: ' + mongoURL);
// 		var coll = mongo.collection('advertisement');
//
// 		coll.insert({user_id: req.session.user_id,
// 				item_price:req.param('cost'),
// 			item_description:req.param('description'),
// 			item_name:req.param('product_name'),
// 			item_quantity:req.param('quantity'),
// 			ship_location:req.param('ship_location'),
// 			bid_value:req.param('bid_value'),
// 			seller_name:req.session.first_name+" "+req.session.last_name,
// 			//item_price:req.params('cost'),
// 					}, function(err, user){
// 			if (user) {
// 				// This way subsequent requests will know the user is logged in.
// 				// req.session.username = user.username;
// 				//console.log(req.session.username +" is the session");
// 				json_responses = {"statusCode" : 200};
// 				res.send(json_responses);
//
// 			} else {
// 				console.log("returned false");
// 				json_responses = {"statusCode" : 401};
// 				res.send(json_responses);
// 			}
// 		});
// 	});
// };

exports.sell1=function(req,res){
	var insert_items='insert into advertisement(seller_id,item_price,item_description,item_name,item_quantity,ship_location,bid_value,seller_name) ' +
		'values("'+req.session.user_id+'","'+req.body.cost+'","'+req.body.description+'","'+req.body.product_name+'","'+req.body.quantity+'","'+req.body.ship_location+'",' +
		'"'+req.body.bid_value+'","'+req.session.first_name+' '+req.session.last_name+'")';
//var insert_items='SELECT * FROM item'
	var log_sql='insert into user_log(timestamp, user_id, object_id,description) values(now(),"'+req.session.user_id+'","'+object_id+'","'+description+'")';

	mysql.fetchData(log_sql,function(err,result){
		if(err){
			console.log("Log Error"+err);
		}else{

		}
	});
	console.log(insert_items);
mysql.fetchData(insert_items,function(err,result){
	if(err){
		console.log(err);
		var json_res={"statuscode":401}
		res.send(json_res)
	}
	else{
		console.log(result);
		var json_res={"statuscode":200}
		res.send(json_res)

}});
}
exports.display=function(req,res){
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
console.log(""+req.session.first_name);
	if(req.session) {
		var name= "checks";
		var last_name=req.session.last_name;
		var first_name=req.session.first_name;
		//var last_login=req.session.devanjal;
		var last_login=req.session.devanjal
;		console.log("Last Login"+last_login);
		res.render('product', {titl: name, fname:first_name, lname:last_name, last:last_login });
	}
	else{
		console.log("Not in session");
		res.redirect("/login")
	}
};
