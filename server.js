var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'Walk the Slinky out',
	completed: false
}, {
	id: 3,
	description: 'Do the stuff you need to do',
	completed: true
}];

app.get('/', function (req, res) {
	res.send('Todo API Root');	
});

app.get('/todos', function (req, res) {
	var response = { todos : todos };
	res.json(response);
});

app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	console.log(todoId);

	var matchedTodo;

	todos.forEach(function (todo) {
		if(todoId === todo.id) {
			matchedTodo = todo;
		}
	});

	if(matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '.');	
});