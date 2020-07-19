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

  const posts = [
  	{
  		handle: 'reflexiones-sobre-el-covid19',
  		titulo: 'Reflexiones sobre el Covid19',
  		descripcion: 'En este post presento pensamientos acerca del entorno que ha rodeado al Covid19', 
  		fecha: '01 Julio 2020'
  	},
  	{
  		handle: 'el-arbol-de-la-vida',
  		titulo: 'El Árbol de la Vida',
  		descripcion: '¿Cuál es la diversidad presente en nuestro mundo? Descúbrela aquí',
  		fecha: '07 Julio 2020'
  	},
  	{
  		handle: 'proximo-post-1',
  		titulo: 'proximo post 1',
  		descripcion: 'blabla',
  		fecha: 'soon'
  	},
  	{
  		handle: 'proximo-post-2',
  		titulo: 'proximo post 2',
  		descripcion: 'blabla',
  		fecha: 'soon'
  	}
  ]
	
	app.use(express.static(__dirname + '/public'));

	function compile(str, path) {
		return stylus(str)
			.set('filename', path)
			.use(nib())
	};

	app.use(stylus.middleware(
			{
				src: __dirname + '/public',
				compile: compile
			}
		)
	);

	app.set('views', [path.join(__dirname, 'views')]);
	app.set('view engine', 'pug');


	app.get('/', (req, res) => {
		res.render('index', {posts});
	});

	app.get('/posts/:handle', (req, res) => {
		res.render('posts/${req.params.handle}', {posts});
	});

	app.listen(PORT);
}