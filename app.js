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
  		handle: 'arbol-de-la-vida',
  		titulo: 'El Árbol de la Vida',
      autor: 'El Estocástico',
  		descripcion: '¿Conoces la diversidad biológica de nuestro planeta?',
  		fecha: '15 Noviembre 2020',      
      tags: 'biología'
  	}  	
  ];	

	function compile(str, path) {
		return stylus(str)
			.set('filename', path)
			.use(nib())
	};

	app.set('views', [path.join(__dirname, 'views')]);
	app.set('view engine', 'pug');

	app.use(stylus.middleware(
			{
				src: __dirname + '/public',
				compile: compile
			}
		)
	);
  
	app.use(express.static(__dirname + '/public'));

	app.get('/', (req, res) => {
		res.render('index', {posts});
	});

	app.get('/posts/:handle', (req, res) => {
		res.render(`posts/${req.params.handle}`);
	});

	app.listen(PORT, () => {
    console.log(`Servidor web iniciado en puerto ${PORT}`)
  });
}