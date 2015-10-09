Meteor.publish("todos_empty", function() {
	return Todos.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("find_to_do", function(id) {
	return Todos.find({_id:id,ownerId:this.userId}, {});
});

Meteor.publish("todo_list", function() {
	return Todos.find({ownerId:this.userId}, {});
});

