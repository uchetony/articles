const express = require('express');
const router = express.Router();
let Article = require('../models/article')


// route to add an article 
router.get('/add', (req, res) => {
    res.render('add_article', {
        text: "Add Article" 
    })
})

// ADD an article
router.post('/add', (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        res.render('add_article', {
            text: "Add Article",
            errors
        })
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.Author = req.body.author;
        article.body = req.body.body;
    
        article.save((err) => {
            if(err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Article added')
                res.redirect('/')
            }
        })
    }
})

// GET just one article
router.get('/:id', (req, res) => {
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

// route to update an article
router.get('/edit/:id', (req, res) => {
    let id = req.params.id
    Article.findById(id, (err, article) => {
        if (err) {
            console.log(err)
            return;
        } else {
            res.render('edit_article', {
                text: "Edit Article",
                article   
            })
        }
    })
})

// UPDATE an article
router.post('/edit/:id', (req, res) => {

    let article = {}
    article.title = req.body.title;
    article.Author = req.body.author;
    article.body = req.body.body;

    let query = { _id: req.params.id }

    Article.update(query, article, (err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Updated')
            res.redirect('/')
        }
    })
    
})

// DELETE an article
router.delete('/:id', (req, res) => {
    let query = { _id: req.params.id }

    Article.deleteOne(query, (err) => {
        if(err) {
            console.log(err)
        } else {
            res.send('success')
            req.flash('danger', 'Article Deleted')
        }
    })
})

module.exports = router;