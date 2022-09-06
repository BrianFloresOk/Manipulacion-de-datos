const db = require('../database/models');
const sequelize = db.sequelize;
const {validationResult} = require('express-validator');
const { response } = require('express');

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render('moviesAdd')
    },

    create: function (req, res) {
        let errors = validationResult(req)
        if(errors.isEmpty()) {
            const {title, rating, release_date, awards, length} = req.body
            db.Movie.create({
                title,
                rating,
                release_date,
                awards,
                length
            })
            .then(() => res.redirect("/movies"))
            .catch(error => res.send(error))
        } else {
                res.send(errors)
            }
        
    },

    edit: function(req, res) {
        db.Movie.findByPk(req.params.id)
        .then(movie => res.render('moviesEdit', {Movie: movie}))
        .catch(error => res.send(error))
    },

    update: function (req,res) {
        let errors = validationResult(req);

        if(errors.isEmpty()) 
        {
            const {title, rating, release_date, awards, length} = req.body
            db.Movie.update({
                title,
                rating,
                release_date,
                awards,
                length

            }, {
                where: {
                    id: req.params.id
                }
            })
            .then((response) => {
                if(response) {
                    res.redirect('/movies')
                } else {
                    res.send('No se pudo actualizar')
                }
            })
            .catch((errors)=> res.send(errors))
        }
    },

    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => res.render('moviesDelete', {Movie: movie}))
            .catch(error => res.send(error))
    },

    destroy: function (req, res) {
        db.Movie.destroy({
            where: req.params.id
        })
        .then((result) => res.redirect('/movies'))
        .catch(error => res.send(error))
    }

}

module.exports = moviesController;