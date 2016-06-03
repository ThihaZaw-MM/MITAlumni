var navView = Backbone.View.extend({
  tagName: "div",
  className: "navbar navbar-default",

  events: {
    "click #new-student": "showNewStudentForm",
    "click #student-list": "showStudentList",
    "click #district-list": "showDistrictList",
    "click #user-list": "showUserList",
    "click #profile": "showProfile",
    "click #logout": "logout"
  },

  render: function() {
    var user = app.getUserInfo();
    if( user ) {
      
      var data = {
        auth: true,
        userName: user.fullName,
        studentCount: app.studentList.length,
      };
    } else {
      data = {
        auth: false
      }
    }

    this.$el.html( app.hookTemplate("nav", data) );
    return this;
  },

  showNewStudentForm: function(e) {
    $(".nav li").removeClass('active');
    $(e.currentTarget).parent().addClass('active');

    var form = new studentNewView();
    $("#main").html( form.render().el );
  },

  showStudentList: function(e) {
    $(".nav li").removeClass('active');
    $(e.currentTarget).parent().addClass('active');

    var list = new studentListView();
    $("#main").html( list.render().el );
  },

  showDistrictList: function(e) {
    $(".nav li").removeClass('active');
    $(e.currentTarget).parent().addClass('active');

    var list = new districtListView();
    $("#main").html( list.render().el );
  },

  showUserList: function(e) {
    $(".nav li").removeClass('active');
    $(e.currentTarget).parent().addClass('active');

    var users = new userListView();
    $("#main").html( users.render().el );
  },

  showProfile: function(e) {
    $(".nav li").removeClass('active');
    $(e.currentTarget).parent().addClass('active');

    var user = new app.userModel(app.getUserInfo());
    var profile = new userProfileView({ model: user });
    $("#main").html( profile.render().el );
  },

  logout: function() {
    var that = this;
    app.logout(function() {
      var login = new loginView();
      $("#main").html( login.render().el );

      that.render();
    });   
  }
});