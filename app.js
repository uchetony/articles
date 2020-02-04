// IMPORTS
const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const expressValidator = require('express-validator')

// DATABASE CONFIG
mongoose.connect('mongodb://localhost/nodekb', (err) => {
    if(err) throw err;
    
    console.log('connected to nodekb database')
})
let db = mongoose.connection;

// MODELS
let Article = require('./models/article')


// MIDDLEWARES

// body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));

// express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
    cookie: {}
}))

// express messaging middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// use static files
app.use(express.static(path.join(__dirname, 'public')));


//   ROUTES

//  root route 
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err) {
            console.log(err)
        } else {
            res.render('index', {
                text: "Articles",
                articles
            })
        }
    })
})

// articles route
const articlesRoute = require('./routes/articlesRoute')
app.use('/articles', articlesRoute)


// APP VIEW SETTING
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');

// LAUNCH APP
// start app on port 3000
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})