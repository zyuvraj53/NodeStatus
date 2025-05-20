const ping = require('ping');

async function checkHost(host) {
    const res = await ping.promise.probe('192.168.1.1');
    return {
        switch: "Switch A",
        end_device: "Router 1",
        device_ip: res.host,
        // host: res.host,
        alive: res.alive,
        // time: res.time,
    };
}

module.exports = { checkHost };