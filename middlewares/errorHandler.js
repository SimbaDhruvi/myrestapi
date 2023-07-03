import { DEBUG_MODE } from "../config/index.js";
import Joi from "joi";
const { ValidationError } = Joi;
import CustomErrorHandler from "../services/CustomErrorHandler.js";

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let errdata = {
        mess: "Internal Server Error......!",

        ...(DEBUG_MODE === 'true' && { originalError: err.message })

    }

    if (err instanceof ValidationError) {
        statusCode = 422;
        errdata = {
            mess: err.message
        }
    }

    if(err instanceof CustomErrorHandler){
        statusCode = err.status;
        errdata = {
            mess: err.message
        }
    }
    return res.status(statusCode).json(errdata);
}

export default errorHandler;