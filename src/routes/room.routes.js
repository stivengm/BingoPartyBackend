import express from 'express';

import {
    createRoom,
    joinRoom,
    getRoom,
    updateRoom,
    generateBall,
    pauseRoom
} from '../controllers/room.controller.js';

const router = express.Router();

router.post('/create', createRoom);
router.post('/join', joinRoom);
router.get('/:id', getRoom);
router.post('/update', updateRoom);
router.post('/pause', pauseRoom);
router.post('/generateBall', generateBall);

export default router;