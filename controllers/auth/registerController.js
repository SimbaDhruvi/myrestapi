import Joi from 'joi';
import { User, refreshToken } from '../../models/index.js'
import bcrypt from 'bcrypt'
import CustomErrorHandler from '../../services/CustomErrorHandler.js'
import Jwtservice from '../../services/JwtService.js'
import { REFRESH_SECRETKEY } from '../../config/index.js'

const registerController = {
    async register(req, res, next) {
        const registerSchema = Joi.object({

            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,20}$')).required(),
            repeat_password: Joi.ref('password')
        })
        // console.log(req.body);

        const { error } = registerSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        // Check if user is in the database already
        try {
            const exist = await User.exists({ email: req.body.email })
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This Email is already Exist...'));
            }
        } catch (err) {
            return next(err);
        }

        try {

            const exist = await User.exists({ email: req.body.email })
            if (exist) {
                return next();
            }
        } catch (err) {
            return next(err);
        }

        // Hash Password
        const hashpassword = await bcrypt.hash(req.body.password, 10);

        // Prepare the model

        const { name, email, password } = req.body;
        const user = new User(
            {
                name,
                email,
                password: hashpassword
            }
        )

        let access_token;
        let refresh_token;

        try {
            const result = await user.save();

            console.log(result);

            // JWT Token
            access_token = Jwtservice.sign({ _id: result._id, role: result.role })
            refresh_token = Jwtservice.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRETKEY)

            // database list

            await refreshToken.create({ token: refresh_token })

        } catch (err) {
            return next(err);
        }


        res.json({ access_token: access_token, refresh_token: refresh_token })
    }
}

export default registerController;