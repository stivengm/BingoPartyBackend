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
        status
    });

    const updatedSnapshot = await roomRef.once('value');

    return updatedSnapshot.val();

};

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

export const generateBallService = async (roomId, playerId) => {

    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once('value');

    if (!snapshot.exists()) {
        throw new Error('Sala no encontrada');
    }

    const room = snapshot.val();

    const player = room.players?.[playerId];

    if (!player?.isHost) {
        throw new Error('Solo el host puede generar bolitas');
    }

    const calledBalls = room.calledBalls || {};

    const usedNumbers = Object.values(calledBalls).map(ball => ball.number);

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

    // Guardar bolita actual
    await roomRef
        .child('currentBall')
        .set(ball);

    // Guardar historial manteniendo orden cronológico
    await roomRef
        .child('calledBalls')
        .push(ball);

    return ball;

};