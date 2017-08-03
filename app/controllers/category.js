let Category = require('../models/category');

// Routes for category
exports.new = function(req, res){
	res.render('admin_category', {
		title: '后台分类录入页',
		category: {}
	});
};

exports.save = function(req, res){
	let _category = req.body.category;
	let category = new Category(_category);

	category.save(function(err){
		if(err){
			console.log(err);
		}

		res.redirect('/admin/category/list');
	});
};

exports.list = function(req, res){
	Category.fetch(function(err, categories){
		if(err){
			console.log(err);
		}

		res.render('categorylist', {
			title: '分类列表页',
			categories: categories
		});
	})
};

exports.search = function(req, res){
	let catId = req.query.catId;
	let page = parseInt(req.query.page, 10) || 0;
	let perPage = 5;
	let index = (page - 1) * perPage;

	Category
		.find({_id: catId})
		.populate({
			path: 'movies',
			select: 'title poster'
		})
		.exec(function(err, categories){
			if(err){
				console.log(err);
			}
			let category = categories[0] || {};
			let movies = category.movies || [];
			let results = movies.slice(index, index + perPage);

			res.render('results', {
				title: '分类',
				query: 'catId=' + catId,
				keyword: category.name,
				currentPage: page,
				totalPage: Math.ceil(movies.length / perPage),
				movies: results
			});
		});
};
