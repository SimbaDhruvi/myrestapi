import CustomErrorHandler from '../services/CustomErrorHandler.js'
import JwtService from '../services/JwtService.js';

const userauth = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    // console.log(authHeader);

    // Token Valid
    if (!authHeader) {
        return next(CustomErrorHandler.unauthorized());
    }

    // Token Convert array 
    const token = authHeader.split(' ')[1];

    // console.log(token);

    // token Verify
    try {
        const { _id, role } = await JwtService.verify(token);

        const user = {
            _id,
            role
        }
        req.user = user;
        next();

    } catch (err) {
        return next(CustomErrorHandler.unauthorized());
    }
}

export default userauth;