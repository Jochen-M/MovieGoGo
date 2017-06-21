let port = 3000;
let dbUrl = 'mongodb://127.0.0.1:27017/moviegogo';
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let mongoose = require('mongoose');
let mongoStore = require('connect-mongo')(session);
let path = require('path');
let logger = require('morgan');

mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

app.locals.moment = require('moment');
app.set('view engine', 'jade');
app.set('views', './app/views/pages');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: 'moviegogo',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

if( 'development' === app.get('env')){
	app.set('showStackError', true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}

require('./config/routes')(app);

app.listen(port);
console.log('MovieGoGo is running at http://localhost:' + port);