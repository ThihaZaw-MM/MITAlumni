var studentNewView = Backbone.View.extend ({
	tagName: "div",

	events: {
		"submit #new-student-form": "create",
		"change #stateNumber": "loadDistricts"
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
			major: app.major
		};

		this.$el.html( app.hookTemplate("student-new", data) );
		return this;
	},

	loadDistricts: function() {
		var that = this;
		var stateNumber = $("#stateNumber").val();
	    $.ajax({
	      url: this.api("/students/districts/" + stateNumber),
	      success: function(data) {
	        var options = "";
	        for (var i = data.length - 1; i >= 0; i--) {
	        	data[i]
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
			"major": major,
			"majorLabel": app.major[major],
			"contact1": contact1,
			"contact2": contact2,
			"fbprofile": fbprofile
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
			console.log(app.districts[i]);
			return app.districts[i]["districtName"];
		}
	}
	return "";
}