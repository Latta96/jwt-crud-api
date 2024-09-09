/**
 * @file userRoutes.js
 * @description Definizione delle routes relative ai dati
 * @version 1.0.0
 * @author Andrea Lattarulo
 */

import { getData, deleteData, createData, updateData } from '../controllers/dataController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export default async function dataRoutes(app) {
    app.post('/data', { onRequest: [authenticate] }, createData);
    app.get('/data/:key', { onRequest: [authenticate] }, getData);
    app.patch('/data/:key', { onRequest: [authenticate] }, updateData);
    app.delete('/data/:key', { onRequest: [authenticate] }, deleteData);
}