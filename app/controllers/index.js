let Movie = require('../models/movie');
let Category = require('../models/category');

// Routes for index
exports.index = function(req, res){
	Category
		.find({})
		.populate({path: 'movies', options: {limit: 5}})
		.exec(function(err, categories){
				if(err){
					console.log(err);
				}
				res.render('index', {
					title: '首页',
					categories: categories
				});
		})
};
