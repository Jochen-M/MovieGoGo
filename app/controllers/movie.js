let Movie = require('../models/movie');
let Comment = require('../models/comment');
let _ = require('underscore');

// Routes for movie
exports.detail = function(req, res){
	let id = req.params.id;

	Movie.findById(id, function(err, movie){
		Comment
		.find({movie: id})
		.populate('from', 'name')
		.populate('reply.from reply.to', 'name')
		.exec(function(err, comments){
			res.render('detail', {
				title: "" + movie.title,
				movie: movie,
				comments: comments
			});
		});
	});
};

exports.new = function(req, res){
	res.render('admin', {
		title: '后台录入页',
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
};

exports.save = function(req, res){
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

				res.redirect('/admin/movie/list');
			});
		});
	}else{
		_movie = new Movie({
			title: movieObj.title,
			director: movieObj.director,
			country: movieObj.country,
			language: movieObj.language,
			poster: movieObj.poster,
			flash: movieObj.flash,
			summary: movieObj.summary,
			showAt: movieObj.showAt
		});

		_movie.save(function(err){
			if(err){
				console.log(err);
			}

			res.redirect('/admin/movie/list');
		});
	}
};

exports.update = function(req, res){
	let id = req.params.id;

	if(id){
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title: '后台更新页',
				movie: movie
			});
		});
	}
};

exports.list = function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}

		res.render('list', {
			title: '列表页',
			movies: movies
		});
	})
};

exports.delete = function(req, res){
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
};