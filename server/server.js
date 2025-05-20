const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { checkHost } = require('./monitor/ping');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Network Monitor API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// app.get('/ping/:ip', async (req, res) => {
//     const result = await checkHost(req.params.ip);
//     res.json(result);
// });

const devices = [
  { ip: '192.168.1.1', end_device: 'Router 1' },
//   { ip: '192.168.1.2', end_device: 'Router 2' },
//   { ip: '192.168.1.3', end_device: 'Router 3' }
];

// app.get('/ping', async (req, res) => {
//     const result = await checkHost(req.params.ip);
//   res.json(result);
// });

app.get('/ping', async (req, res) => {
  const results = await Promise.all(devices.map(device =>
    checkHost(device.ip).then(result => ({
      ...result,
      end_device: device.end_device
    }))
  ));
  res.json(results); // 👈 This is now an array of results
});