<div align="center"><h1>tcp-ping-sync</h1><p><small>TCP ping utility with a synchronous API</small><br>💻⌛️⇄🌏</p></div>

## Install

```sh
npm i tcp-ping-sync
```

## Usage

The library exposes two methods, `ping` and `probe`:

```js
const { ping, probe } = require('tcp-ping-sync');

const response = ping({ host: 'google.com', port: 443 });
console.log(response);
// {
//   results: [
//     { seq: 0, time: 126.462211 },
//     { seq: 1, time: 113.164184 },
//     { seq: 2, time: 132.048925 },
//     { seq: 3, time: 148.315887 },
//     { seq: 4, time: 137.088763 },
//     { seq: 5, time: 105.050291 },
//     { seq: 6, time: 105.028794 },
//     { seq: 7, time: 109.297229 },
//     { seq: 8, time: 102.262321 },
//     { seq: 9, time: 112.281641 }
//   ],
//   stats: {
//     min: 102.26232,
//     avg: 119.10002450000002,
//     max: 148.315887,
//     stddev: 15.019185518208955
//   },
//   settings: {
//     host: 'google.com',
//     port: 443,
//     attempts: 10,
//     timeout: 5000
//   }
// }

const isGoogleReachable = probe('google.com');
console.log(isGoogleReachable);
// true
```

### API

```js
const { ping, probe } = require('tcp-ping-sync');

// Probe (does a single ping attempt succeed?)

const isRemoteReachable = probe(
  (host = String), //   (default: 'localhost')
  (port = Number) //    (default: 80)
);

const isLocalReachable = probe(
  (port = Number) //    (default: 80)
);

// Ping

const {
  results = [
    {
      seq: Number, //   Sequence [0...attempts-1]
      time: Number //   Response time
    }
    // ...
  ],
  stats = {
    min: Number, //     Fastest response time
    max: Number, //     Slowest response time
    avg: Number, //     Average response time
    stddev: Number //   Standard deviation
  },
  settings: Object //   Request arguments
} = ping({
  host: String, //      Hostname/IP address   (default: 'localhost')
  port: Number, //      Port number           (default: 80)
  attempts: Number, //  Noumber of attempts   (default: 10)
  timeout: Number //    Max wait milliseconds (default: 5000)
});
```

More usage examples can be found in the tests (`test.js`), which can be run with `npm test`. To execute the tests with debug output, run `npm run test:debug`.

### Warning

Pinging the network synchronously is considerably slower than asynchronously, because of the [workaround](https://github.com/JacobFischer/sync-socket) used in the underlying dependencies. Use this only if you _really need_ a synchronous response. If async is acceptable, you'll probably want to use [`tcp-ping`](https://github.com/apaszke/tcp-ping) instead.

## Credits

This work is inspired by Adam Paszke's [`tcp-ping`](https://github.com/apaszke/tcp-ping) (MIT; © 2014), and uses Jacob Fischer's [`sync-socket`](https://github.com/JacobFischer/sync-socket) (MIT; © 2016) to simulate synchronous network sockets in Node.
