const sqlite3 = require('sqlite3').verbose();
const DB_PATH = `./stats_db.db`;

/**
 * open a new SQLLite DB connection (with read and write access).
 * @return {Promise<any>} promise with the opened connection db.
 */
const openConnection= ()=>new Promise((resolve, reject) => {
    let db = new sqlite3.Database(DB_PATH, err => {
        if (err) return reject(err.message);
    });

    resolve(db);
});

/**
 * close the given SQLLite DB connection.
 * @param db - the db-connection to close.
 * @return {Promise<any>}
 */
const closeConnection= (db)=>new Promise((resolve, reject) => {
    db.close(err=>{
        if (err) return reject(err.message);
    });

    resolve();
});



module.exports = {
    /**
     *  insert a new row with the given stats to the "measures table.
     * @param stats - stats to insert (the metrics form the page).
     * @return {Promise<any>} promise with thw stats and the new generated id.
     */
    reportData: stats => new Promise(async (resolve, reject) => {
        let db = await openConnection();
        const cols = Object.keys(stats); // get all keys for mapping to columns.

        db.run(`INSERT INTO measures(${cols.join(`,`)}) VALUES (${cols.map(() => `?`).join(`,`)})`, Object.values(stats), function (err) {
            if (err)
                return reject(err.message);

            resolve(Object.assign(stats, {id: this.lastID})); // merge stats with the new generated ID.
        });

        await closeConnection(db);
    }),
    /**
     *  get the last measures that were reordered for the given test name
     * @param testName - the requested the name
     * @return {Promise<any>}
     */
    getLastRow: testName => new Promise(async (resolve, reject) => {
        let db = await openConnection();
        db.get(`SELECT * FROM MEASURES WHERE TESTNAME = ? ORDER BY TIME DESC LIMIT 1`, testName, (err, row) => {
            if (err)
                return reject(err.message);

            resolve(row);
        });

        await closeConnection(db);
    }),

    createTable: insertData => new Promise(async (resolve, reject) => {
        console.log("create database table Measures");
        let db = await openConnection();
        //db.run("CREATE TABLE IF NOT EXISTS contacts(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)",  insertData);
        db.run("CREATE TABLE IF NOT EXISTS measures( id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, \
         testName TEXT NOT NULL, \
         time REAL NOT NULL DEFAULT (datetime('now','localtime')), \
         JSHeapUsedSize INTEGER, LayoutCount INTEGER, RecalcStyleCount INTEGER, \
         ScriptDuration INTEGER, TaskDuration INTEGER, Timestamp INTEGER, \
         JSEventListeners INTEGER, LayoutDuration INTEGER, RecalcStyleDuration INTEGER, \
         Nodes INTEGER, screenshot BLOB )",  insertData ,(err, row) => {
            if (err)
                return reject(err.message);

            resolve(row);
        });

        await closeConnection(db);
    })
};