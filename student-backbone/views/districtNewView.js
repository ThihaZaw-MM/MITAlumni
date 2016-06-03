var districtNewView = Backbone.View.extend({
  tagName: "div",

  events: {
    "submit #new-district-form": "create"
  },

  initialize: function() {
    this.listenTo(app.districtList, 'add', this.showDistrictList);
  },

  render: function() {
    this.$el.html( app.hookTemplate("district-new") );
    return this;
  },

  api: function(path) {
    return app.host + path;
  },

  create: function() {
    var stateNumber = $("#stateNumber").val();
    var districtId = 0;
    var districtName = $("#districtName").val();

    var that = this;
    
      $.ajax({
        url: this.api("/districts/maxdistrictid/"),
        success: function(data) {
          that.districtId = Number(data[0]["districtId"]) + 1; 
          console.log(data[0]["districtId"])
        }
      });

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

    var model = new app.districtModel({
      "stateNumber" : stateNumber,
      "districtId" : districtId,
      "districtName" : districtName
    });

    model.save(null, {
      wait: true,
      success: function(res) {
        app.districtList.add(res);
      }
    });

    return false;
  },

  showDistrictList: function() {
    var list = new districtListView();
    $("#main").html( list.render().el );
  }
});