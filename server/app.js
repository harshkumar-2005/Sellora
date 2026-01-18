import express, { urlencoded } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();

// Database connection 
import connectDB from './db/connect.js';
let url = process.env.MONGO_URL;
connectDB(url);

// Import Routes
import authRoutes from './routes/authRoutes.js'

const app = express();

// Middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
    cors({
        origin: `http://localhost:5173`,
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    })
);

// Routes

// Auth
app.use('/v1/api/auth', authRoutes);


// Health
app.get('/v1/api/health', (req, res) => {
    res.status(200).send({
        "sucess": true,
        "message": "Health check Good"
    })
})

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
})