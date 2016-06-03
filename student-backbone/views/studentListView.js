var studentListView = Backbone.View.extend({
  tagName: "div",

  initialize: function() {
    //
  },

  render: function() {
    this.$el.html( app.hookTemplate("student-list") );

    var that = this;
    app.studentList.each(function(student) {
      var view = new studentView({ model: student });
      $("tbody", that.$el).append( view.render().el );
    });

    return this;
  }
});

var studentView = Backbone.View.extend({
  tagName: "tr",

  events: {
    "click .student-name": "viewDetail"
  },

  initialize: function() {
    //
  },

  render: function() {
    var index = app.studentList.indexOf(this.model);
    this.model.set("index", index + 1);
    
    this.$el.html( app.hookTemplate("student", this.model.toJSON() ) );
    return this;
  },

  viewDetail: function(e) {
    var detail = new studentDetailView({model: this.model});
    $("#main").html( detail.render().el );
  }
});