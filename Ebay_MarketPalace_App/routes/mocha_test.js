/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('sign up return', function(done){
		http.get('http://localhost:3000/signup', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('Login Page return', function(done){
		http.get('http://localhost:3000/login', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('product', function(done){
		http.get('http://localhost:3000/sell_history', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('success buylist', function(done){
		http.get('http://localhost:3000/getProduct', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('user log return', function(done){
		http.get('http://localhost:3000/product', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

});