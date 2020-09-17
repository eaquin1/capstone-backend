/** Middleware to use when checking if the user has a valid Passport session
 * If not, raise unauthorized
 */

function authRequired(req, res, next) {
    try {
        if (req.session.passport.user) {
            console.log("authRequired");
            return next();
        }
        throw new Error();
    } catch (err) {
        let unauthorized = new Error("You must authenticate first.");
        unauthorized.status = 401; //401 Unauthorized
        return next(unauthorized);
    }
}

module.exports = authRequired;
