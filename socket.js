let Socket;

try {
  Socket = require('netlinkwrapper');
} catch (err) {
  Socket = require('sync-socket');
}

module.exports = class SocketWrapper {
  constructor() {
    this.socket = new Socket();
  }

  connect(port, host) {
    this.socket.connect(
      port,
      host
    );
  }

  disconnect() {
    try {
      this.socket.disconnect();
    } catch (e) {}
  }
};
