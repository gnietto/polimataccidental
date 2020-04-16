const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
const express = require('express');
const stylus = require('stylus');
const nib = require('nib');


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

	app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/2020/03'), path.join(__dirname, 'views/2020/04')]);
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

	app.get('/2020/03/22-reflexiones-en-tiempos-de-sars-coronavirus-2', function (req, res) {
		res.render('22-reflexiones-en-tiempos-de-sars-coronavirus-2', {title: 'Reflexiones Libres en Tiempos de COVID-19'})
	});

	app.get('/2020/03/31-aprendizaje-individual-y-organizacional', function (req, res) {
		res.render('31-aprendizaje-individual-y-organizacional', {title: 'Aprendizaje Individual & Aprendizaje Organizacional'})
	});

	app.get('/2020/04/07-formas-vida-semivida-presentes-nuestro-planeta-tierra', function (req, res) {
		res.render('07-formas-vida-semivida-presentes-nuestro-planeta-tierra', {title: 'El Árbol de la Vida en el Planeta Tierra'})
	});

	app.listen(PORT);
}