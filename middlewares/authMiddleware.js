/**
 * @file authMiddleware.js
 * @description Middleware per l'autenticazione delle richieste utilizzando JWT.
 * @version 1.0.0
 * @author Andrea Lattarulo
 */

export async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
}