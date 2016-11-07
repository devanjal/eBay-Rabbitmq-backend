var ejs=require('ejs');
var mysql= require('./mysql');
var passwordHash = require("password-hash");
var session = require('express-session');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

exports.setProfile=function(msg,callback){

    var res = {};


    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('user_profile');
        var str1= msg.birthday
        var regexp1 = /^\d{2}[./-]\d{2}[./-]\d{4}$/;
        var result1 = regexp1.test(str1);
        console.log(result1);
        var str = msg.contact;
        var regexp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        var result = regexp.test(str);
        console.log(result);
                try{
                    if(result1==false) throw "DOB error"
                    if(result==false) throw "Contact No. error"
                }
                catch(err){
                    res.code="400";
                    res.erro=err;
                    callback(null,res);
                }
                coll.save({user_id:msg.user_id,ebay_handle:msg.ebay_handle,contact:msg.contact,
                    birthday:msg.birthday, first_name:msg.first_name}, function(err, user){
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

//function(req,res){
//     var sess= req.session;
//
//     var setProfile= 'UPDATE user SET birthday="'+req.body.dob+'",ebay_handle="'+req.body.ebay_handle+'", contact="'+req.body.phone+'" WHERE email="'+req.session.user+'" AND first_name="'+req.session.first_name+'"';
//     console.log(setProfile)
//     mysql.fetchData(setProfile,function(err,result){
//         if(err){
//             console.log(err);
//             var json_response={"error" : err, "statuscode":401};
//             res.send(json_response);
//         }
//         else{
//
//             var object_id="ep_id";
//             var description="Edit Profile"
//             var log_sql='insert into user_log(timestamp, user_id, object_id,description) values(now(),"'+req.session.user_id+'","'+object_id+'","'+description+'")';
//
//             mysql.fetchData(log_sql,function(err,result){
//                 if(err){
//                     console.log("Log Error"+err);
//                 }else{
//
//                 }
//             });
//
//             //console.log(fname);
//             var json_response={"result" : result, "statuscode":200};
//             //var json_response=result;
//             res.send(json_response);
//
//
//         }});
//
// };
