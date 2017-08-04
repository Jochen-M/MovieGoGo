let Movie = require('../models/movie');
let Comment = require('../models/comment');
let Category = require('../models/category');
let _ = require('underscore');
let fs = require('fs');
let path = require('path');

// Routes for movie
exports.detail = function(req, res){
	let id = req.params.id;

	Movie.update({_id: id}, {$inc: {pv: 1}}, function(err){
		if(err){
			console.log(err);
		}
	})

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
	Category.find({}, function(err, categories){
		res.render('admin', {
			title: '后台录入页',
			categories: categories,
			movie: {}
		})
	});
};

exports.save = function(req, res){
	let id = req.body.movie._id;
	let movieObj = req.body.movie;
	let _movie;

	if(req.newPosterName){
		movieObj.poster = req.newPosterName;
	}

	if(id){
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
		let categoryId = movieObj.category;
		let categoryName = movieObj.category_new;
		_movie = new Movie(movieObj);
		_movie.save(function(err, movie){
			if(err){
				console.log(err);
			}
			if(categoryId){
				Category.findById(categoryId, function(err, category){
					category.movies.push(movie._id);
					category.save(function(err, category){
						res.redirect('/admin/movie/list');
					});
				})
			}else if(categoryName){
				let category = new Category({
					name: categoryName,
					movies: [movie._id]
				});
				category.save(function(err, category){
					_movie.category = category._id;
					_movie.save(function(err, movie){
						res.redirect('/admin/movie/list');
					});
				});
			}
		});
	}
};

exports.update = function(req, res){
	let id = req.params.id;

	if(id){
		Movie.findById(id, function(err, movie){
			Category.find({}, function(err, categories){
				res.render('admin', {
					title: '后台更新页',
					movie: movie,
					categories: categories
				});
			});
		});
	}
};

exports.list = function(req, res){
	Movie
		.find({})
		.populate('category', 'name')
		.exec(function(err, movies){
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

exports.search = function(req, res){
	let keyword = req.query.keyword;
	let page = parseInt(req.query.page) || 1;
	let perPage = 5;
	Movie
		.find({title: new RegExp('.*' + keyword + '.*')}, function(err, movies){
			if(err){
				console.log(err);
			}
			res.render('results', {
				title: '分类',
				keyword: keyword,
				currentPage: page,
				totalPage: Math.ceil(movies.length / perPage),
				movies: movies
			})
		})
};

// middleware for movie
exports.posterUploaded = function(req, res, next){
	let posterData = req.files.uploadPoster;
	let filePath = posterData.path;
	let originalFilename = posterData.originalFilename;

	if(originalFilename){
		fs.readFile(filePath, function(err, data){
			let timestamp = Date.now();
			let type = posterData.type.split('/')[1];
			let newPosterName = timestamp + '.' + type;
			let newPath = path.join(__dirname, '../../public/images/' + newPosterName);

			fs.writeFile(newPath, data, function(err){
				req.newPosterName = '/images/' + newPosterName;
				next();
			})
		})
	}else{
		next();
	}
}
