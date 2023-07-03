import Joi from 'joi';
import { User, refreshToken } from '../../models/index.js'
import bcrypt from 'bcrypt'
import CustomErrorHandler from '../../services/CustomErrorHandler.js';
import Jwtservice from '../../services/JwtService.js'
import { REFRESH_SECRETKEY } from '../../config/index.js'

const loginController = {
    async login(req, res, next) {

        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,20}$')).required()
        })
        // console.log(req.body);

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }


        // validation in email database

        try {
            const user = await User.findOne({ email: req.body.email })

            if (!user) {
                return next(CustomErrorHandler.wrongcredentials());
            }

            // compare password
            const match = await bcrypt.compare(req.body.password, user.password);

            if (!match) {
                return next(CustomErrorHandler.wrongcredentials());
            }
            // Create JWT TOken

            const access_token = Jwtservice.sign({ _id: user._id, role: user.role })

            const refresh_token = Jwtservice.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRETKEY)

            // database list

            await refreshToken.create({ token: refresh_token })

            res.json({ access_token: access_token, refresh_token: refresh_token })

        } catch (err) {
            return next(err);
        }
    },

    async logout(req, res, next) {
        // Validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        })
        // console.log(req.body);

        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            await refreshToken.deleteOne({token: req.body.refresh_token})

        } catch (err) {
            return next(new Error());
        }
        res.json({status:1})
    }
}

export default loginController;

