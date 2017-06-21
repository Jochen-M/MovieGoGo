let mongoose = require('mongoose');
let MovieSchema = require('../schemas/movie');
let Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie