this.Todos = new Mongo.Collection("todos");

this.Todos.userCanInsert = function(userId, doc) {
	return true;
}

this.Todos.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
}

this.Todos.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
}
