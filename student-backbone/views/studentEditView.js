var studentEditView = Backbone.View.extend({
  tagName: "div",

  events: {
    "submit #student-edit-form": "updateStudent",
    "click #close-edit": "showStudentDetail",
    "change #division": "loadTownships"
  },

  initialize: function() {
    //
  },

  api: function(path) {
    return app.host + path;
  },

  render: function() {
    this.$el.html( app.hookTemplate("student-edit", this.model.toJSON()) );
    return this;
  },

  loadTownships: function() {
    var that = this;
    var divisionId = $("#division").val();
    $.ajax({
      url: this.api("/students/townships/" + divisionId),
      success: function(data) {
        //console.log(data);
        var options = "";
        app.townships = data[0]["townshiplist"];
        for (var i = 0; i < app.townships.length; i++) {
              options += "<option value=" + i + ">" + app.townships[i] + "</option>";
            };
            $("#township").html(options);
      }
    });
  },

  updateStudent: function() {
    var studentNameInput = $("#studentName");
    if(!studentNameInput.val()) {
      studentNameInput.parent().addClass('has-error');
      studentNameInput.focus();
      return false;
    }

    var name = studentNameInput.val();
    var contact1 = $("#contact1").val();
    var contact2 = $("#contact2").val();
    var fbprofile = $("#fbprofile").val();
    var emailInput = $("#email").val();
    var addressInput = $("#address").val();
    var divisionId = $("#division").val();
    var townshipValue = $("#township").val();


    var that = this;
    this.model.save({
      "studentName" : name,
      "contact1": contact1,
      "contact2": contact2,
      "fbprofile": fbprofile,
      "email" : emailInput,
      "address" : addressInput, 
      "divisionid": divisionId,
      "divisionName": app.divisions[divisionId],
      "townshipid": townshipValue,
      "townshipName": app.townships[townshipValue]
    }, {
      wait: true,
      success: function(res) {
        that.showStudentDetail();
        location.reload(); // Need to think!!
      }
    });

    return false;
  },

  showStudentDetail: function(data) {
    var detail = new studentDetailView({ model: this.model });
    $("#main").html( detail.render().el );
  }
});