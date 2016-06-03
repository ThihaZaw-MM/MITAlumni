var districtEditView = Backbone.View.extend({
  tagName: "div",

  events: {
    "submit #edit-district-form": "updateDistrict"
  },

  initialize: function() {
    //
  },

  render: function() {
    this.$el.html( app.hookTemplate("district-edit", this.model.toJSON()) );
    return this;
  },

  updateDistrict: function() {
    var stateNumber = $("#stateNumber").val();
    var districtId = $("#ldistrictId").val();
    var districtName = $("#districtName").val();
    
    var err = 0;
    if(!stateNumber) {
      err++;
      $("#stateNumber").parent().addClass('has-error');
    }

    if(!districtId) {
      err++;
      $("#districtId").parent().addClass('has-error');
    }

    if(!districtName) {
      err++;
      $("#districtName").parent().addClass('has-error');
    }

    if(err) return false;

    var that = this;
    this.model.save({
      "stateNumber" : stateNumber,
      "districtId" : districtId,
      "districtName" : districtName,
    }, {
      wait: true,
      success: function() {
        that.showDistrictList();
      }
    });

    return false;
  },

  showDistrictList: function() {
    var list = new districtListView();
    $("#main").html( list.render().el );
  }
});