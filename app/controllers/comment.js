let Comment = require('../models/comment');

// Routes for comment
exports.save = function(req, res){
	let _comment = req.body.comment;
	let movieId = _comment.movie;

	if(_comment.cid){
		Comment.findById(_comment.cid, function(err, comment){
			let reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			};

			comment.reply.push(reply);

			comment.save(function(err, comment){
				if(err){
					console.log(err);
				}

				res.redirect('/movie/' + movieId);
			});
		});
	}else{
		let comment = new Comment(_comment);
		
		comment.save(function(err, comment){

			if(err){
				console.log(err);
			}

			res.redirect('/movie/' + movieId);	// 评论后返回当前电影
		});
	}
};