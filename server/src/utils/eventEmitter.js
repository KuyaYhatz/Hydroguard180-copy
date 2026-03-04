const EventEmitter = require('events');

// Create a global event emitter for SSE
class WaterMonitoringEmitter extends EventEmitter {}

const waterMonitoringEmitter = new WaterMonitoringEmitter();

module.exports = waterMonitoringEmitter;
