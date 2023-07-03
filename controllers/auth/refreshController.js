import Joi from 'joi'
import { refreshToken, User } from '../../models/index.js'
import CustomErrorHandler from '../../services/CustomErrorHandler.js'
import Jwtservice from '../../services/JwtService.js'
import { REFRESH_SECRETKEY } from '../../config/index.js'


const refreshController = {
    async refresh(req, res, next) {

        // Validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        })
        // console.log(req.body);

        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        // check in Database token

        let RefreshToken;

        try {
            RefreshToken = await refreshToken.findOne({ token: req.body.refresh_token })

            if (!RefreshToken) {
                return next(CustomErrorHandler.unauthorized('Invalid Refresh Token.....!'))
            }

            // token Verify
            let userId;
            try {
                const { _id } = await Jwtservice.verify(RefreshToken.token, REFRESH_SECRETKEY);

                userId = _id;
            } catch (err) {
                return next(CustomErrorHandler.unauthorized('Invalid Refresh Token.....!'))
            }

            const user = User.findOne({ _id: userId });
            if (!user) {
                return next(CustomErrorHandler.unauthorized('No User Found.....!'))
            }

            const access_token = Jwtservice.sign({ _id: user._id, role: user.role })

            const refresh_token = Jwtservice.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRETKEY)

            // database list

            await refreshToken.create({ token: refresh_token })

            res.json({ access_token: access_token, refresh_token: refresh_token })
            
        } catch (err) {
            return next(new Error('Something went Wrong.....' + err.message))
        }

    }
}

export default refreshController;