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
      handle: 'acerca-del-blog',
      titulo: 'Acerca del Presente Blog',
      autor: 'Polímata Accidental',
      descripcion: 'Ideas acerca del nombre del presente blog',
      fecha: '25 Diciembre 2020',
      tags: 'ideas'
    },
    {
      handle: 'historia-del-dinero',
      titulo: 'Historia del Dinero',
      autor: 'Polímata Accidental',
      descripcion: '(borrador)',
      fecha: '10 Diciembre 2020',      
      tags: 'economía'
    },
    {
      handle: 'chile-vuelve-ser-chile',
      titulo: 'Chile vuelve a ser Chile',
      autor: 'Hermógenes Pérez de Arce',
      descripcion: 'Una retrospectiva de largo plazo necesaria en tiempos de confusión política',
      fecha: '22 Noviembre 2020',      
      tags: 'política'
    },
  	{
  		handle: 'el-arbol-de-la-vida',
  		titulo: 'El Árbol de la Vida',
      autor: 'Polímata Accidental',
  		descripcion: 'Resumen de la diversidad biológica de nuestro planeta',
  		fecha: '15 Noviembre 2020',      
      tags: 'biología'
  	},
  	{
  		handle: 'acerca-del-covid19',
  		titulo: 'Acerca del Covid19',
      autor: 'Polímata Accidental',
  		descripcion: 'Evidencia reciente acerca del Covid19',
  		fecha: '10 Noviembre 2020',      
      tags: 'biología'
  	}
  ]
	

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