// import express framework
const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/nodekb', (err) => {
    if(err) throw err;
    
    console.log('connected to nodekb database')
})
let db = mongoose.connection;

// // check for db connection
// db.once('open', () => {
    
// })

// // check for db errors
// db.on('error', (err) => {
//     console.log(err)
// })

// Bring in models
let Article = require('./models/article')

// body-parser Middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// use static files
app.use(express.static(path.join(__dirname, 'public')));

//root route 
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

// route to add an article 
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        text: "Add Article" 
    })
})

// route to see specifics of just one route
app.get('/articles/:id', (req, res) => {
    let id = req.params.id
    Article.findById(id, (err, article) => {
        if (err) {
            console.log(err)
            return;
        } else {
            res.render('article', {
                text: "Article Details",
                article   
            })
        }
    })
})

app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.Author = req.body.author;
    article.body = req.body.body;

    article.save((err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/')
        }
    })
    
})

// set the view for the app
app.set('views', path.join(__dirname, 'views'))
// set the view or template engine
app.set('view engine', 'pug');

// start app on port 3000
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})