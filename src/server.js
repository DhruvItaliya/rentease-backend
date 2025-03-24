import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connect from './configs/connection.js'
import envConfig from './configs/envConfig.js';
import { globalErrorHandler } from './services/common.service.js';
import indexRoutes from './routes/index.js'

envConfig();
const app = express();
const PORT = process.env.PORT || 5000;

// db connection
connect();

// app.use('/src',express.static('src'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.React_API,'http://192.168.29.228:5173'],
    credentials:true
}));

app.use('/api', indexRoutes);

app.use(globalErrorHandler);

// server starting
app.listen(PORT, () => {
    console.log(`listening from port ${PORT}`);
})