import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import slotsRouter from "./slots/route.js";
import { errorHandler } from './middleware/errorHandler.js';
import { initFirestore } from './config/firebase.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

initFirestore();

app.use('/api', slotsRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});