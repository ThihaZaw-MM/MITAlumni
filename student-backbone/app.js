var app = {
	host: "http://thihazaw.com:3000/api",

	api: function(path) {
		return app.host + path;
	},

	templateCache: {},

	loadTemplates: function(names, callback) {
		var that = this;
		var load = function(index) {
			var name = names[index];
			$.get('templates/' + name + '.html?cache=false', function(data) {
				that.templateCache[name] = data;
				index++;
				if(index < names.length) {
					load(index);
				} else {
					callback();
				}
			});
		}
		load(0);
	},

	hookTemplate: function(name, data) {
		var tmpl = _.template(this.templateCache[name]);
		return tmpl(data);
	},

	login: function(user, pass, ok, notok) {
		$.ajax({
			type: "post",
			url: this.api("/users/login"),
			data: {
				username: user,
				password: pass
			},
			statusCode: {
				400: notok,
				401: notok,
				200: ok
			}
		});
	},

	logout: function(callback) {
		$.ajax({
			type: "delete",
			url: this.api("/users/logout"),
			complete: callback
		});
		localStorage.removeItem("user");
	},

	verify: function(ok, notok) {
		$.ajax({
			url: this.api("/users/verify"),
			statusCode: {
				401: notok,
				200: ok
			}
		});
	},

	saveUserInfo: function(user) {
		localStorage.setItem("user", JSON.stringify(user));
	},

	getUserInfo: function() {
		return JSON.parse(localStorage.getItem("user"));
	},

	statenumbers: [],
	districts: [],
	batch: [],
	major: [],
	gender: [],
	divisions: [],
	townships: [],
	userRole: [],

	  loadStateNumbers: function() {
	    var that = this;
	    $.ajax({
	      url: this.api("/students/statenumbers"),
	      success: function(data) {
	        that.statenumbers = data;
	        //console.log(data);
	      }
	    });
	  },

	  loadTownships: function() {
	  	var that = this;
	    $.ajax({
	      url: this.api("/students/townships/1"),
	      success: function(data) {
	        that.townships = data[0]["townshiplist"];
	      }
	    });
	  },

	  loadDistricts: function() {
	    var that = this;
	    $.ajax({
	      url: this.api("/students/districts"),
	      success: function(data) {
	        that.districts = data;
	        //console.log(data);
	      }
	    });
	  },

	  loadDivisions: function() {
	  	var that = this;
	    $.ajax({
	      url: this.api("/students/divisions"),
	      success: function(data) {
	        that.divisions = data;
	      }
	    });
	  },

	  loadGender: function() {
	    var that = this;
	    $.ajax({
	      url: this.api("/students/gender"),
	      success: function(data) {
	        that.gender = data;
	        //console.log(data);
	      }
	    });
	  },

	  loadBatch: function() {
	  	var that = this;
	  	$.ajax({
	  		url: this.api("/students/batch"),
	  		success: function(data) {
	  			that.batch = data;
	  			//console.log(data);
	  		}
	  	});
	  },

	  loadMajor: function() {
	  	var that = this;
	  	$.ajax({
	  		url: this.api("/students/major"),
	  		success: function(data){
	  			that.major = data;
	  			//console.log(data);
	  		}
	  	});
	  },

	  loadUserRoles: function() {
	    var that = this;
	    $.ajax({
	      url: this.api("/users/roles"),
	      success: function(data) {
	        that.userRole = data;
	        //console.log(data);
	      }
	    });
	  },

	init: function() {
		this.loadTemplates(['nav', 'login', 'student-list', 'student', 'student-new', 
			'student-detail', 'student-edit', 'district-list', 'district' ,'district-new', 'district-edit', 
			'user-list', 'user', 'user-profile', 
			'user-edit', 'user-new'], function() {
			new appView();
		});
	}
};

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
	options.crossDomain = {
		crossDomain: true
	};

	options.xhrFields = {
		withCredentials: true
	};
});