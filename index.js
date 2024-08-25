import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import applicationRouter from './src/routes/application.route.js';
import companyRouter from './src/routes/company.route.js';
import jobRouter from './src/routes/job.route.js';
import userRouter from './src/routes/user.route.js';
import { connectDB } from './utils/db.js';

const app = express();

dotenv.config({});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;

app.use('/api/v1/user', userRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/application', applicationRouter);

app.listen(PORT, async () => {
  await connectDB(URI);
  console.log(`JobHunt started at http://localhost:${PORT} ✅`);
});
