const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'tarot.db');
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let dbInstance = null;

// Synchronous wrapper over sql.js to mimic better-sqlite3 API
class DatabaseWrapper {
  constructor() {
    // Note: In a real production app we'd load this async, but for this exercise 
    // and matching better-sqlite3 we will initialize it blockingly or assume it's ready
  }

  static async initialize() {
    const SQL = await initSqlJs();
    if (fs.existsSync(dbPath)) {
      const filebuffer = fs.readFileSync(dbPath);
      dbInstance = new SQL.Database(filebuffer);
    } else {
      dbInstance = new SQL.Database();
      this.save();
    }
  }

  static save() {
    if (dbInstance) {
      const data = dbInstance.export();
      fs.writeFileSync(dbPath, Buffer.from(data));
    }
  }

  prepare(sqlString) {
    const bindParams = (stmt, params) => {
      if (params.length === 1 && typeof params[0] === 'object' && params[0] !== null && !Array.isArray(params[0])) {
        const obj = {};
        for (const [k, v] of Object.entries(params[0])) {
          obj[`@${k}`] = v;
          obj[`$${k}`] = v;
          obj[`:${k}`] = v;
        }
        stmt.bind(obj);
      } else {
        stmt.bind(params);
      }
    };

    return {
      all: (...params) => {
        const stmt = dbInstance.prepare(sqlString);
        bindParams(stmt, params);
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },
      get: (...params) => {
        const stmt = dbInstance.prepare(sqlString);
        bindParams(stmt, params);
        let result = undefined;
        if (stmt.step()) {
          result = stmt.getAsObject();
        }
        stmt.free();
        return result;
      },
      run: (...params) => {
        const stmt = dbInstance.prepare(sqlString);
        bindParams(stmt, params);
        stmt.step();
        stmt.free();
        DatabaseWrapper.save();
        return { changes: 1 };
      }
    };
  }

  transaction(fn) {
    return (...args) => {
      try {
        fn(...args);
        DatabaseWrapper.save();
      } catch (e) {
        console.error("Transaction Error:", e);
        throw e;
      }
    };
  }

  exec(sqlString) {
    dbInstance.run(sqlString);
    DatabaseWrapper.save();
  }

  close() {
    if (dbInstance) {
      DatabaseWrapper.save();
      dbInstance.close();
    }
  }

  pragma(sqlString) {
    // ignore
  }
}

// Since sql.js init is async, we export a proxy that forwards calls to the wrapper
// However, Node requires exports to be synchronous. We will rely on index.js and init.js
// to await initialization before requiring routes.
module.exports = new DatabaseWrapper();
module.exports.DatabaseWrapper = DatabaseWrapper;
