import { JWT_SECRETKEY } from '../config/index.js'
import jwt from 'jsonwebtoken'

class JwtService {

    static sign(payload, expiry = '60s', secret = JWT_SECRETKEY) {
        return jwt.sign(payload, secret, { expiresIn: expiry })
    }
    static verify(token, secret = JWT_SECRETKEY) {
        return jwt.verify(token, secret);
    }
}

export default JwtService;