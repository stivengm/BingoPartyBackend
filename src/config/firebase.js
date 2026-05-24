import dotenv from 'dotenv';

dotenv.config();

import admin from 'firebase-admin';

import serviceAccount from '../../serviceAccountKey.json' with { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

    databaseURL: process.env.FIREBASE_DB
});

const db = admin.database();

export default db;