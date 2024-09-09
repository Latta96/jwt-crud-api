/**
 * @file app.js
 * @description Configurazione e avvio del server Fastify con rate limiter e autenticazione JWT.
 * @version 1.0.0
 * @author Andrea Lattarulo
 */

import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyRateLimit from '@fastify/rate-limit';
import { config } from './config/config.js'; 
import userRoutes from './routes/userRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import fs from 'fs-extra';

const app = fastify({ logger: true });

await app.register(fastifyRateLimit);
await app.register(fastifyJwt, { secret: config.jwtSecret });

await fs.ensureFile(config.usersFilePath);
await fs.ensureFile(config.dataFilePath);

await app.register(userRoutes);
await app.register(dataRoutes);

const start = async () => {
  try {
    await app.listen({ port: config.serverPort, host: config.serverHost });
    app.log.info(`Server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();