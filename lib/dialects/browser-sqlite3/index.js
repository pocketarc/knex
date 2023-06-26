// browser-sqlite3 Client
// -------
const Client_SQLite3 = require('../sqlite3');

class Client_BrowserSQLite3 extends Client_SQLite3 {
  _driver() {
    return {};
  }

  // Get a raw connection from the database, returning a promise with the connection object.
  async acquireRawConnection() {
    return this.connectionSettings.filename;
  }

  // Used to explicitly close a connection, called internally by the pool when
  // a connection times out or the pool is shutdown.
  async destroyRawConnection(connection) {
    return;
  }

  async _query(connection, obj) {
    if (!obj.sql) throw new Error('The query is empty');

    if (!connection) {
      throw new Error('No connection provided');
    }

    const bindings = this._formatBindings(obj.bindings);

    try {
      const result = connection.knexExec(
          obj.sql,
          obj.bindings
      );

      if (result) {
        obj.response = [result.values, result.columns];
      } else {
        obj.response = null;
      }

      resolver(obj);
    } catch (e) {
      return rejecter(e);
    }
  }

  _formatBindings(bindings) {
    if (!bindings) {
      return [];
    }
    return bindings.map((binding) => {
      if (binding instanceof Date) {
        return binding.valueOf();
      }

      if (typeof binding === 'boolean') {
        return Number(binding);
      }

      return binding;
    });
  }
}

Object.assign(Client_BrowserSQLite3.prototype, {
  // The "dialect", for reference .
  driverName: 'browser-sqlite3',
});

module.exports = Client_BrowserSQLite3;
