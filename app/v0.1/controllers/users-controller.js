const Users = require("../models/user-model");
const authJWT = require("../helpers/jwt");

const responseToken = (user) => {
    let dataToken = authJWT.createToken(user);
    let userResponse = {
        access_token: dataToken[0],
        refresh_token: authJWT.createRefreshToken(user),
        expires_in: dataToken[1],
        role: user.role
    };
    return userResponse;
}

const signUp = (req, res) => {
    // Save new user
    Users.create(req.body)
        .then(user => res.status(200).send(responseToken(user)))
        .catch(err => {
            console.log(err)
            return res.status(400).send(err);
        });
}

const logIn = (req, res) => {
    if (req.body.password && req.body.email) {
        Users.findOne({
                email: req.body.email
            })
            .select("_id password")
            .exec((err, userResult) => {
                if (err || !userResult) {
                    return res.status(401).send({ error: "LoginError" });
                }
                userResult.comparePassword(req.body.password, userResult.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        return res.status(200).send(responseToken(userResult))
                    } else {
                        return res.status(401).send({ error: "LoginError" });
                    }
                });

            });
    } else {
        return res.status(401).send({ error: "BadRequest" });
    }
}

const loginGoogle = (req, res) => {
    return Users.findOne({googleId: req.body.googleId})
        .then(user => res.status(200).send(responseToken(user)))
        .catch(err => res.status(400).send(err))
}

module.exports = {
    signUp,
    logIn,
    loginGoogle
}