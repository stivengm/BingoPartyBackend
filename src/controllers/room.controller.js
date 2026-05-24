import {
    createRoomService,
    joinRoomService,
    getRoomService,
    updateRoomService
} from '../services/room.service.js';

import {
    successResponse,
    errorResponse
} from '../utils/response.js';

export const createRoom = async (req, res) => {

    try {
        const { hostName, gameBoardType, secondsBalls, gameType } = req.body;

        if (!hostName || !gameBoardType || !secondsBalls || !gameType) {
            return errorResponse(res, {
                httpCode: 400,
                code: "CR002",
                message: 'Hace falta información en la petición'
            });
        }

        const room = await createRoomService(hostName, gameBoardType, secondsBalls, gameType);

        return successResponse(res, {
            httpCode: 201,
            code: "CR001",
            message: 'Sala creada correctamente',
            data: room
        });
    } catch (error) {
        return errorResponse(res, {
            code: "CR003",
            message: error.message
        });
    }
};

export const joinRoom = async (req, res) => {

    try {
        const { roomId, playerName } = req.body;

        if (!roomId || !playerName) {
            return errorResponse(res, {
                httpCode: 400,
                code: "JR002",
                message: 'Hace falta información en la petición'
            });
        }

        const response = await joinRoomService(roomId, playerName);

        return successResponse(res, {
            httpCode: 200,
            code: "JR001",
            message: 'Usuario ingresado correctamente',
            data: response
        });
    } catch (error) {
        return errorResponse(res, {
            httpCode: 500,
            code: "JR003",
            message: error.message
        });
    }
};

export const updateRoom = async (req, res) => {
    try {
        const {
            roomId,
            playerId,
            status
        } = req.body;

        if (!roomId || !playerId || !status) {
            return errorResponse(res, {
                httpCode: 400,
                code: "UR002",
                message: 'Hace falta información en la petición'
            });
        }

        const room = await updateRoomService(
            roomId,
            playerId,
            status
        );

        return successResponse(res, {
            httpCode: 200,
            code: "UR001",
            message: 'Sala actualizada correctamente',
            data: room
        });

    } catch (error) {
        return errorResponse(res, {
            httpCode: 500,
            code: "UR003",
            message: error.message
        });
    }
};

export const getRoom = async (req, res) => {

    try {

        const { id } = req.params;

        const room = await getRoomService(id);

        return res.status(200).json(room);

    } catch (error) {

        return res.status(404).json({
            message: error.message
        });
    }
};