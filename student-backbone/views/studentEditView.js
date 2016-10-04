var studentEditView = Backbone.View.extend({
  tagName: "div",

  events: {
    "submit #student-edit-form": "updateStudent",
    "click #close-edit": "showStudentDetail",
    "change #stateNumber": "loadDistricts",
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
    console.log(divisionId);
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

  loadDistricts: function() {
    var that = this;
    var stateNumber = $("#stateNumber").val();
      $.ajax({
        url: this.api("/students/districts/" + stateNumber),
        success: function(data) {
          var options = "";
          for (var i = data.length - 1; i >= 0; i--) {
            options += "<option value=" + data[i]["districtId"] + ">" + data[i]["districtName"] + "</option>";
          };
          $("#district").html(options);
        }
      });
  },

  updateStudent: function() {
    var studentNameInput = $("#studentName");
    //console.log(studentNameInput);
    if(!studentNameInput.val()) {
      studentNameInput.parent().addClass('has-error');
      studentNameInput.focus();
      return false;
    }
    //console.log(studentNameInput + " after validation");

    var name = studentNameInput.val();
    var stateNumber = $("#stateNumber").val();
    var district = $("#district").val();
    var nrcType = $("#nrcType").val();
    var nrcRegNumber = $("#nrcRegNumber").val();
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
      "statenumber": stateNumber,
      "statenumberLabel": app.statenumbers[stateNumber],
      "district": district,
      "districtLabel": getLabel(district),
      "nrcType": nrcType,
      "nrcRegNumber": nrcRegNumber,
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
        //location.reload(); // Need to think!!
      }
    });

    return false;
  },

  showStudentDetail: function(data) {
    var detail = new studentDetailView({ model: this.model });
    $("#main").html( detail.render().el );
  }
});

function getLabel(adistrict){
  for(var i=0; i< app.districts.length; i++){
    
    if(Number(app.districts[i]["districtId"]) === Number(adistrict)){
      //console.log(app.districts[i]);
      return app.districts[i]["districtName"];
    }
  }
  return "";
}