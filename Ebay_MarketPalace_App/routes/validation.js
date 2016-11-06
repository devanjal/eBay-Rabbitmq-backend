var mysql=require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
exports.getValid=function(msg,callback){
	var res = {};
	mongo.connect(mongoURL, function () {
		console.log('Connected to mongo at: ' + mongoURL);
		var ad = mongo.collection('advertisement');
		var coll = mongo.collection('shopping_cart');
		var db = mongo.collection('order_history');
		coll.find({"user_id":msg.user_id}).toArray(function(err, items) {
				//	console.log(items);
				if(items.length > 0){
					console.log(msg.user_id);
					for(var i = 0; i<items.length; i++){
						console.log("afsdgmvmdf;sdf,xcb;/sd,xc"+items[i].item_quantity)
						//	console.log("afsdg"+items)
						var item_quantity =items[i].item_quantity;
						var ad_id=items[i].item_id;
						ad.find({_id:mongo.ObjectId(ad_id)}).toArray(function(err,result){

								if(result){
									console.log(result);
									var x=result[0].item_quantity;
									var total= x-item_quantity;
									ad.update({_id:mongo.ObjectId(ad_id)},
										{
											$set:{item_quantity:total}
										}

									)
									console.log("fhsajklndfnasdlkgznvasldnzxvlasdlxvzn    Total = "+total);
									ad.remove({item_quantity:0}, function (err,result) {
										if(!err){
											console.log(result)
										}
										else{}

									})
								}
							}
						)
					}

					coll.find({user_id: msg.user_id}).forEach(function (doc) {
						db.insert(doc);
					});
					coll.remove({user_id: msg.user_id}, function (err, result) {
						if (err) {
						}
						else {
						}
					});

				}
			}
		)
	});
	var res={"statuscode":200};
	callback(null,res);
}


