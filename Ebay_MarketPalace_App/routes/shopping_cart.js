var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";



exports.addcart =function(msg,callback){
    var res = {};
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('shopping_cart');

        coll.insert({user_id: msg.user_id,
            item_id:msg.item_id,
            item_price:msg.item_price,
            item_description:msg.item_description,
            item_name:msg.item_name,
            item_quantity:msg.item_quantity,
            ship_location:msg.ship_location,
            //bid_value:msg.bid_value,
            seller_name:msg.seller_name,
            item_post_date:msg.item_post_date}, function(err, user){
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
// function (req, res) {
//
//     mongo.connect(mongoURL, function(){
//         console.log('Connected to mongo at: ' + mongoURL);
//         var coll = mongo.collection('shopping_cart');
//         //console.log(req.session.shop_id);
//
//
//         coll.insert({
//             user_id: user_id,
//             item_price: item_price,
//             item_description: item_description,
//             item_name: item_name,
//             item_quantity: item_quantity,
//             ship_location: ship_location,
//             seller_name: seller_name,
//             item_id: item_id
//         }, function (err, user) {
//             if (user) {
//
//                 json_responses = {"statusCode": 200};
//                 res.redirect("/product")
//
//             } else {
//                 console.log("returned false");
//                 json_responses = {"statusCode": 401};
//                 res.send(json_responses);
//             }
//         });
//
//     });
// };

exports.addToUsersCart = function(req,res){
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('user');

        coll.findOne({email: req.session.email}, function(err, user){
            if (user) {
                var item_id = req.body.item_id;
                var item_quantity = parseInt(req.body.quantity)+1;
                var item_name = req.body.item_name;
                var item_description = req.body.item_description;
                var seller_name = req.body.seller_name;
                var ship_location = req.body.ship_location;
                var item_price = req.body.item_price;

                var item={
                    item_price:item_price,
                    item_description:item_description,
                    item_name:item_name,
                    item_quantity:item_quantity,
                    ship_location:ship_location,
                    seller_name:seller_name,
                    item_id:item_id,
                    //item_price:req.params('cost'),
                }

                console.log(user);
                user.shopping_cart = [];
                user.shopping_cart.push(item);
                console.log(user);
                //console.log(user.shopping_cart);
                json_responses = {"statusCode" : 200};
                res.send(json_responses);

            } else {
                console.log("returned false");
                json_responses = {"statusCode" : 401};
                res.send(json_responses);
            }
        });
    });
};

exports.addcart1 = function (req, res) {

    // console.log(req.body);

    var user_id = req.session.user_id;
    var item_id = req.body.item_id;
    var item_quantity = parseInt(req.body.quantity)+1;

    var insert_query = "insert into shopping_cart(user_id,item_id, item_quantit) values ("+ user_id+", "+item_id+", "+item_quantity+");";
    mysql.fetchData(insert_query, function (err, rows) {
        var json_response;
        if(err){
            console.log(err);
            throw err;
        }else{
            if(rows){
                var object_id="ac_id";
                var description="Add To Cart";
                var log_sql='insert into user_log(timestamp, user_id, object_id,description) values(now(),"'+req.session.user_id+'","'+object_id+'","'+description+'")';

                mysql.fetchData(log_sql,function(err,result){
                    if(err){
                        console.log("Log Error"+err);
                    }else{

                    }
                });
                // res.render('shopping_cart' );
                res.redirect("/showcart")
            }else{
                json_response = {"statusCode" : 401};
                res.send(json_response);
            }
        }
    });
};
exports.bidcart = function (req, res) {

    var user_id = req.session.user_id;
    var item_id = req.body.item_id;
    var item_quantity = parseInt(req.body.quantity)+1;
    var item_name = req.body.item_name;
    var item_description = req.body.item_description;
    var seller_name = req.body.seller_name;
    var ship_location = req.body.ship_location;
    var base_price = req.body.item_price;
    var bid_price= req.body.bid_price;
    var total=parseInt(bid_price)+parseInt(base_price);
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('bid');


        coll.insert({
            item_id:item_id,
            user_id: user_id,
            item_price: total,
            item_description: item_description,
            item_name: item_name,
            item_quantity: item_quantity,
            ship_location: ship_location,
            seller_name: seller_name
        }, function (err, user) {
            if (user) {

                json_responses = {"statusCode": 200};
                res.redirect("/product")

            } else {
                console.log("returned false");
                json_responses = {"statusCode": 401};
                res.send(json_responses);
            }
        });

    });
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll1 = mongo.collection('advertisement');
        coll1.update({_id:mongo.ObjectId(item_id)},
            {
                $set:{item_price: total}
            }

        );
    });

};
exports.bidcart1 = function (req, res) {

    var user_id = req.session.user_id;
    var item_id = req.body.item_id;
    var item_quantity = parseInt(req.body.quantity)+1;
    var bid_price= req.body.bid_price;
    var base_price=req.body.item_price;
    var total=parseInt(bid_price)+parseInt(base_price);

    var insert_query = "insert into bid_db(item_id, user_id, bid_price, item_quantity) values ("+ item_id +", "+user_id+", " +
        total + ", " + item_quantity + ") on duplicate key update item_quantity = "+item_quantity+", bid_price = "+ total +";";
    var update_shope ='update advertisement set item_price ="'+total+'" where item_id="'+item_id+'"';
    var bid_log='insert into bid_log values(now(),"'+item_id+'","'+req.session.user_id+'","'+total+'")';
    mysql.fetchData(insert_query, function (err, rows) {
        var json_response;
        if(err){
            console.log("insertion error");
            throw err;
        }else{
            if(rows){

                //res.render('shopping_cart');
                res.redirect("/showcart")
            }else{
                json_response = {"statusCode" : 401};
                res.send(json_response);
            }
        }
    });
    mysql.fetchData(update_shope,function (err,result) {
        if(err){

        }else {console.log("successful")}

    });
    mysql.fetchData(bid_log,function (err,result) {
        if(err){

        }
        else{
            console.log("success ")
        }

    })
};

exports.showCartm = function (req, res) {
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('user');

        coll.findOne({email: req.session.email}, function(err, user){
            var des = user.shopping_cart.toArray(function(err, items) {
                console.log(items);
                if(items.length > 0){
                    console.log(items);
                    var obj = new Object();
                    var total = 0;


                    for(var i = 0; i<items.length; i++){
                        total = total + (items[i].item_price * items[i].item_quantity);
                    }
                    obj.items = items;

                    obj.sum = total;
                    var sum=obj.sum;
                    console.log(total)
                    //   res.send(obj);
                }else {
                    console.log("nullaaaaaaaaa");
                    var obj=new Object();
                    var total=0;
                    obj.sum=total;
                    // response.send()
                }
                var json_response={items:items, sum:total}
                res.send(json_response);


            });
        })
    })};

exports.showCart = function(msg,callback){
    var res = {};
    mongo.connect(mongoURL, function() {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('shopping_cart');
       // console.log({user_id:req.session.user_id});
        var des = coll.find({user_id:msg.user_id}).toArray(function(err, items) {
            console.log(items);
            if(items.length > 0){
                console.log(items);
                var obj = new Object();
                var total = 0;
                for(var i = 0; i<items.length; i++){
                    total = total + (items[i].item_price * items[i].item_quantity);
                }
                obj.items = items;
                obj.sum = total;
                var sum=obj.sum;
                console.log(total)
                callback(null,items)
                //   res.send(obj);
            }else {
                console.log("nullaaaaaaaaa");
                var obj=new Object();
                var total=0;
                obj.sum=total;
                // response.send()
                callback(null,items)
            }
          //  var json_response={items:items, sum:total}



        });
    })
};
exports.showCart1 = function (req, res) {
    var select_query =  "select * from shopping_cart INNER JOIN advertisement ON shopping_cart.item_id = advertisement.item_id INNER JOIN user" +
        " ON shopping_cart.user_id = user.user_id WHERE advertisement.item_quantity >= shopping_cart.item_quantit";


    mysql.fetchData(select_query,function (err, rows) {

        if(err){
            console.log(err);
            throw err;
        }else{
            var object_id="gc_id";
            var description="Show Cart";
            var log_sql='insert into user_log(timestamp, user_id, object_id,description) values(now(),"'+req.session.user_id+'","'+object_id+'","'+description+'")';

            mysql.fetchData(log_sql,function(err,result){
                if(err){
                    console.log("Log Error"+err);
                }else{

                }
            });
            if(rows.length > 0){
                console.log(rows);
                var obj = new Object();
                var total = 0;


                for(var i = 0; i<rows.length; i++){
                    total = total + (rows[i].item_price * rows[i].item_quantit);
                }
                obj.items = rows;

                obj.sum = total;
                res.send(obj);
            }else {
                console.log("null");
                var obj=new Object();
                var total=0;
                obj.sum=total;
                response.send()
            }
        }
    })
};

exports.remove_item = function(msg,callback){
    var res = {};
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('shopping_cart');

        coll.insert({user_id: msg.user_id,
            item_id:msg.item_id,
            item_price:msg.item_price,
            item_description:msg.item_description,
            item_name:msg.item_name,
            item_quantity:msg.item_quantity,
            ship_location:msg.ship_location,
            //bid_value:msg.bid_value,
            seller_name:msg.seller_name,
            item_post_date:msg.item_post_date}, function(err, user){
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
// function (req, res) {
//
//
//     mongo.connect(mongoURL, function(){
//         console.log('Connected to mongo at: ' + mongoURL);
//         var coll = mongo.collection('shopping_cart');
//
//         coll.remove({_id:mongo.ObjectId(msg)}, function(err, result){
//
//             if (result) {
//
//                 json_responses = {"statusCode" : 200};
//                 res.send(json_responses);
//                 console.log("AFadsfnlfdsknkndskndksc")
//
//             } else {
//                 console.log("returned false");
//                 json_responses = {"statusCode" : 401};
//                 res.send(json_responses);
//             }
//         });
//     });
//
    // var delete_query = "delete from shopping_cart where item_id="+item_id+";";
    //
    // mysql.fetchData(delete_query, function (err, result) {
    //     if(err){
    //         console.log("error in delete Query");
    //         throw err;
    //     }
    //     mysql.fetchData("select * from advertisement INNER JOIN shopping_cart ON advertisement.item_id = shopping_cart.item_id INNER JOIN " +
    //         "user ON shopping_cart.user_id = user.user_id where advertisement.item_quantity >= shopping_cart.item_quantit;",
    //         function (err, rows) {
    //             if(err){
    //                 console.log("error in shopping_cart remove query");
    //                 throw err;
    //             } else {
    //                 console.log(rows);
    //                 //Log page
    //                 var object_id="ac_id";
    //                 var description="Add To Cart"
    //                 var log_sql='insert into user_log(timestamp, user_id, object_id,description) values(now(),"'+req.session.user_id+'","'+object_id+'","'+description+'")';
    //
    //                 mysql.fetchData(log_sql,function(err,result){
    //                     if(err){
    //                         console.log(err);
    //                     }else{
    //
    //                     }
    //                 });
    //                 var obj = new Object();
    //                 obj.cartData = rows;
    //
    //                 var total = 0;
    //                 for(var i=0; i<rows.length; i++){
    //                     total = total + rows[i].itemPrice * rows[i].quantity;
    //                 }
    //                 obj.cartTotal = total;
    //                 res.send(obj);
    //             }
    //         });
    // });

// };

exports.remove_item1 = function (req, res) {
    var ms = require('mysql');
    var item_id = req.body.item_id;
    var delete_query = "delete from shopping_cart where item_id="+item_id+";";

    mysql.fetchData(delete_query, function (err, result) {
        if(err){
            console.log("error in delete Query");
            throw err;
        }
        mysql.fetchData("select * from advertisement INNER JOIN shopping_cart ON advertisement.item_id = shopping_cart.item_id INNER JOIN " +
            "user ON shopping_cart.user_id = user.user_id where advertisement.item_quantity >= shopping_cart.item_quantit;",
            function (err, rows) {
                if(err){
                    console.log("error in shopping_cart remove query");
                    throw err;
                } else {
                    console.log(rows);
                    //Log page
                    var object_id="ac_id";
                    var description="Add To Cart"
                    var log_sql='insert into user_log(timestamp, user_id, object_id,description) values(now(),"'+req.session.user_id+'","'+object_id+'","'+description+'")';

                    mysql.fetchData(log_sql,function(err,result){
                        if(err){
                            console.log(err);
                        }else{

                        }
                    });
                    var obj = new Object();
                    obj.cartData = rows;

                    var total = 0;
                    for(var i=0; i<rows.length; i++){
                        total = total + rows[i].itemPrice * rows[i].quantity;
                    }
                    obj.cartTotal = total;
                    res.send(obj);
                }
            });
    });

};
exports.checkout = function(req,res)
{
    res.render('form', { title: 'Credit Card validation'});
}