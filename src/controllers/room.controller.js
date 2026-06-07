import {
    createRoomService,
    joinRoomService,
    getRoomService,
    updateRoomService,
    generateBallService,
    updateRoomServiceUser
} from '../services/room.service.js';

import {
    successResponse,
    errorResponse
} from '../utils/response.js';
import { logger } from '../utils/logs.js';

export const createRoom = async (req, res) => {
    try {
        logger.info('INICIO DE SERVICIO - CREATEROOM');

        const { hostName, gameBoardType, secondsBalls, gameType, avatar } = req.body;
        
        logger.info('REQUEST', req.body);

        if (!hostName || !gameBoardType || !secondsBalls || !gameType || !avatar) {
            logger.warn('PETICIÓN FALLIDA');
            logger.warn('HACE FALTA INFORMACIÓN EN LA PETICIÓN');
            logger.warn('FIN PROCESO');
            return errorResponse(res, {
                httpCode: 400,
                code: "CR002",
                message: 'Hace falta información en la petición'
            });
        }

        const room = await createRoomService(hostName, gameBoardType, secondsBalls, gameType, avatar);

        logger.info('SALA CREADA CORRECTAMENTE');
        logger.info('FIN PROCESO');
        return successResponse(res, {
            httpCode: 201,
            code: "CR001",
            message: 'Sala creada correctamente',
            data: room
        });
    } catch (error) {
        logger.error('HA OCURRIDO UN ERROR INTERNO', error);
        logger.error('FIN PROCESO');
        return errorResponse(res, {
            code: "CR003",
            message: error.message
        });
    }
};

export const joinRoom = async (req, res) => {
    try {
        logger.info('INICIO DE SERVICIO - JOINROOM');
        
        const { roomId, playerName, avatar } = req.body;
        
        logger.info('REQUEST', req.body);

        if (!roomId || !playerName || !avatar) {
            logger.warn('PETICIÓN FALLIDA');
            logger.warn('HACE FALTA INFORMACIÓN EN LA PETICIÓN');
            logger.warn('FIN PROCESO');
            return errorResponse(res, {
                httpCode: 400,
                code: "JR002",
                message: 'Hace falta información en la petición'
            });
        }

        const response = await joinRoomService(roomId, playerName, avatar);

        logger.info('USUARIO INGRESADO A LA SALA CORRECTAMENTE');
        logger.info('FIN PROCESO');
        return successResponse(res, {
            httpCode: 200,
            code: "JR001",
            message: 'Usuario ingresado correctamente',
            data: response
        });
    } catch (error) {
        logger.error('HA OCURRIDO UN ERROR INTERNO', error);
        logger.error('FIN PROCESO');
        return errorResponse(res, {
            httpCode: 500,
            code: "JR003",
            message: error.message
        });
    }
};

export const updateRoom = async (req, res) => {
    try {
        logger.info('INICIO DE SERVICIO - UPDATEROOM');

        const { roomId, playerId, status } = req.body;

        logger.info('REQUEST', req.body);

        if (!roomId || !playerId || !status) {
            logger.warn('PETICIÓN FALLIDA');
            logger.warn('HACE FALTA INFORMACIÓN EN LA PETICIÓN');
            logger.warn('FIN PROCESO');
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

        logger.info('SALA ACTUALIZADA CORRECTAMENTE');
        logger.info('FIN PROCESO');
        return successResponse(res, {
            httpCode: 200,
            code: "UR001",
            message: 'Sala actualizada correctamente',
            data: room
        });

    } catch (error) {
        logger.error('HA OCURRIDO UN ERROR INTERNO', error);
        logger.error('FIN PROCESO');
        return errorResponse(res, {
            httpCode: 500,
            code: "UR003",
            message: error.message
        });
    }
};

export const pauseRoom = async (req, res) => {
    try {
        logger.info('INICIO DE SERVICIO - PAUSEROOM');

        const { roomId, playerId, status, board } = req.body;

        logger.info('REQUEST', req.body);

        if (!roomId || !playerId || !status || !board) {
            logger.warn('PETICIÓN FALLIDA');
            logger.warn('HACE FALTA INFORMACIÓN EN LA PETICIÓN');
            logger.warn('FIN PROCESO');
            return errorResponse(res, {
                httpCode: 400,
                code: "UR002",
                message: 'Hace falta información en la petición'
            });
        }

        const room = await updateRoomServiceUser(
            roomId,
            playerId,
            status,
            board
        );

        logger.info('SALA ACTUALIZADA CORRECTAMENTE');
        logger.info('FIN PROCESO');

        return successResponse(res, {
            httpCode: 200,
            code: "UR001",
            message: 'Sala actualizada correctamente',
            data: room
        });

    } catch (error) {
        logger.error('HA OCURRIDO UN ERROR INTERNO', error);
        logger.error('FIN PROCESO');
        return errorResponse(res, {
            httpCode: 500,
            code: "UR003",
            message: error.message
        });
    }
};

export const getRoom = async (req, res) => {
    try {
        logger.info('INICIO DE SERVICIO - GETROOM');

        const { id } = req.params;

        logger.info('REQUEST', req.body);

        const room = await getRoomService(id);

        logger.info('SALA OBTENIDA CORRECTAMENTE');
        logger.info('FIN PROCESO');
        return successResponse(res, {
            httpCode: 200,
            code: "GR001",
            message: 'Sala obtenida correctamente',
            data: room
        });
    } catch (error) {
        logger.error('HA OCURRIDO UN ERROR INTERNO', error);
        logger.error('FIN PROCESO');
        return res.status(404).json({
            message: error.message
        });
    }
};

export const generateBall = async (req, res) => {
    try {
        logger.info('INICIO DE SERVICIO - GENERATEBALL');
        const { roomId, playerId } = req.body;

        logger.info('REQUEST', req.body);

        if (!roomId || !playerId) {
            logger.warn('PETICIÓN FALLIDA');
            logger.warn('HACE FALTA INFORMACIÓN EN LA PETICIÓN');
            logger.warn('FIN PROCESO');
            return errorResponse(res, {
                httpCode: 400,
                code: "GB002",
                message: 'Hace falta información'
            });
        }

        const ball = await generateBallService(
            roomId,
            playerId
        );

        logger.info(`BOLITA GENERADA CORRECTAMENTE EN LA ROOM ${roomId}`);
        logger.info('FIN PROCESO');
        return successResponse(res, {
            httpCode: 200,
            code: "GB001",
            message: 'Bolita generada',
            data: ball
        });
    } catch (error) {
        logger.error('HA OCURRIDO UN ERROR INTERNO', error);
        logger.error('FIN PROCESO');
        return errorResponse(res, {
            httpCode: 200,
            code: "GB003",
            message: error.message
        });
    }
};