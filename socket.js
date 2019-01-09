let Socket;
let _skipDisconnect;

try {
  Socket = require('netlinkwrapper');
  _skipDisconnect = true;
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
    // Why we don't disconnect when using netlinkwrapper:
    // https://github.com/colingourlay/tcp-ping-sync/issues/1
    if (_skipDisconnect) {
      return;
    }

    try {
      this.socket.disconnect();
    } catch (e) {}
  }
};
