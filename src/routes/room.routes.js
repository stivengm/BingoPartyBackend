import express from 'express';

import {
    createRoom,
    joinRoom,
    getRoom,
    updateRoom,
    generateBall
} from '../controllers/room.controller.js';

const router = express.Router();

router.post('/create', createRoom);
router.post('/join', joinRoom);
router.get('/:id', getRoom);
router.post('/update', updateRoom);
router.post('/generateBall', generateBall);

export default router;