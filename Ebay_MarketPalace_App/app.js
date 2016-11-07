var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, mysql= require('./routes/mysql')
	, signup= require('./routes/signup')
	, profile=require('./routes/profile')
	, product=require('./routes/product')
	,getAllUser=require('./routes/getProduct')
	,session = require('express-session')
	,shopping_cart=require('./routes/shopping_cart')
	,user_log=require('./routes/user_log')
	,validation=require('./routes/validation')
	,viewProfile=require('./routes/viewProfile')
	,bid_log=require('./routes/bid_log')
	,passport= require('./routes/passport')
	,tryy=require('./routes/try')
	,order_history=require('./routes/order_history');
var CronJob = require('cron').CronJob;
var mysql=require('./routes/mysql');
var amqp = require('amqp')
	, util = require('util');
var connection = amqp.createConnection({host:'127.0.0.1'});





var login = require("./routes/login");

var myaction=require("./routes/myaction");

var app = express();

//all environments








//development only


//GET Requests
app.get('/', routes.index);
app.get('/homepage',routes.redirectToHomepage);
app.get('/signup',routes.signup);
app.get('/login',routes.login);
app.get('/profile', routes.profile);
app.get('/product',product.display);
app.get('/getProduct',routes.getUser);
app.get('/test',getAllUser.getUser);
//app.get('/profile',routes.profile);
app.get('/logout', routes.logout);
app.get('/showCart', routes.show_cart);
app.get('/getCart', shopping_cart.showCart);
app.get('creditcard',routes.getAction);
app.post('/checkout',shopping_cart.checkout);
app.get('/test1',routes.getlog);
app.get('/bid_log',routes.getbidlog);
app.get('/bid_log1',bid_log.getlog);
app.get('/test2',user_log.getlog);
app.get('/sell_history',routes.get_order_history);
app.get('/buy_history',routes.get_buy_history);
app.get('/buylist',order_history.buy_history);
app.get('/viewProfile',viewProfile.viewProfile);
app.get('/view_profile',routes.viewProfile);
app.get('/success',routes.success);
app.get('/try',routes.try);
app.get('/try1',tryy.gettry);
app.post('/k',shopping_cart.addToUsersCart);


//POST Requests
app.post('/validation',validation.getValid);
app.post('/checkSignup',signup.checkSignup);
app.post('/checkLogin', login.checkLogin);
app.post('/products',product.sell);
app.post('/setProfile',profile.setProfile);
//app.post('/logout', login.logout);
app.post('/addcart',shopping_cart.addcart);
app.post('/bidcart',shopping_cart.bidcart);
app.post('/removeCart',shopping_cart.remove_item);
app.get('/order',order_history.post_order_history);
// Cron job definition WINSTON , SIMPLE LOGGER
// var job = new CronJob('10 * * * * *', function () {
// 	console.log("cron job running");
//
// 	var query_one = 'Select * from advertisement where item_post_date <= NOW() - INTERVAL 2 MINUTE and bid_value="true";';
// 	mysql.cron_mysql(function (err, rows) {
// 		if(err){
// 			console.log(err);
// 		}else {
// 			if(rows.length == 0){
// 				console.log("null value returned");
// 				// connection.end();
// 			}else {
// 				console.log(rows[0]);
// 				for(i in rows){
// 					var quantity = rows[i].item_quantity;
// 					console.log("Quantity "+quantity);
// 					var query_two = "select * from bid_db where item_id = " + rows[i].item_id+" order by bid_price DESC;";
// 					mysql.cron_mysql((function (element_quantity, element_row) {
// 						console.log("Current State");
// 						return function (err, cron_bid) {
// 							if(err) console.log(err);
// 							else {
// 								//console.log("biddata"+JSON.stringify(cron_bid));
// 								if(cron_bid.length === 0){
// 									console.log("biddata length 0");
// 									var query_delete = "delete from advertisement where item_id =" + element_row.item_id;
// 									mysql.cron_mysql(function (err, results) {
//
// 									}, query_delete);
// 								}
//
// 								for(var j in cron_bid){
// 									if(cron_bid[j].item_quantity <= element_quantity){
// 										console.log("Bid section");
//
// 										var item_id = element_row.item_id;
// 										var item_name = element_row.item_name;
// 										var item_description = element_row.item_description;
// 										var seller_name = element_row.seller_name;
// 										var quantity = parseInt(cron_bid[j].item_quantity);
// 										var item_price = parseFloat(cron_bid[j].bid_price);
// 										var email = null;
// 										var user_id = cron_bid[j].user_id;
//
// 										var query_three = "insert into order_history set item_id="+ item_id +", item_name='"+ item_name + "', item_description='" +
// 											item_description + "', seller_name='"+ seller_name + "', quantity="+ quantity + ", item_price="+ item_price +", email="+
// 											"null, user_id="+ user_id + ";";
// 										mysql.cron_mysql(function (err, data) {
// 											if(err) throw err;
// 											var query_four = "delete from bid_db where item_id=" + element_row.item_id + ";";
// 											mysql.cron_mysql(function (err, data) {
// 												if(err) throw err;
// 												var query_five = "Delete from advertisement where item_id=" + element_row.item_id+ ";";
// 												mysql.cron_mysql(function (err, data) {
// 													if(err) throw err;
// 													console.log("Bid Completed");
// 												}, query_five);
// 											}, query_four);
// 										}, query_three);
// 										element_quantity = element_quantity - cron_bid[j].item_quantity;
// 									}
// 								}
//
// 							}
// 						}
//
// 					})(quantity, rows[i]), query_two);
// 				}
// 			}
// 		}
// 	}, query_one);
//
// }, null, true, 'America/Los_Angeles');
connection.on('ready', function(){
	console.log("listening on login_queue,profile_queue,shop_queue,cart_queue,valid_queue, userprofile_queue, viewprofile_queue");
	connection.queue('userprofile_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

			switch(message.type)
			{
				case 'editprofile':
					profile.setProfile(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
			}
		})
	});
	connection.queue('shop_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

			switch(message.type)
			{
				case 'shop':
					shopping_cart.addcart(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
			}
		})
	});
	connection.queue('cart_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

			switch(message.type)
			{
				case 'cart':
					shopping_cart.showCart(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
				case 'removecart':
					shopping_cart.remove_item(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
			}
		})
	});
	connection.queue('valid_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

			switch(message.type)
			{
				case 'card':
					validation.getValid(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

			}
		})
	});
	connection.queue('viewprofile_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

			switch(message.type)
			{
				case 'profile':
					viewProfile.viewProfile(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

			}
		})
	});
	connection.queue('profile_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

			switch(message.type)
			{
				case 'Profile':
					getAllUser.getUser(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
				case 'product':
					product.sell(message, function(err,res){
						if(err){
							console.log("Product error");
						}else{
							//return index sent
							connection.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						}
					});
					break;
				case 'sell':
					order_history.post_order_history(message, function(err,res){
						if(err){
							console.log("ad error");
						}else{
							//return index sent
							connection.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						}
					});
					break;
			}
		})
	});
	connection.queue('login_queue', function(q) {
		q.subscribe(function (message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			switch (message.type) {
				case 'signup':
					passport.signup(message, function (err, res) {
						if (err) {
							console.log("Sign up error");
						}
						else {
							connection.publish(m.replyTo, res, {
								contentType: 'application/json',
								contentEncoding: 'utf-8',
								correlationId: m.correlationId
							});
						}
					});
					break;
				case 'login':
					passport.login(message, function(err,res){
						if(err){
							console.log("Sign in error");
						}else{
							//return index sent
							connection.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						}
					});
					break;
				case 'buy':
					order_history.buy_history(message, function(err,res){
						if(err){
							console.log("Buy error");
						}else{
							//return index sent
							connection.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						}
					});
					break;
			}
		})
	})

})