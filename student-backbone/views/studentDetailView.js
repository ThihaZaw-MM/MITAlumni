var studentDetailView = Backbone.View.extend({
	tagName: "div",

	events: {
		"click #delete-student": "deleteStudent",
		"click #close-student": "closeStudent",
		"click #edit-student": "editStudent",
		"click .change-major": "changeMajor",
		"click .change-batch": "changeBatch",
		"click .change-assign": "changeState",
		"click .change-status": "changeDistricts",
		"click .change-gender": "changeGender",
		"fileselect :file" : "uploadFile"
	},

	initialize: function() {
		//
	},

	api: function(path) {
	   return app.host + path;
	},

	render: function() {

		this.model.set("rootUrl", this.model.urlRoot);

		var studentModel = this.model.toJSON();
	    var divisionid = studentModel["divisionId"];

	    $.ajax({
	      url: this.api("/students/townships/" + divisionid),
	      success: function(data) {
	      	if(data!=null){
	      		app.townships = data[0]["townshiplist"];	
	      	}
	      }
	    });
	    //console.log(this.model.toJSON());
		this.$el.html(app.hookTemplate("student-detail", this.model.toJSON()));
		return this;
	},

	deleteStudent : function() {
		var urlRoot = this.model.urlRoot;
		var id = this.model.id;
		this.model.url = function() {
			return urlRoot + "/" + id;
		};

		this.model.destroy({
			wait: true,
			success: function() {
				var list = new studentListView();
				$("#main").html( list.render().el );
			}
		});
	},

	editStudent: function() {
		var edit = new studentEditView({model: this.model});
		$("#main").html( edit.render().el );
	},

	uploadFile: function(e) {
		//console.log(e.target.result);

		//var urlRoot = this.model.urlRoot;
		//var id = this.model.id;
		
		/*var that = this;

		this.model.url = function() {
			return urlRoot + "/photo/" + id;
		};

		this.model.save({
			photoUrl: e.target.result,
		}, {
			patch: true,
			wait: true,
			success: function() {
				var detail = new studentDetailView({model: that.model});
				$("#main").html( detail.render().el );
			}
		});*/
	},

	changeMajor: function(e) {
		var major = $(e.currentTarget).data("value");
		var urlRoot = this.model.urlRoot;
		var id = this.model.id;
		var that = this;

		console.log(id);

		this.model.url = function() {
			return urlRoot + "/major/" + id;
		};

		this.model.save({
			major: Number(major),
			majorLabel: app.major[major]
		}, {
			patch: true,
			wait: true,
			success: function() {
				var detail = new studentDetailView({model: that.model});
				$("#main").html( detail.render().el );
			}
		});
	},

	changeGender: function(e) {

		var gender = $(e.currentTarget).data("value");
		var urlRoot = this.model.urlRoot;
		var id = this.model.id;
		var that = this;

		console.log(gender);

		this.model.url = function() {
			return urlRoot + "/gender/" + id;
		};

		this.model.save({
			gender: app.gender[gender]
		}, {
			patch: true,
			wait: true,
			success: function() {
				var detail = new studentDetailView({model: that.model});
				$("#main").html( detail.render().el );
			}
		});
	},

	changeBatch: function(e) {
		var batch = $(e.currentTarget).data("value");
		var urlRoot = this.model.urlRoot;
		var id = this.model.id;
		var that = this;

		console.log(id);

		
		this.model.url = function() {
			return urlRoot + "/batch/" + id;
		};

		this.model.save({
			batch: batch,
			batchLabel: app.batch[batch]
		}, {
			patch: true,
			wait: true,
			success: function() {
				var detail = new studentDetailView({model: that.model});
				$("#main").html( detail.render().el );
			}
		});
	},

	changeDistricts: function(e) {
		var district = $(e.currentTarget).data("value");
		var urlRoot = this.model.urlRoot;
		var id = this.model.id;
		var that = this;

		this.model.url = function() {
			return urlRoot + "/districts/" + id;
		};

		this.model.save({
			district: district,
			statusLabel: app.districts[district]
		}, {
			patch: true,
			wait: true,
			success: function() {
				var detail = new studentDetailView({model: that.model});
				$("#main").html( detail.render().el );
			}
		});
	},

	changeStateNumber: function(e) {
		var stateNumber = $(e.currentTarget).data("value");
		var label = $(e.currentTarget).html();

		console.log(assign);
		console.log(label);

		var urlRoot = this.model.urlRoot;
		var id = this.model.id;
		var that = this;

		this.model.url = function() {
			return urlRoot + "/statenNmber/" + id;
		};

		this.model.save({
			stateNumber: stateNumber,
			stateNumberLabel: app.statenumbers[stateNumber]
		}, {
			patch: true,
			wait: true,
			success: function() {
				var detail = new studentDetailView({model: that.model});
				$("#main").html( detail.render().el );
			}
		});
	}
});