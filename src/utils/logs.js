export const logger = {
    info: (message, data) => {
        console.info(`[INFO] ${message}`);
        if (data) console.info(JSON.stringify(data, null, 2));
    },
    error: (message, error) => {
        console.error(`[ERROR] ${message}`);
        if (error) console.error(error);
    },
    warn: (message, data) => {
        console.warn(`[WARN] ${message}`);
        if (data) console.warn(data);
    }
};