const express = require('express');
const router = express.Router();
const waterMonitoringEmitter = require('../utils/eventEmitter');

// SSE endpoint for water monitoring updates
router.get('/water-monitoring', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send initial connection message
  res.write('data: {"type":"connected","message":"Connected to water monitoring updates"}\n\n');

  // Listen for water monitoring updates
  const onWaterMonitoringUpdate = (data) => {
    res.write(`data: ${JSON.stringify({ type: 'update', data })}\n\n`);
  };

  waterMonitoringEmitter.on('new-record', onWaterMonitoringUpdate);

  // Clean up on client disconnect
  req.on('close', () => {
    waterMonitoringEmitter.removeListener('new-record', onWaterMonitoringUpdate);
    res.end();
  });
});

module.exports = router;
