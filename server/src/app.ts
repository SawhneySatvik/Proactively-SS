import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes';
import clientRoutes from './routes/clientRoutes';
import speakerRoutes from './routes/speakerRoutes';
import bookingRoutes from './routes/bookingRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/clients', clientRoutes);
app.use('/speakers', speakerRoutes);
app.use('/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Speaker Booking Platform!' });
});

export default app;

