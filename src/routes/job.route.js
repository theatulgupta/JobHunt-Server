import { getAdminJobs, getJobById, getJobs, postJob } from '../controllers/job.controller.js';

import express from 'express';
import isAuthenticated from '../middlewares/auth.middleware.js';

const jobRouter = express.Router();

jobRouter.route('/post').post(isAuthenticated, postJob);
jobRouter.route('/get').get(isAuthenticated, getJobs);
jobRouter.route('/get-admin-jobs').get(isAuthenticated, getAdminJobs);
jobRouter.route('/get/:id').get(isAuthenticated, getJobById);

export default jobRouter;
