var studentEditView = Backbone.View.extend({
  tagName: "div",

  events: {
    "submit #student-edit-form": "updateStudent",
    "click #close-edit": "showStudentDetail"
  },

  initialize: function() {
    //
  },

  render: function() {
    this.$el.html( app.hookTemplate("student-edit", this.model.toJSON()) );
    return this;
  },

  updateIssue: function() {
    var studentNameInput = $("#studentName");
    if(!summaryInput.val()) {
      summaryInput.parent().addClass('has-error');
      summaryInput.focus();
      return false;
    }

    var summary = summaryInput.val();
    var detail = $("#detail").html();

    var that = this;
    this.model.save({
      "detail" : detail,
      "summary" : summary
    }, {
      wait: true,
      success: function(res) {
        that.showIssueDetail();
      }
    });

    return false;
  },

  showStudentDetail: function(data) {
    var detail = new studentDetailView({ model: this.model });
    $("#main").html( detail.render().el );
  }
});