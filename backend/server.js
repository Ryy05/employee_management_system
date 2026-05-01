import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import logRoutes from './routes/logRoutes.js';
import zoneRoutes from './routes/zoneRoutes.js';
import postingHistoryRoutes from './routes/postingHistoryRoutes.js';
import districtRoutes from './routes/districtRoutes.js';
import officeRoutes from './routes/officeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import reportsRoute from './routes/reportsRoute.js';

import cors from 'cors';

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
const allowedOrigins = [
  'http://localhost:3000',
  'https://employee-mgmt-system-kappa.vercel.app',
  'https://employee-mgmt-system-kf4my7klu-anands-projects-eb4bd129.vercel.app',
  'https://www.emstest.work.gd',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
}));

app.options('*', cors());


app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/postingHistory", postingHistoryRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/offices", officeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportsRoute);


app.get("/", (req, res) => {
    res.send("Server is up and running!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
