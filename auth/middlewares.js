const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");

/* Authenticate a user by verifing a token if provided. If a token is valid, the userId would be saved to res.locals. 
No error if no token is provided or user provided a non-valid token. */
function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, process.env.SECRET_KEY);
        }
        return next();
    } catch (e) {
        return next(e);
    }
}

/* Middleware to use when user must be logged in. */
function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError("Not logged in.");
        return next();
    } catch (e) {
        return next(e);
    }
}

/* Middleware to use when a user must provide a valid token */

function ensureCorrectUser(req, res, next) {
    try {
        const user = res.locals.user;
        console.log(user);
        if (!(user && user.id === req.params.id)) {
            throw new UnauthorizedError("Not correct user.");
        }
        return next();
    } catch (e) {
        return next(e);
    }
}

module.exports = { authenticateJWT, ensureLoggedIn, ensureCorrectUser };
