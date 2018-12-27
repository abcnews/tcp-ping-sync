const assert = require('assert');
const http = require('http');
const { ping, probe } = require('./');

const IS_DEBUG = process.argv.includes('--debug');
const TEMPORARY_LOCAL_SERVER_PORT = 2697;
const TEMPORARY_LOCAL_SERVER = http.createServer((req, res) => res.end(200));
const REACHABLE_REMOTE_HOST = 'google.com';
const UNREACHABLE_REMOTE_HOST = 'nope.lol.wtf';
const UNREACHABLE_LOCAL_PORT = 6789;

const errCount = x => x.results.filter(y => y.err).length;

TEMPORARY_LOCAL_SERVER.listen(TEMPORARY_LOCAL_SERVER_PORT, async () => {
  const localPingA = ping({ port: TEMPORARY_LOCAL_SERVER_PORT });
  if (IS_DEBUG) console.info('localPingA', localPingA);
  assert(errCount(localPingA) === 0, `localhost:${TEMPORARY_LOCAL_SERVER_PORT} should always be reachable`);

  const localPingB = ping({ port: UNREACHABLE_LOCAL_PORT });
  if (IS_DEBUG) console.info('localPingB', localPingB);
  assert(errCount(localPingB) > 0, `localhost:${UNREACHABLE_LOCAL_PORT} should always be unreachable`);

  const remotePingA = ping({ host: REACHABLE_REMOTE_HOST, port: 443 });
  if (IS_DEBUG) console.info('remotePingA', remotePingA);
  assert(errCount(remotePingA) === 0, `${REACHABLE_REMOTE_HOST}:80 should always be reachable`);

  const remotePingB = ping({ host: UNREACHABLE_REMOTE_HOST });
  if (IS_DEBUG) console.info('remotePingB', remotePingB);
  assert(errCount(remotePingB) > 0, `${UNREACHABLE_REMOTE_HOST}:80 should always be unreachable`);

  const localProbeA = probe(null, TEMPORARY_LOCAL_SERVER_PORT);
  if (IS_DEBUG) console.info('localProbeA', localProbeA);
  assert(localProbeA, `localhost:${TEMPORARY_LOCAL_SERVER_PORT} should be reachable`);

  const localProbeB = probe(null, UNREACHABLE_LOCAL_PORT);
  if (IS_DEBUG) console.info('localProbeB', localProbeB);
  assert(!localProbeB, `localhost:${UNREACHABLE_LOCAL_PORT} should be unreachable`);

  const remoteProbeA = probe(REACHABLE_REMOTE_HOST);
  if (IS_DEBUG) console.info('remoteProbeA', remoteProbeA);
  assert(remoteProbeA, `${REACHABLE_REMOTE_HOST}:80 should be reachable`);

  const remoteProbeB = probe(UNREACHABLE_REMOTE_HOST);
  if (IS_DEBUG) console.info('remoteProbeB', remoteProbeB);
  assert(!remoteProbeB, `${UNREACHABLE_REMOTE_HOST}:80 should be unreachable`);

  TEMPORARY_LOCAL_SERVER.close();
  process.exit();
});
