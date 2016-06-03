var mongojs = require("mongojs");
var express = require("express");
var validator = require('express-validator');
var multer = require('multer');
var router = express.Router();

var auth = require("../auth");
var config = require("../config");

var db = mongojs('AddressBook', ['students']);
var distDb = mongojs('AddressBook', ['districts']);

//Get stateNumbers
router.get("/statenumbers", auth.ensureAuth(), function(req, res) {
  res.status(200).json(config.statenumber);
});

// Get districts
router.get("/districts", auth.ensureAuth(), function(req, res) {
  //res.status(200).json(config.districts);
  distDb.districts.find({}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
		});
});

router.get("/districts/:statenumber", function(req, res) {
  //var snumber = req.params.statenumber;
  var snumber = Number(req.params.statenumber);

  distDb.districts.find({stateNumber: snumber}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
		});
});

// Get gender
router.get("/gender", auth.ensureAuth(), function(req, res) {
  res.status(200).json(config.gender);
});


// Get batch
router.get("/batch", auth.ensureAuth(), function(req, res) {
  res.status(200).json(config.batch);
});

// Get Major
router.get("/major", auth.ensureAuth(), function(req, res) {
  res.status(200).json(config.major);
});

//Get all students
router.get("/",  function(req, res) {
	db.students.find({}, function(err, data) {
		res.status(200).json(data);
	});
});

//Get one student
router.get("/:id", auth.ensureAuth(), function(req, res) {
	var iid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid Student ID").isMongoId();
	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	db.students.findOne({_id: mongojs.ObjectId(iid)}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
	});
});

//Create a new student
router.post("/", auth.ensureRole(1), function(req, res) {
	//Validation
	req.checkBody("studentName", "Invalid Student Name").notEmpty();
	//req.checkBody("major", "Invalid Major").isInt();
	//req.checkBody("batch", "Invalid Batch").isInt();

	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	var newStudent = {
		studentName: req.body.studentName,
		statenumber: req.body.statenumber,
		statenumberLabel: config.statenumber[req.body.statenumber],
		district: req.body.district,
		districtLabel: req.body.districtLabel,
		nrcType: req.body.nrcType,
		nrcRegNumber: req.body.nrcRegNumber,
		gender: req.body.gender,
		batch: req.body.batch,
		batchLabel: config.batch[req.body.batch],
		major: req.body.major,
		majorLabel:config.major[req.body.major],
		contact1: req.body.contact1,
		contact2: req.body.contact2,
		fbprofile: req.body.fbprofile,
		photoUrl: null,
		submittedAt: new Date(),
		submittedBy: mongojs.ObjectId(req.user._id),
		submittedByLabel: req.user.fullName
	};

	db.students.insert(newStudent, function(err, data) {
		if(err) res.status(500).json(err);
		else res.status(200).json(data);
	});
});

//Update an student
router.put("/:id", auth.ensureRole(1), function(req, res) {
	var iid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid Student ID").isMongoId();
	req.checkBody("studentName", "Invalid Student Name").notEmpty();

	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	console.log(req.body.detail);

	var newData = {
		studentName: req.body.studentName,
		detail: req.body.detail,
		modifiedAt: new Date()
	};

	db.students.update(
		{ _id: mongojs.ObjectId(iid) },
		{ $set: newData },
		{ multi: false},
		function(err, data) {
			if(err) res.status(500).json(err);
			else res.status(200).json(data);
		}
	);
});

//Delete an student
router.delete("/:id", auth.ensureSubmitter(), function(req, res) {
	var iid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid Student ID").isMongoId();
	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	db.students.remove({ _id: mongojs.ObjectId(iid)}, function(err, data) {
			if(data) res.status(200).json(data);
			else res.sendStatus(404);
	});
});

//Update student major
router.patch("/major/:id", auth.ensureRole(1), function(req, res) {
	var iid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid Student ID").isMongoId();
	//req.checkBody("type", "Invalid major").isInt();

	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	var newData = {
		major: req.body.major,
		majorLabel: config.major[req.body.major],
		modifiedAt: new Date()
	};

	db.students.update(
		{ _id: mongojs.ObjectId(iid) },
		{ $set: newData },
		{ multi: false },
		function(err, data) {
			if(err) res.status(500).json(err);
			else res.status(200).json(data);
		}
	);
});

//Update student batch
router.patch("/batch/:id", auth.ensureRole(2), function(req, res) {
	var iid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid Student ID").isMongoId();
	//req.checkBody("batch", "Invalid batch").isInt();
	//console.log(req.body.batch);

	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	var newData = {
		batch: req.body.batch,
		batchLabel: config.batch[req.body.batch],
		modifiedAt: new Date()
	};

	db.students.update(
		{ _id: mongojs.ObjectId(iid) },
		{ $set: newData },
		{ multi: false },
		function(err, data) {
			if(err) res.status(500).json(err);
			else res.status(200).json(data);
		}
	);
});

//Update student assigned to
router.patch("/district/:id", auth.ensureRole(2), function(req, res) {
	var iid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid Student ID").isMongoId();
	//req.checkBody("assignedTo", "Invalid User ID").isMongoId();
	//req.checkBody("assignedToLabel", "Invalid User Name").notEmpty();

	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	var newData = {
		district: req.body.district,
		districtLabel: config.districts[req.body.district],
		modifiedAt: new Date()
	};

	db.students.update(
		{ _id: mongojs.ObjectId(iid) },
		{ $set: newData },
		{ multi: false },
		function(err, data) {
			if(err) res.status(500).json(err);
			else res.status(200).json(data);
		}
	);
});

//Update student stateNumber
router.patch("/stateNumber/:id", auth.ensureAssignee(), function(req, res) {
	var iid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid Student ID").isMongoId();
	//req.checkBody("status", "Invalid State Number").isInt();

	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	var newData = {
		stateNumber: req.body.statenumber,
		stateNumberLabel: config.statenumber[req.body.statenumber],
		modifiedAt: new Date()
	};

	db.students.update(
		{ _id: mongojs.ObjectId(iid) },
		{ $set: newData },
		{ multi: false },
		function(err, data) {
			if(err) res.status(500).json(err);
			else res.status(200).json(data);
		}
	);
});

router.patch("/photo/:id", function(req, res) {
	var iid = req.params.id;

	var newData = {
		photoUrl: req.body.photoUrl,
		modifiedAt: new Date()
	};

	db.students.update(
		{ _id: mongojs.ObjectId(iid) },
		{ $set: newData },
		{ multi: false },
		function(err, data) {
			if(err) res.status(500).json(err);
			else res.status(200).json(data);
		}
	);
});

router.post("/photo", function(req, res) {

	/*var responseServerPath = "uploads/" + req.files["fileInput"].name;
 	var serverPath = "uploads/" + req.files["fileInput"].name;
 	console.log(req.files.userPhoto.path);

 	require('fs').rename(
		req.files.userPhoto.path,
		serverPath,
		function(error) {
			if(error) {
				console.log(error);
				res.send({
					error: 'Ah crap! Something bad happened'
				});
				return;
			}
			 
			res.send({
				path: responseServerPath
			});
		}
	);*/
});


module.exports = router;