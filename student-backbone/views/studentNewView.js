var studentNewView = Backbone.View.extend ({
	tagName: "div",

	events: {
		"submit #new-student-form": "create",
		"change #stateNumber": "loadDistricts",
		"change #division": "loadTownships"
	},

	api: function(path) {
		return app.host + path;
	},

	initialize: function() {
		this.listenTo(app.studentList, 'add', this.showStudentList);
	},

	render: function() {
		var data = {
			statenumbers: app.statenumbers,
			districts: app.districts,
			gender: app.gender,
			batch: app.batch,
			major: app.major,
			divisions: app.divisions,
		};

		this.$el.html( app.hookTemplate("student-new", data) );
		return this;
	},

	loadTownships: function() {
		var that = this;
		var divisionId = $("#division").val();
		$.ajax({
			url: this.api("/students/townships/" + divisionId),
			success: function(data) {
				//console.log(data);
				var options = "";
				app.townships = data[0]["townshiplist"];
				for (var i = 0; i < app.townships.length; i++) {
		        	options += "<option value=" + i + ">" + app.townships[i] + "</option>";
		        };
		        $("#township").html(options);
			}
		});
	},

	loadDistricts: function() {
		var that = this;
		var stateNumber = $("#stateNumber").val();
	    $.ajax({
	      url: this.api("/students/districts/" + stateNumber),
	      success: function(data) {
	        var options = "";
	        for (var i = data.length - 1; i >= 0; i--) {
	        	options += "<option value=" + data[i]["districtId"] + ">" + data[i]["districtName"] + "</option>";
	        };
	        $("#district").html(options);
	      }
	    });
	},

	create: function() {
		var studentNameInput = $("#studentName");
		var nrcTypeInput = $("#nrcType");
		var nrcRegNumberInput = $("#nrcRegNumber");

		if(!nrcTypeInput.val()){
			nrcTypeInput.parent().addClass('has-error');
			nrcTypeInput.focus();
			return false;
		}
		if(!nrcRegNumberInput.val()){
			nrcRegNumberInput.parent().addClass('has-error');
			nrcRegNumberInput.focus();
			return false;
		}
		if(!studentNameInput.val()) {
			studentNameInput.parent().addClass('has-error');
			studentNameInput.focus();
			return false;
		}

		var studentName = studentNameInput.val();
		var stateNumber = $("#stateNumber").val();
		var district = $("#district").val();
		var nrcType = nrcTypeInput.val();
		var nrcRegNumber = nrcRegNumberInput.val();
		var gender = $("#gender").val();
		var batch = $("#batch").val();
		var major = $("#major").val();
		var contact1 = $("#contact1").val();
		var contact2 = $("#contact2").val();
		var fbprofile = $("#fbprofile").val();
		var emailInput = $("#email").val();
		var addressInput = $("#address").val();
		var divisionId = $("#division").val();
		var townshipValue = $("#township").val();

		var model = new app.studentModel({
			"studentName": studentName,
			"statenumber": stateNumber,
			"statenumberLabel": app.statenumbers[stateNumber],
			"district": district,
			"districtLabel": getLabel(district),
			"nrcType": nrcType,
			"nrcRegNumber": nrcRegNumber,
			"gender": app.gender[gender],
			"batch": batch,
			"batchLabel": app.batch[batch],
			"major": Number(major),
			"majorLabel": app.major[major],
			"contact1": contact1,
			"contact2": contact2,
			"fbprofile": fbprofile,
			"email" : emailInput,
			"address" : addressInput, 
			"divisionid": divisionId,
			"divisionName": app.divisions[divisionId],
			"townshipid": townshipValue,
			"townshipName": app.townships[townshipValue]
		});

		model.save(null, {
			wait: true,
			success: function(res) {
				app.studentList.add(res);
			}
		});
		return false;
	},

	showStudentList: function() {
		var list = new studentNewView();
		var nav = new navView();
        $("#nav").html( nav.render().el );
		$("#main").html( list.render().el );
	}
});

function getLabel(adistrict){
	for(var i=0; i< app.districts.length; i++){
		
		if(Number(app.districts[i]["districtId"]) === Number(adistrict)){
			//console.log(app.districts[i]);
			return app.districts[i]["districtName"];
		}
	}
	return "";
}