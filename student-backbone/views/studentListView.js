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
    var majorId = $("#major").val();
    var batchId = $("#batch").val();
    var that = this;
    var apiUrl = app.host + "/students"

    if(majorId != 0 && batchId != 0) {
      apiUrl += "/batchmajor/" + batchId + "/" + majorId;
    }
    else if(batchId !=0 && majorId == 0) {
      apiUrl += "/bybatch/" + batchId 
    }
    else if(batchId == 0 && majorId != 0) {
      apiUrl += "/bymajor/" + majorId  
    }

    //app.studentList.fetch({ data: $.param({ batch: batchId}) })
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