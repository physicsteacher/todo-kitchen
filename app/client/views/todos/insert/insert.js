var pageSession = new ReactiveDict();

Template.TodosInsert.rendered = function() {
	
};

Template.TodosInsert.events({
	
});

Template.TodosInsert.helpers({
	
});

Template.TodosInsertInsertTodo.rendered = function() {
	

	pageSession.set("todosInsertInsertTodoInfoMessage", "");
	pageSession.set("todosInsertInsertTodoErrorMessage", "");

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

Template.TodosInsertInsertTodo.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("todosInsertInsertTodoInfoMessage", "");
		pageSession.set("todosInsertInsertTodoErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var todosInsertInsertTodoMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(todosInsertInsertTodoMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("todosInsertInsertTodoInfoMessage", message);
					}; break;
				}
			}

			Router.go("todos", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("todosInsertInsertTodoErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
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

Template.TodosInsertInsertTodo.helpers({
	"infoMessage": function() {
		return pageSession.get("todosInsertInsertTodoInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("todosInsertInsertTodoErrorMessage");
	}
	
});
