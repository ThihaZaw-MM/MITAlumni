var studentListView = Backbone.View.extend({
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
          // you can pass additional options to the event you trigger here as well
          //console.log("Fetch success!");
          //console.log(app.studentList.length);
          $("tbody", this.$el).empty();


          app.studentList.each(function(student) {
            //console.log(student.toJSON());
            var view = new studentView({ model: student });
            $("tbody", that.$el).append( view.render().el );
          });
      },
      error: function (collection, response, options) {
          // you can pass additional options to the event you trigger here as well
      }
    });
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
    "click .student-name": "viewDetail",
    "click #delete-student": "deleteStudent"
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
  },

  deleteStudent: function(e) {
    var studentId = this.model.id;
    var urlRoot = this.model.urlRoot;
    var id = this.model.id;
    this.model.url = function() {
      return urlRoot + "/" + id;
    };
    console.log(urlRoot + "/" + id);
    this.model.destroy({
      wait: true,
      success: function() {
        var list = new studentListView();
        var nav = new navView();
        $("#nav").html( nav.render().el );
        $("#main").html( list.render().el );
      }
    });
  }

});