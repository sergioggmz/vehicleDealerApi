function authorize(roles = []) {

    if(typeof roles === 'string') {
        roles = [roles]
    }
    return function(req,res,next) {

        if(!roles.includes(req.user.role)) {
            return res.status(403).send('Unauthorized, role not allowed to see the information')
        }
        next();
    }
}

export default authorize