/**
 * @file utils.js
 * @description Funzioni di utilità per l'applicazione
 * @version 1.0.0
 * @author Andrea Lattarulo
 */

import fs from 'fs-extra';
import crypto from 'crypto';

/**
 * Crea un hash della password utilizzando SHA-256
 */
export const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

/**
 * Legge un file JSON in modo asincrono
 */
export const readJSON = async (file) => await fs.readJSON(file).catch(() => ({ error: 'Failed to read JSON file' }));

/**
 * Scrive dati in un file JSON in modo asincrono
 */
export const writeJSON = async (file, data) => fs.writeJSON(file, data, { spaces: 2 });

/**
 * Valida un indirizzo email
 */
export const isValidEmail = (email) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

/**
 * Valida una stringa Base64
 */
export const isValidBase64 = (data) => /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data);

/**
 * Verifica se un utente è un amministratore o il proprietario di un record.
 */
export const isUserAdminOrOwner = (user, record) => user.role === 'admin' || record.owner === user.email;