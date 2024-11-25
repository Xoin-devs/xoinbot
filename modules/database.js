const sqlite3 = require('sqlite3').verbose();
let { announcementId, vocalChannelId } = require('../services/state');

// Initialisation de la base de données
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Connecté à la base SQLite.');
});

const updateGuildRow = (guildId, announcementId, vocalId) => {
    db.run(
        `UPDATE guilds SET announcementId = ?, vocalId = ? WHERE guildId = ?`,
        [announcementId, vocalId, guildId],
        (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Guild ID ${guildId} mis à jour avec announcementId=${announcementId} et vocalId=${vocalId}.`);
            }
        }
    );
}

const insertGuildRow = (guildId, announcementId, vocalId) => {
    db.run(
        `INSERT INTO guilds (guildId, announcementId, vocalId) VALUES (?, ?, ?)`,
        [guildId, announcementId, vocalId],
        (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Guild ID ${guildId} ajouté avec succès.`);
            }
        }
    );
}

const addNewGuild = (guildId, announcementId, vocalId) => {
    db.get(`SELECT guildId FROM guilds WHERE guildId = ?`, [guildId], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (row) {
            // Le guildId existe déjà, on met à jour les champs
            updateGuildRow(guildId, announcementId, vocalId);
        } else {
            // Le guildId n'existe pas, on insère une nouvelle ligne
            insertGuildRow(guildId, announcementId, vocalId);
        }
    });
};

const getChannelsByGuild = async (guildId) => {
    return new Promise((resolve, reject) => {
        return db.get(`SELECT announcementId, vocalId FROM guilds WHERE guildId = ?`, [guildId], (err, row) => {
            if (err) {
                console.error(err.message);
                return reject(err.message);
            }
            return resolve({announcementId: row["announcementId"], vocalChannelId: row["vocalId"]});
        })
    })
}

db.run(
    `CREATE TABLE IF NOT EXISTS guilds (guildId TEXT PRIMARY KEY, announcementId TEXT, vocalId TEXT, usages INTEGER)`,
    (err) => {
        if (err) console.error(err.message);
    }
);

module.exports = { db, addNewGuild, getChannelsByGuild };