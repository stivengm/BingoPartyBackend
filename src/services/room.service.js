import crypto from 'crypto';
import db from '../config/firebase.js';
import { generateRoomCode } from '../utils/generateRoomCode.js';
import { getLetter } from '../utils/getLetterBall.js';

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
            name: hostName,
            isHost: true
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

export const updateRoomService = async (roomId, playerId, status) => {
    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once('value');

    if (!snapshot.exists()) {
        throw new Error('Sala no encontrada');
    }

    const room = snapshot.val();
    const player = room.players?.[playerId];

    if (!player) {
        throw new Error('Jugador no encontrado');
    }

    if (status == "playing") {
        if (!player.isHost) {
            throw new Error('No tienes permisos para actualizar la sala');
        }
    }

    await roomRef.update({
        status,
    });

    const updatedSnapshot = await roomRef.once('value');

    return updatedSnapshot.val();

};

export const updateRoomServiceUser = async (roomId, playerId, status, board) => {
    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once('value');

    if (!snapshot.exists()) {
        throw new Error('Sala no encontrada');
    }

    const room = snapshot.val();
    const player = room.players?.[playerId];

    if (!player) {
        throw new Error('Jugador no encontrado');
    }

    const updateData = {
        status,
        playerLastUpdateGame: player,
        boardLastUpdateGame: board
    };

    if (status === 'paused') {
        updateData.pausedRemainingMs = room.nextBallAt
            ? Math.max(
                0,
                room.nextBallAt - Date.now()
            )
            : room.secondsBalls * 1000;

        updateData.nextBallAt = null;
    }

    if (status === 'playing') {
        updateData.nextBallAt = Date.now() + (room.pausedRemainingMs || room.secondsBalls * 1000);
        updateData.pausedRemainingMs = null;
    }

    await roomRef.update(updateData);
    const updatedSnapshot = await roomRef.once('value');
    return updatedSnapshot.val();
};

export const joinRoomService = async (roomId, playerName, avatar) => {

    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once('value');

    if (!snapshot.exists()) {
        throw new Error('Sala no encontrada');
    }

    const playerId = crypto.randomUUID();

    const player = {
        id: playerId,
        name: playerName,
        avatar,
        isHost: false,
        joinedAt: Date.now()
    };

    await roomRef
        .child(`players/${playerId}`)
        .set(player);

    const updatedSnapshot = await roomRef.once('value');

    const room = updatedSnapshot.val();

    return {
        ...room,
        player
    };
};

export const getRoomService = async (roomId) => {

    const snapshot = await db.ref(`rooms/${roomId}`).once('value');

    if (!snapshot.exists()) {
        throw new Error('Sala no encontrada');
    }

    return snapshot.val();
};

export const generateBallService = async (roomId, playerId) => {

    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once('value');

    if (!snapshot.exists()) {
        throw new Error('Sala no encontrada');
    }

    const room = snapshot.val();

    if (room.status === 'paused') {
        return {
            code: 'GB002',
            message: 'Juego pausado'
        };
    }

    const player = room.players?.[playerId];

    if (!player?.isHost) {
        throw new Error('Solo el host puede generar bolitas');
    }

    const calledBalls = room.calledBalls || {};

    const usedNumbers = Object.values(calledBalls)
        .map(ball => ball.number);

    const availableNumbers = [];

    for (let i = 1; i <= 75; i++) {
        if (!usedNumbers.includes(i)) {
            availableNumbers.push(i);
        }
    }

    if (availableNumbers.length === 0) {
        throw new Error('No hay más bolitas disponibles');
    }

    const randomIndex = Math.floor(
        Math.random() * availableNumbers.length
    );

    const number = availableNumbers[randomIndex];
    const letter = getLetter(number);
    const value = `${letter}${number}`;

    const ball = {
        letter,
        number,
        value,
        calledAt: Date.now()
    };

    // IMPORTANTE:
    // La próxima bola debería salir dentro de room.secondsBalls
    const nextBallAt = Date.now() + (room.secondsBalls * 1000);

    await roomRef.update({
        currentBall: ball,
        nextBallAt
    });

    await roomRef
        .child('calledBalls')
        .push(ball);

    return {
        ...ball,
        nextBallAt
    };

};