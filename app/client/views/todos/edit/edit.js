var pageSession = new ReactiveDict();

Template.TodosEdit.rendered = function() {
	
};

Template.TodosEdit.events({
	
	"click #page-back-button": function(e, t) {
		e.preventDefault();
		Router.go("todos", {  });
	}
});

Template.TodosEdit.helpers({
	
});

Template.TodosEditEditTodo.rendered = function() {
	

	pageSession.set("todosEditEditTodoInfoMessage", "");
	pageSession.set("todosEditEditTodoErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.TodosEditEditTodo.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("todosEditEditTodoInfoMessage", "");
		pageSession.set("todosEditEditTodoErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var todosEditEditTodoMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(todosEditEditTodoMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("todosEditEditTodoInfoMessage", message);
					}; break;
				}
			}

			Router.go("todos", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("todosEditEditTodoErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Todos.update({ _id: t.data.find_to_do._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("todos", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("todos", {});
	}

	
});

Template.TodosEditEditTodo.helpers({
	"infoMessage": function() {
		return pageSession.get("todosEditEditTodoInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("todosEditEditTodoErrorMessage");
	}
	
});
