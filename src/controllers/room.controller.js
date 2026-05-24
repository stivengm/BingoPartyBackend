import {
    createRoomService,
    joinRoomService,
    getRoomService
} from '../services/room.service.js';

import {
    successResponse,
    errorResponse
} from '../utils/response.js';

export const createRoom = async (req, res) => {

    try {
        const { hostName } = req.body;

        if (!hostName) {
            return errorResponse(res, {
                httpCode: 400,
                code: "CR002",
                message: 'El nombre es requerido'
            });
        }

        const room = await createRoomService(hostName);

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

        return res.status(200).json(response);
    } catch (error) {
        return errorResponse(res, {
            httpCode: 500,
            code: "JR003",
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