const jwt = require("jsonwebtoken");

/* sign and return the token */
function createToken(user) {
    let payload = { id: user.id };
    return jwt.sign(payload, process.env.SECRET_KEY);
    // return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
}

module.exports = { createToken };
