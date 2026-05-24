import express from 'express';

import {
    createRoom,
    joinRoom,
    getRoom
} from '../controllers/room.controller.js';

const router = express.Router();

router.post('/create', createRoom);
router.post('/join', joinRoom);
router.get('/:id', getRoom);

export default router;