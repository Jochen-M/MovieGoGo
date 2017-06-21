let User = require('../models/user');

// Routes for user
exports.showSignup = function(req, res){
	res.render('signup', {
		title: "注册"
	});
};

exports.showSignin = function(req, res){
	res.render('signin', {
		title: "登录"
	});
};

exports.signup = function(req, res){
	let _user = req.body.user;

	User.find({name: _user.name}, function(err, user){
		if(err){
			console.log(err);
		}

		if(user.length > 0){
			return res.redirect("/signin");
		}else{
			let user = new User(_user);

			user.save(function(err, user){
				if(err){
					console.log(err);
				}

				res.redirect('/');
			});
		}
	});
};

exports.signin = function(req, res){
	let user_form = req.body.user;
	let name = user_form.name;
	let password = user_form.password;

	User.findOne({name: name}, function(err, _user){
		if(err){
			console.log(err);
		}

		if(!_user){
			return res.redirect('/signup');
		}

		let user = new User(_user);	
		user.verifyPassword(password, function(err, isMatch){
			if(err){
				console.log(err);
			}

			if(isMatch){
				//console.log("Password is matched");
				req.session.user = user;
				return res.redirect('/');
			}else{
				//console.log("Password is not matched");
				return res.redirect('/signin');
			}
		});
	});
};

exports.logout = function(req, res){
	delete req.session.user;
	//delete app.locals.user;
	res.redirect('/');
};

exports.list = function(req, res){
	User.fetch(function(err, users){
		if(err){
			console.log(err);
		}

		res.render('userlist', {
			title: '用户列表页',
			users: users
		});
	})
};

// middleware for user
exports.signinRequired = function(req, res, next){
	let user = req.session.user;

	if(!user){
		res.redirect('/signin');
	}

	next();
};

exports.adminRequired = function(req, res, next){
	let user = req.session.user;

	if(user.role <= 10){
		res.redirect('/signin');
	}

	next();
};