import jwt from "jsonwebtoken";

function auth(req,res,next) {
    const jwtToken = req.headers.Authorization;
    if(!jwtToken) {
        return res.status(401).send('Forbidden access, we need a valid token.');
    }
    try{
        req.user = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT);
        next();
    }catch (e) {
        res.status(400).send('Forbidden access, invalid token.')
    }
}

export default auth;