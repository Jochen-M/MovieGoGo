let mongoose = require('mongoose');
let bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

let UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	role: {
		// 0 - normal user
		// 1 - verified user
		// 2 - professional user
		// ...
		// >10 - admin
		// >50 - super admin
		type: Number,
		default: 51
	},
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

UserSchema.pre('save', function(next){
	let user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err);
		
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err) return next(err);

			user.password = hash;
			next();
		})
	});
});

UserSchema.methods = {
	verifyPassword: function(_password, cb){
		bcrypt.compare(_password, this.password, function(err, isMatch){
			if(err){
				return cb(err);
			}
			cb(null, isMatch);
		});
	}
};

UserSchema.statics = {
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

module.exports = UserSchema