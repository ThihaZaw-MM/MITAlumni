var mongojs = require("mongojs");
var crypto = require("crypto");
var express = require("express");
var validator = require("express-validator");
var router = express.Router();

var auth = require("../auth");
var config = require("../config");

var db = mongojs('AddressBook', ['districts']);

router.post("/", auth.ensureAuth(), function(req, res) {
	
	db.districts.insert(req.body, function(err, data) {
		if(err) res.status(500).json(err);
		else res.status(200).json(data);
	});
});

//Get all districts
router.get("/",  function(req, res){
	db.districts.find({}, function(err, data) {
		res.status(200).json(data);
	});
});

router.get("/maxdistrictid", function(req, res) {
	db.districts.find({}, function(err, data) {
		var largest = findMax(data);
		res.status(200).json(largest);
	});
});

function findMax(data){
	var max = data[0];
	for (var i = 1; i < data.length; i++) {
		var current = data[i];
		if(Number(current["districtId"]) > Number(max["districtId"]) ){
			max = current;
		}
	};
	return max;
}

router.post("/", auth.ensureAuth(), function(req, res) {
	//Validation
	db.districts.insert(req.body, function(err, data) {
		if(err) res.status(500).json(err);
		else res.status(200).json(data);
	});
});

//Get one district
router.get("/:id", auth.ensureAuth(), function(req, res) {
	var uid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid User ID").isMongoId();
	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	db.districts.findOne({_id: mongojs.ObjectId(uid)}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(404);
	});
});

//Update a district
router.put("/:id", auth.ensureOwner(), function(req, res) {
	var uid = req.params.id;


	var newData = {
		stateNumber: req.body.stateNumber,
		districtId: req.body.districtId,
		districtName: req.body.districtName
	};

	db.districts.update(
		{ _id: mongojs.ObjectId(uid) },
		{ $set: newData },
		{ multi: false},
		function(err, data) {
			if(err) res.status(500).json(err);
			else res.status(200).json(data);
		}
	);
});

router.delete("/:id", auth.ensureSuper(), function(req, res) {
	var uid = req.params.id;

	db.districts.remove({_id: mongojs.ObjectId(uid)}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(404);
	});
});

module.exports = router;