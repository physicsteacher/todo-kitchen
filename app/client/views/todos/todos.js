var pageSession = new ReactiveDict();

Template.Todos.rendered = function() {
	
};

Template.Todos.events({
	
});

Template.Todos.helpers({
	
});

var TodosViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("TodosViewSearchString");
	var sortBy = pageSession.get("TodosViewSortBy");
	var sortAscending = pageSession.get("TodosViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = [];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var TodosViewExport = function(cursor, fileType) {
	var data = TodosViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.TodosView.rendered = function() {
	pageSession.set("TodosViewStyle", "table");
	
};

Template.TodosView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("TodosViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("TodosViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("TodosViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("todos.insert", {});
	}

	
});

Template.TodosView.helpers({

	"insertButtonClass": function() {
		return .userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this. || this..count() == 0;
	},
	"isNotEmpty": function() {
		return this. && this..count() > 0;
	},
	"isNotFound": function() {
		return this. && pageSession.get("TodosViewSearchString") && TodosViewItems(this.).length == 0;
	},
	"searchString": function() {
		return pageSession.get("TodosViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("TodosViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("TodosViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("TodosViewStyle") == "gallery";
	}

	
});


Template.TodosViewTable.rendered = function() {
	
};

Template.TodosViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("TodosViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("TodosViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("TodosViewSortAscending") || false;
			pageSession.set("TodosViewSortAscending", !sortAscending);
		} else {
			pageSession.set("TodosViewSortAscending", true);
		}
	}
});

Template.TodosViewTable.helpers({
	"tableItems": function() {
		return TodosViewItems(this.);
	}
});


Template.TodosViewTableItems.rendered = function() {
	
};

Template.TodosViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("todos.edit", {id: this._id});
		return false;
	}
});

Template.TodosViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return .userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return .userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
