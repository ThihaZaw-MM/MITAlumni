var appView = Backbone.View.extend({
  el: "#app",
  
  initialize: function() {
    app.loadBatch();
    app.loadMajor();
    this.render();
  },
  
  render: function() {
    var nav = new navView();
    $("#nav").html( nav.render().el );

    app.verify(function() {
      app.studentList.fetch({
        success: function() {
          
          app.loadDistrictList();
          app.userList.fetch();
          app.loadStateNumbers();
          app.loadDistricts();
          app.loadGender();
          app.loadBatch();
          app.loadMajor();
          app.loadTownships();
          app.loadDivisions();
          app.loadUserRoles();

          var list = new studentListView();
          $("#main").html( list.render().el );

          var nav = new navView();
          $("#nav").html( nav.render().el );
        }
      });
    }, function() {
      var login = new loginView();
      $("#main").html( login.render().el );
    });
  }
});