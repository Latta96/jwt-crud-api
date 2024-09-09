/**
 * @file userController.js
 * @description Controller per la gestione degli utenti
 * @version 1.0.0
 * @author Andrea Lattarulo
 */

import * as utils from '../utils/utils.js';
import { config } from '../config/config.js';

/**
 * Registra un nuovo utente.
 */
export async function registerUser(request, reply) {
  const { email, password } = request.body;
  const users = await utils.readJSON(config.usersFilePath);
  if (!utils.isValidEmail(email)) {
    return reply.status(400).send({ error: 'Indirizzo email non valido' });
  }
  if (users[email]) {
    return reply.status(409).send({ error: 'Utente già esistente' });
  }
  users[email] = { password: utils.hashPassword(password), role: 'user' };
  await utils.writeJSON(config.usersFilePath, users);
  return reply.send({ success: true });
}

/**
 * Effettua il login di un utente, fornendo un token JWT.
 */
export async function loginUser(request, reply) {
    const { email, password } = request.body;
    const users = await utils.readJSON(config.usersFilePath);
    const user = users[email];
    if (!user || user.password !== utils.hashPassword(password)) {
      return reply.status(401).send({ error: 'Email o password non validi' });
    }
    const token = request.server.jwt.sign({ email, role: user.role });
    return reply.send({ token });
}

/**
 * Cancella l'utente corrente e tutti i suoi dati. Se l'utente è admin non può essere cancellato.
 */
export async function deleteUser(request, reply) {
  const { email } = request.user;
  const users = await utils.readJSON(config.usersFilePath);
  const data = await utils.readJSON(config.dataFilePath);

  if (!users[email]) {
    return reply.status(404).send({ error: 'Utente non trovato' });
  } else if (users[email].role === 'admin') {
    return reply.status(400).send({ error: 'Impossibile eliminare un utente amministratore' });
  }

  delete users[email];

  for (const key in data) {
    if (data[key].owner === email) {
      delete data[key];
    }
  }

  await utils.writeJSON(config.usersFilePath, users);
  await utils.writeJSON(config.dataFilePath, data);

  return reply.send({ success: true });
}