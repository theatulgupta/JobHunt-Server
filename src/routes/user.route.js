import { login, logout, register, updateProfile } from '../controllers/user.controller.js';

import express from 'express';
import isAuthenticated from '../middlewares/auth.middleware.js';
import { singleUpload } from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.route('/register').post(singleUpload, register);
userRouter.route('/login').post(login);
userRouter.route('/profile/update').put(isAuthenticated, singleUpload, updateProfile);
userRouter.route('/logout').get(logout);

export default userRouter;
