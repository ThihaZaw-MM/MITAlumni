var addressBookView = Backbone.View.extend({
	tagName: "div",
	
	events: {
	    "change #major": "filterStudent",
	    "change #batch": "filterStudent"
	},

	initialize: function() {
	    //
	},

	filterStudent: function() {
	    var majorId = Number($("#major").val());
	    var batchId = Number($("#batch").val());
	    var that = this;
	    var apiUrl = app.host + "/students"

	    app.studentList.fetch({ 
	      data: $.param({ batch: batchId, major: majorId}), 
	      reset: true,
	      success: function (collection, response, options) {
	      		console.log(app.studentList.toJSON());
	          	var students = {"students" : app.studentList.toJSON()};
			    that.$el.html( app.hookTemplate("address-book", students)) ;
			    return that;
	      },
	      error: function (collection, response, options) {
	          // you can pass additional options to the event you trigger here as well
	      }
	    });
	},

	render: function() {
		var students = {"students" : app.studentList.toJSON()};
	    this.$el.html( app.hookTemplate("address-book", students)) ;
	    return this;
	}

});