const express = require('express');
const stylus = require('stylus');
const nib = require('nib');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;


if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });
} else {
  const app = express();

	function compile(str, path) {
		return stylus(str)
			.set('filename', path)
			.use(nib())
	};

	app.set('views', __dirname + '/views');
	app.set('view engine', 'pug');

	app.use(stylus.middleware(
			{
				src: __dirname + '/public',
				compile: compile
			}
		)
	);
	app.use(express.static(__dirname + '/public'));

	app.get('/', function (req, res) {
		res.render('index', {title: 'Inicio'})
	});

	app.get('/2020-03-22-consejos-en-tiempos-de-sars-coronavirus-2', function (req, res) {
		res.render('2020-03-22-consejos-en-tiempos-de-sars-coronavirus-2', {title: 'Consejos en Tiempos de SARS Coronavirus 2'})
	});

	app.listen(PORT);
}