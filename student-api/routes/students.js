var mongojs = require("mongojs");
var express = require("express");
var validator = require('express-validator');
var multer = require('multer');
var path = require("path");
var router = express.Router();

var auth = require("../auth");
var config = require("../config");


var db = mongojs('AddressBook', ['students']);
var distDb = mongojs('AddressBook', ['districts']);
var townshipDb = mongojs('AddressBook', ['townships']);

router.get("/getPdf", function(req, res) {
	console.log("Hello!");
	var fs = require('fs');
	var pdf = require('html-pdf');
	console.log(pdf);
	var html = fs.readFileSync(__dirname + "/uploads/businesscard.html", 'utf8');
	var options = { format: 'Letter' };
	pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
	  	if (err) return console.log(err);
	  	console.log(res); // { filename: '/app/businesscard.pdf' } 
	});
	res.status(200);
});

//Get stateNumbers
router.get("/statenumbers", auth.ensureAuth(), function(req, res) {
  res.status(200).json(config.statenumber);
});

// Get districts
router.get("/districts", function(req, res) {
  //res.status(200).json(config.districts);
  distDb.districts.find({}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
		});
});

//Get divisions
router.get("/divisions", function(req, res) {
	res.status(200).json(config.divisions);
});

//Get townships
router.get("/townships/:divisionid", function(req, res) {
	var divId = Number(req.params.divisionid);

	townshipDb.townships.find({divisionId: divId}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
	});
});


router.get("/districts/:statenumber", function(req, res) {
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
router.get("/batch", function(req, res) {
  res.status(200).json(config.batch);
});

// Get Major
router.get("/major", function(req, res) {
  res.status(200).json(config.major);
});

//Get studentname group by
router.get("/names", function(req, res) {
	db.students.group({key:{studentName:1},reduce: function ( curr, result ) { },initial: { }}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
	});
});

//Student login by app
router.get("/login", function(req, res) {
	var sName = req.query.studentName;
	var stNumber = req.query.statenumber;
	var dLabel = req.query.districtLabel;
	var regNumber = req.query.nrcRegNumber;

	db.students.findOne({studentName: sName, statenumber: stNumber, 
		districtLabel: dLabel, 
		nrcRegNumber: regNumber}, function(err, data) {
      if(data)
        res.status(200).json(data);
      else {
      	console.log("Not found!");
      	res.sendStatus(404);
      }
    });

});
//Get all students
router.get("/",  function(req, res) {

	//console.log(req.url);
	//console.log(req.query);
	//console.log(req.query.batch);
	var batchId = req.query.batch;
	var majorId = Number(req.query.major);

	if(req.url == "/"){
		console.log("Query undefined");
		db.students.find({}, function(err, data) {
			res.status(200).json(data);
		});
	} else {
		if(batchId == 0 && majorId == 0){
			db.students.find({}, function(err, data) {
				res.status(200).json(data);
			});	
		} else if(batchId != 0 && majorId == 0){
			db.students.find({batch : batchId}, function(err, data) {
				res.status(200).json(data);
			});
		} else if(batchId == 0 && majorId != 0){
			db.students.find({major : majorId}, function(err, data) {
				res.status(200).json(data);
			});
		} else {
			db.students.find({batch: batchId, major: majorId}, function(err, data) {
				res.status(200).json(data);
			});
		}
	}
});

router.get("/bybatch/:batch", function(req, res) {
	var batchId = req.params.batch;
	db.students.find({batch: batchId}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
	});
});

router.get("/bymajor/:major", function(req, res) {
	var major = Number(req.params.major);
	db.students.find({major: major}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
	});
});

router.get("/batchmajor/:batch/:major", function(req, res) {
	var batchId = req.params.batch;
	var major = Number(req.params.major);
	db.students.find({batch: batchId, major: major}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
	});
});

router.get("/batchmajortownship/:batch/:major/:township", function(req, res) {
	var batchId = req.params.batch;
	var major = Number(req.params.major);
	var township = req.params.township;
	db.students.find({batch: batchId, major: major, townshipId: township}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
	});
});

router.get("/batchtownship/:batch/:township", function(req, res) {
	var batchId = req.params.batch;	
	var township = req.params.township;
	db.students.find({batch: batchId, townshipId: township}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
	});
}); 

router.get("/majortownship/:major/:township", function(req, res) {
	var major = Number(req.params.major);
	var township = req.params.township;
	db.students.find({major: major, townshipId: township}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
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
		majorLabel: config.major[req.body.major],
		contact1: req.body.contact1,
		contact2: req.body.contact2,
		fbprofile: req.body.fbprofile,
		photoUrl: null,
		email: req.body.email,
		address: req.body.address,
		divisionId: req.body.divisionid,
		divisionName: config.divisions[req.body.divisionid],
		townshipId: req.body.townshipid,
		townshipName: req.body.townshipName,
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
router.put("/:id", function(req, res) {
	var iid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid Student ID").isMongoId();
	req.checkBody("studentName", "Invalid Student Name").notEmpty();

	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	var newData = {
		studentName: req.body.studentName,
		statenumber: req.body.statenumber,
		statenumberLabel: config.statenumber[req.body.statenumber],
		district: req.body.district,
		districtLabel: req.body.districtLabel,
		nrcType: req.body.nrcType,
		nrcRegNumber: req.body.nrcRegNumber,
		contact1: req.body.contact1,
		contact2: req.body.contact2,
		fbprofile: req.body.fbprofile,
		email: req.body.email,
		address: req.body.address,
		divisionId: req.body.divisionid,
		divisionName: config.divisions[req.body.divisionid],
		townshipId: req.body.townshipid,
		townshipName: req.body.townshipName,
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
router.delete("/:id", auth.ensureRole(1), function(req, res) {
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

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

router.post("/photo/:id", function(req, res) {

	var iid = req.params.id;
	req.checkParams("id", "Invalid Student ID").isMongoId();


	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	upload(req,res,function(err) {

        if(err) {
        	console.log(err);
            return res.end("Error uploading file.");
        }
        //res.end("File is uploaded");
        //console.log(req.headers.referer);
        var photoUrl = "http://" + req.headers.host + "/api/students/photo/" + req.file.filename;
        var newData = {
			photoUrl: photoUrl,
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
});

router.get("/photo/:name", function(req, res) {
	var name = req.params.name;
	var filePath = __dirname + "/uploads/" + name;
	res.sendFile(filePath);
	//console.log(filePath);
	//res.send();
});

module.exports = router;