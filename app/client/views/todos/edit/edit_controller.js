this.TodosEditController = RouteController.extend({
	template: "TodosEdit",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("find_to_do", this.params.id)
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		return {
			params: this.params || {},
			find_to_do: Todos.findOne({_id:this.params.id}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});