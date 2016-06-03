app.districtModel = Backbone.Model.extend({
	urlRoot: app.api("/districts"),
	idAttribute: "_id"
});

app.districtCollection = Backbone.Collection.extend({
	model: app.districtModel,
	url: app.api("/districts")
});

app.districtList = new app.districtCollection();