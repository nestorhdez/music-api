const router = require('express').Router();
const songsController = require('./controllers/songs-controller')
const userController = require('./controllers/users-controller')
const jwt = require('./helpers/jwt')
const pass = require('../v0.1/middlewares/auth')


/**
 * Songs
 */
router.get('/songs', pass.authUser, songsController.getSongs)
router.get('/songs/:id', songsController.getSongById)
router.post('/songs/', songsController.postSong)
router.patch('/songs/:id', songsController.editSong)
router.delete('/songs/:id', songsController.deleteSong)

/**
 * Users
 */
router.post('/signup', userController.signUp)
router.post('/login', userController.logIn)
router.post('/token', jwt.refreshToken)



module.exports = router