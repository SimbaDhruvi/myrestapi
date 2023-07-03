import express from "express";

const router = express.Router();

import { registerController, loginController, userController, refreshController, productController } from "../controllers/index.js";

import userauth from '../middlewares/userauth.js';
import admin from "../middlewares/admin.js";

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', userauth, userController.me);
router.post('/refreshtoken', refreshController.refresh);
router.post('/logout', userauth, loginController.logout);

router.post('/product', [userauth, admin], productController.store);
router.put('/product/:id', [userauth, admin], productController.update)
router.delete('/product/:id', [userauth, admin], productController.destroy)
router.get('/product', productController.index)
router.get('/product/:id', productController.show)



export default router;