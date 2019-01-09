const Socket = require('./socket');

const hrtimeToMS = x => (x[0] * 1e9 + x[1]) / 1e6;
const range = x => Array.apply(null, { length: x }).map(Number.call, Number);

const ping = (module.exports.ping = function({ host = 'localhost', port = 80, attempts = 10 }) {
  const results = range(attempts).map(seq => {
    const socket = new Socket();
    const start = process.hrtime();
    let err;

    try {
      socket.connect(
        port,
        host
      );
    } catch (_err) {
      err = _err;
    }

    const time = hrtimeToMS(process.hrtime(start));

    socket.disconnect();

    if (err) {
      return { seq, time: Infinity, err };
    }

    return { seq, time };
  });
  const times = results.map(result => result.time);
  const min = Math.min.apply(Math, times);
  const max = Math.max.apply(Math, times);
  const avg = times.reduce((sum, time) => sum + time, 0) / attempts;
  const stddev = Math.sqrt(times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / attempts);

  return {
    results,
    stats: {
      min,
      avg,
      max,
      stddev
    },
    settings: {
      host,
      port,
      attempts
    }
  };
});

module.exports = ping;
module.exports.ping = ping;
module.exports.probe = (host, port) =>
  !ping({
    host: typeof host === 'number' ? null : host,
    port: typeof host === 'number' ? host : port,
    attempts: 1
  }).results[0].err;
