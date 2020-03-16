const express = require('express');
const stylus = require('stylus');
const nib = require('nib');

const app = express();

function compile(str, path) {
	return stylus(str)
		.set('filename', path)
		.use(nib())
};

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(stylus.middleware(
		{
			src: __dirname + '/public',
			compile: compile
		}
	)
);

app.get('/', function (req, res) {
	res.render('index', {title: 'Home'})
});

app.listen(3000);