let mongoose = require('mongoose');

let MovieSchema = new mongoose.Schema({
	title: String,
	director: String,
	country: String,
	language: String,
	poster: String,
	flash: String,
	summary: String,
	showAt: Number,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()	
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

MovieSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

MovieSchema.statics = {
	fetch: function(callback){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(callback);
	},
	findById: function(id, callback){
		return this
			.findOne({_id: id})
			.exec(callback);
	}
};

module.exports = MovieSchema