var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore')

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');	
});

app.get('/todos', function (req, res) {
	var response = { todos : todos };
	res.json(response);
});

app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, { id: todoId });

	if(matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

app.post('/todos', function (req, res) {
	var todo = _.pick(req.body, 'description', 'completed');

	if(!_.isBoolean(todo.completed) || !_.isString(todo.description) || todo.description.trim().length == 0) {
		return res.status(400).send();
	}

	todo.description = todo.description.trim();
	todo.id = todoNextId++;
	todos.push(todo);

	res.json(todo);
});

app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, { id: todoId });

	if(matchedTodo) {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	} else {
		res.status(404).json({
			error: 'No todo found with that id.'
		});
	} 
});

app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	console.log('PUT ' + todoId);

	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	var matchedTodo = _.findWhere(todos, { id: todoId });

	if(!matchedTodo) {
		console.log('The matchedTodo is null.')
		return res.status(400).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')) {
		console.log('The completed is null.')
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) &&
	 body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if(body.hasOwnProperty('description')) {
		console.log('The description is null.')		
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);

	res.json(matchedTodo);
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '.');	
});