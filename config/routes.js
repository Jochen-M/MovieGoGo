let Index = require('../app/controllers/index');
let User = require('../app/controllers/user');
let Movie = require('../app/controllers/movie');
let Comment = require('../app/controllers/comment');
let Category = require('../app/controllers/category');

module.exports = function(app) {
	// pre handle user
	app.use(function(req, res, next){
		let _user = req.session.user;
		app.locals.user = _user;
		next();
	});

	// Index
	app.get('/', Index.index);

	// User
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/signup', User.showSignup);
	app.get('/signin', User.showSignin);
	app.get('/logout', User.logout);
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);

	// Movie
	app.post('/admin/movie/save', User.signinRequired, User.adminRequired, Movie.save);
	app.get('/movie/:id', Movie.detail);
	app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
	app.delete('/admin/movie/delete', User.signinRequired, User.adminRequired, Movie.delete);

	// Comment
	app.post('/user/comment', User.signinRequired, Comment.save);

	// Category
	app.post('/admin/category/save', User.signinRequired, User.adminRequired, Category.save);
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
};