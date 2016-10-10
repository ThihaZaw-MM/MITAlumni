app.studentModel = Backbone.Model.extend({
	urlRoot: app.api("/students"),
	defaults: {
		"studentName" : null,
		"statenumber" : 0,
		"statenumberLabel" : null,
		"district" : 0,
		"districtLabel" : null,
		"nrcType" : null,
		"nrcRegNumber": null,
		"gender" : "M",
		"batch" : null,
    	"batchLabel" : null,
    	"major" : 0,
    	"majorLabel" : null,
		"contact1" : null,
		"contact2" : null,
		"fbprofile" : null,
		"photoUrl" : null,
		"email" : "",
		"address" : "",
		"divisionId" : "",
		"divisionName" : "",
		"townshipId" : "",
		"townshipName" : ""
	},
	idAttribute: "_id"
});

app.studentCollection = Backbone.Collection.extend({
	model: app.studentModel,
	url: app.api("/students")
});

app.studentList = new app.studentCollection();