export const successResponse = (
    res,
    {
        httpCode = 200,
        code = '',
        message = '',
        data = {}
    }
) => {
    return res.status(httpCode).json({
        code,
        message,
        data
    });
};

export const errorResponse = (
    res,
    {
        httpCode = 500,
        code = '',
        message = '',
        data = []
    }
) => {
    return res.status(httpCode).json({
        code,
        message,
        data
    });
};