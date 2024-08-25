import { login, logout, register, updateProfile } from '../controllers/user.controller.js';

import express from 'express';
import isAuthenticated from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/profile/update').put(isAuthenticated, updateProfile);
userRouter.route('/logout').get(logout);

export default userRouter;