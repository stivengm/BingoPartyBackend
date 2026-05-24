import express from 'express';
import cors from 'cors';

import roomRoutes from './routes/room.routes.js';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));

app.use(express.json());

app.use('/rooms', roomRoutes);

app.get('/', (req, res) => {

    res.json({
        message: 'Bingo backend funcionando'
    });
});

export default app;