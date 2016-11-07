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
	it('ad post history', function(done){
		http.get('http://localhost:3000/sell_history', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('get Product', function(done){
		http.get('http://localhost:3000/getProduct', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('product', function(done){
		http.get('http://localhost:3000/product', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

});