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