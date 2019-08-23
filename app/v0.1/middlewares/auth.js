const dotenv = require('dotenv').config()
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const {
    ExtractJwt
} = require('passport-jwt')
const User = require('../models/user-model')
const config = require('../../../config')[process.env.NODE_ENV]
const GoogleToken = require('passport-google-token').Strategy
const randomize = require('randomatic');

/**
 * USER
 * Access for role: ROLE_USER
 */
passport.use('user', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.SECRET_TOKEN,
}, async(payload, done) => {
    try {
    
        const user = await User.findOne({
            _id: payload.id,
            role: "ROLE_USER"
        })

        if (!user) {
            return done(null, false)
        }

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

const authUser = passport.authenticate('user', {
    session: false,
})

/**
 * COMPANY
 * Access for role: ROLE_COMPANY
 */
passport.use('company', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.SECRET_TOKEN,
}, async(payload, done) => {
    try {
        const user = await User.findOne({
            _id: payload.id,
            role: "ROLE_COMPANY"
        })

        if (!user) {
            return done(null, false)
        }

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

const authCompany = passport.authenticate('company', {
    session: false,
})

/**
 * Access for both roles
 */
passport.use('all', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.SECRET_TOKEN,
}, async(payload, done) => {
    try {
        const user = await User.findOne({
            _id: payload.id
        })
        if(!user) {
            return done(null, false)
        }
        done(null, user)
    } catch(error) {
        done(error, false)
    }
}))

const authAll = passport.authenticate('all', {
    session: false
})

/**
 * Access with Google OAuth2
 */

passport.use(new GoogleToken({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET
  },
  function(accessToken, refreshToken, profile, done) {
   User.findOne({googleId: profile.id}) 
        .then(user => {
            if(user) {
                return done(null, user);
            }else {
                let newUserData = {
                    name: profile._json.name,
                    email: profile._json.email,
                    password: 'Prueba1',
                    googleId: profile.id,
                    role: "ROLE_USER"
                }
                let newUser = new User(newUserData)
                newUser.save()
                    .then(() => {
                        done(null, newUser)
                    })
                    .catch(error => {
                        done(error, false)
                    })
            }
        })
        .catch(error => {
            done(error, false)
        })
  }
));

const googleAuth = passport.authenticate('google-token', {
    session: false
})

module.exports = {
    authUser,
    authCompany,
    authAll,
    googleAuth
}