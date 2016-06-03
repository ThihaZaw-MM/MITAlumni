var userProfileView = Backbone.View.extend({
  tagName: "div",

  events: {
    "click #edit-user": "userEdit"
  },

  initialize: function() {
    //
  },

  render: function() {
    var that = this;
    var roleIndex = this.model.toJSON().role;
    this.model.set("submitCount", app.studentList.where({
      "submittedBy": that.model.id
    }).length);

    this.model.set("assignCount", app.studentList.where({
      "assignedTo": that.model.id
    }).length);

    this.model.set("roleLabel", app.userRole[roleIndex]);

    this.$el.html( app.hookTemplate("user-profile", this.model.toJSON()) );
    return this;
  },

  userEdit: function() {
    var user = new userEditView({ model: this.model });
    $("#main").html( user.render().el );
  }
});