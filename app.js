const port = 3000;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let _ = require('underscore');
let path = require('path');
let Movie = require('./models/movie');;
app.locals.moment = require('moment');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/moviegogo');

app.set('view engine', 'jade');
app.set('views', './views/pages');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// index page
app.get('/', function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}

		res.render('index', {
			title: 'MovieGoGo 首页',
			movies: movies
		});
	})
});

// detail page
app.get('/movie/:id', function(req, res){
	let id = req.params.id;

	Movie.findById(id, function(err, movie){
		if(err){
			console.log(err);
		}

		res.render('detail', {
			title: 'MovieGoGo ' + movie.title,
			movie: movie
		});
	})
});

// admin new movie form page
app.get('/admin/movie', function(req, res){
	res.render('admin', {
		title: 'MovieGoGo 后台录入页',
		movie: {
			title: "",
			director: "",
			country: "",
			language: "",
			poster: "",
			flash: "",
			showAt: "",
			summary: ""
		}
	});
});

// admin new movie
app.post('/admin/movie/new', function(req, res){
	let id = req.body.movie._id;
	let movieObj = req.body.movie;
	let _movie;

	if(id != 'undefined'){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);

			_movie.save(function(err){
				if(err){
					console.log(err);
				}

				res.redirect('/admin/list');
			});
		});
	}else{
		_movie = new Movie({
			title: movieObj.title,
			director: movieObj.director,
			country: movieObj.country,
			language: movieObj.language,
			poster: '/images/sjbbb.jpg',	//movieObj.poster,
			flash: movieObj.flash,
			summary: movieObj.summary,
			showAt: movieObj.showAt
		});

		_movie.save(function(err){
			if(err){
				console.log(err);
			}

			res.redirect('/admin/list');
		});
	}
});

// admin update movie
app.get('/admin/update/:id', function(req, res){
	let id = req.params.id;

	if(id){
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title: 'imooc 后台更新页',
				movie: movie
			});
		});
	}
});

// list page
app.get('/admin/list', function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}

		res.render('list', {
			title: 'MovieGoGo 列表页',
			movies: movies
		});
	})
});

// admin delete page
app.delete('/admin/delete', function(req, res){
	let id = req.query.id;

	if(id){
		Movie.remove({_id: id}, function(err){
			if(err){
				console.log(err);
			}else{
				res.json({success: 1});
			}
		});
	}
});

app.listen(port);
console.log('MovieGoGo is running at http://localhost:' + port);