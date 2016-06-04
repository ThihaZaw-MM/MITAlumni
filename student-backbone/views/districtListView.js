var districtListView = Backbone.View.extend({
  tagName: "div",

  initialize: function() {
    //
  },
  
  events: {
    "click #new-district": "newDistrict"
  },

  newDistrict: function() {
    console.log("Hello from newDistrict!!");
    var view = new districtNewView();
    $("#main").html( view.render().el );
  },

  render: function() {
    this.$el.html( app.hookTemplate("district-list") );

    var that = this;
    console.log(app.districtList);
    app.districtList.each(function(district) {
      var view = new districtView({ model: district });
      $("tbody", that.$el).append( view.render().el );
    });

    return this;
  }
});

var districtView = Backbone.View.extend({
  tagName: "tr",

  events: {
    "click .edit-district": "editDistrict",
    "click .delete-delete": "deleteDistrict",
    "click #new-district": "newDistrict"
  },

  initialize: function() {
    //
  },

  render: function() {
    var index = app.districtList.indexOf(this.model);
    this.model.set("index", index + 1);
    
    this.$el.html( app.hookTemplate("district", this.model.toJSON() ) );
    return this;
  },

  editDistrict: function() {
    var district = new districtEditView({ model: this.model });
    $("#main").html( district.render().el );
  },

  deleteDistrict: function() {
    this.model.destroy({
      wait: true,
      success: function() {
        var district = new districtListView();
        $("#main").html( district.render().el );
      }
    });
  }
});