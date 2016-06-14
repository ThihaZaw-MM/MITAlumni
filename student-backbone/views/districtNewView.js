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
    
    var that = this;
    var list = app.districtList.toJSON();
    console.log(list);
    for(i=0; i < list.length; i++){
      var name = list[i].districtName;
      //console.log(name);
      if(name == $("#districtName").val()){
          alert("District already exit!");
          return false;
      }
    }
    
      $.ajax({
        url: this.api("/districts/maxdistrictid/"),
        success: function(data) {
          
          var stateNumber = Number($("#stateNumber").val());
          var districtId = Number(data["districtId"]) + 1; 
          var districtName = $("#districtName").val();
          
          var model = new app.districtModel({
            "stateNumber" : stateNumber,
            "districtId" : districtId,
            "districtName" : districtName
          });

          //console.log(model);

          model.save(null, {
            wait: true,
            success: function(res) {
              app.districtList.add(res);
              app.loadDistricts();
              location.reload(); 
            },
            error: function(res) {
              console.log(res);
              alert("District already exit!");
            }
          });
        }
      });

    return false;
  },

  showDistrictList: function() {
    var list = new districtListView();
    $("#main").html( list.render().el );
  }
});