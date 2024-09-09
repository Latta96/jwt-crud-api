/**
 * @file userRoutes.js
 * @description Definizione delle routes relative agli utenti
 * @version 1.0.0
 * @author Andrea Lattarulo
 */

import { registerUser, loginUser, deleteUser } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export default async function userRoutes(app) {
    app.post('/register', registerUser);
    app.post('/login', 
    {
        config: {
            rateLimit: { //Rate limiter su IP per evitare brute force
                max: 5, 
                timeWindow: '1 minute' 
            }
        }
    }, loginUser);
    app.delete('/delete', { onRequest: [authenticate] }, deleteUser);
}