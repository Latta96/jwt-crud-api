/**
 * @file dataController.js
 * @description Controller per la gestione dei dati
 * @version 1.0.0
 * @author Andrea Lattarulo
 */

import * as utils from '../utils/utils.js';
import { config } from '../config/config.js';

/**
 * Crea un nuovo dato. 
 * Se nella richiesta mancano key e data, restituisce un errore 400.
 * Se il dato esiste già, restituisce un errore 409. 
 * Se il dato non è in base64, restituisce un errore 400.
 */
export async function createData(request, reply) {
    const { key, data } = request.body;
    const owner = request.user.email;
    const storage = await utils.readJSON(config.dataFilePath);

    if (!key || !data) {
        return reply.status(400).send({ error: 'Parametri mancanti' });
    } else if(storage[key]) {
        return reply.status(409).send({ error: 'Chiave già esistente' });
    } else if(!utils.isValidBase64(data)) {
        return reply.status(400).send({ error: 'Il dato non è in base64' });
    }

    storage[key] = { data, owner };
    await utils.writeJSON(config.dataFilePath, storage);
    return reply.send({ success: true });
}

/**
 * Recupera un dato. 
 * Se il dato non esiste, restituisce un errore 404.
 * Se l'utente non è admin o il proprietario del dato, restituisce un errore 403.
 */
export async function getData(request, reply) {
    const { key } = request.params;
    const { user } = request;
    const storage = await utils.readJSON(config.dataFilePath);
    const record = storage[key];

    if (!record) {
        reply.status(404).send({ error: 'Non trovato' });
    } else if (!utils.isUserAdminOrOwner(user, record)) {
        reply.status(403).send({ error: 'Accesso negato' });
    }

    return reply.send({ data: record.data });
}

/**
 * Recupera un dato. 
 * Se il dato non esiste, restituisce un errore 404.
 * Se nella richiesta mancano key e data, restituisce un errore 400.
 * Se il dato esiste già, restituisce un errore 409. 
 * Se il dato non è in base64, restituisce un errore 400.
 */
export async function updateData(request, reply) {
    const { key } = request.params;
    const { data } = request.body;
    const { user } = request;
    const storage = await utils.readJSON(config.dataFilePath);
    const record = storage[key];

    if (!key || !data) {
        return reply.status(400).send({ error: 'Parametri mancanti' });
    } else if (!record) {
        return reply.status(404).send({ error: 'Non trovato' });
    } else if(!utils.isUserAdminOrOwner(user, record)) {
        return reply.status(403).send({ error: 'Accesso negato' });
    } else if(!utils.isValidBase64(data)) {
        return reply.status(400).send({ error: 'Il dato non è in base64' });
    }

    record.data = data;
    await utils.writeJSON(config.dataFilePath, storage);
    return reply.send({ success: true });
}

/**
 * Cancella un dato.
 * Se il dato non esiste, restituisce un errore 404.
 * Se l'utente non è admin o il proprietario del dato, restituisce un errore 403.
 */
export async function deleteData(request, reply) {
    const { key } = request.params;
    const { user } = request;
    const storage = await utils.readJSON(config.dataFilePath);
    
    if (!storage[key]) {
        return reply.status(404).send({ error: 'Non trovato' });
    } else if(!utils.isUserAdminOrOwner(user, storage[key])) {
        return reply.status(403).send({ error: 'Accesso negato' });
    }
    
    delete storage[key];
    await utils.writeJSON(config.dataFilePath, storage);
    return reply.send({ success: true });
}