import { Product } from '../models/index.js';
// import Joi from 'joi';
import multer from 'multer';
import path from 'path';
import CustomErrorHandler from '../services/CustomErrorHandler.js';
import fs from 'fs';
import productSchema from '../Validators/ProductValidators.js';

const storage = multer.diskStorage({

    destination: (req, file, callback) => callback(null, 'upload/'),
    filename: (req, file, callback) => {

        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`

        callback(null, uniqueName)
    }
})

const handleMultipartfile = multer({ storage, limits: { fileSize: 1000000 * 50 } }).single('image')

const productController = {
    async store(req, res, next) {
        // multipart form data
        handleMultipartfile(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            console.log(req.file)

            const filepath = req.file.path;

            const { error } = productSchema.validate(req.body);

            if (error) {
                // Validation Fail(Delete the upload image)
                fs.unlink(`${AppRoot}/${filepath}`, () => {
                    return next(CustomErrorHandler.serverError(err.message));
                });
                return next(error);
            }
            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filepath
                });
            } catch (err) {
                return next(err);
            }
            res.json({ prodect_details: document });
        })
    },
    async update(req, res, next) {

        handleMultipartfile(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            console.log(req.file)

            let filepath;
            if (req.file) {
                filepath = req.file.path;
            }

            const { error } = productSchema.validate(req.body);

            if (error) {
                // Validation Fail(Delete the upload image)
                if (req.file) {
                    fs.unlink(`${AppRoot}/${filepath}`, () => {
                        return next(CustomErrorHandler.serverError(err.message));
                    });
                }
                return next(error);
            }
            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.findOneAndUpdate({ _id: req.params.id }, {
                    name,
                    price,
                    size,
                    image: filepath
                });
            } catch (err) {
                return next(err);
            }
            res.json({ prodect_details: document });
        })
    },
    async destroy(req, res, next) {
        const document = await Product.findByIdAndRemove({ _id: req.params.id });

        if (!document) {
            return next(new Error('Nothing to delete.....'));
        }

        // Image delete

        const imagePath = document._doc.image;

        fs.unlink(`${AppRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError());
            }
        })

        res.json(document);
    },
    async index(req, res, next) {
        let document;

        try {
            document = await Product.find().select('-updatedAt -__v').sort({ _id: 1 });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        res.json(document);
    },
    async show(req,res,next){
        let document;
        try{
            document = await Product.findOne({_id: req.params.id}).select('-updatedAt -__v');
        }catch(err){
            return next(err);
        }
        res.json(document);
    }
}

export default productController;