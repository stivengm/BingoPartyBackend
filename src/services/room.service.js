import crypto from 'crypto';
import db from '../config/firebase.js';
import { generateRoomCode } from '../utils/generateRoomCode.js';

export const createRoomService = async (hostName, gameBoardType, secondsBalls, gameType) => {

    const roomCode = generateRoomCode();

    const roomData = {
        id: roomCode,
        status: 'waiting',
        createdAt: Date.now(),
        gameBoardType,
        secondsBalls,
        gameType,
        gameTypeName: gameType == 1 ? 'automatic' : 'manual',
        host: {
            id: crypto.randomUUID(),
            name: hostName
        },
        players: {}
    };

    roomData.players[roomData.host.id] = {
        id: roomData.host.id,
        name: hostName,
        isHost: true,
        joinedAt: Date.now()
    };

    await db.ref(`rooms/${roomCode}`).set(roomData);

    return roomData;
};

export const updateRoomService = async(roomId, hostId) => {

}

export const joinRoomService = async (roomId, playerName) => {

    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once('value');

    if (!snapshot.exists()) {
        throw new Error('Sala no encontrada');
    }

    const room = snapshot.val();
    const playerId = crypto.randomUUID();

    room.players[playerId] = {
        id: playerId,
        name: playerName,
        isHost: false,
        joinedAt: Date.now()
    };

    await roomRef.update({
        players: room.players
    });

    return {
        roomId,
        playerId
    };
};

export const getRoomService = async (roomId) => {

    const snapshot = await db.ref(`rooms/${roomId}`).once('value');

    if (!snapshot.exists()) {
        throw new Error('Sala no encontrada');
    }

    return snapshot.val();
};