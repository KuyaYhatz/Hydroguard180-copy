const fetch = require('node-fetch');

// Test the ESP32 device endpoint to simulate real-time updates
async function sendWaterLevelReading() {
  const readings = [
    { waterLevel: 25, rainfallIndicator: 'None' },
    { waterLevel: 42, rainfallIndicator: 'Light' },
    { waterLevel: 58, rainfallIndicator: 'Moderate' },
    { waterLevel: 75, rainfallIndicator: 'Heavy' },
    { waterLevel: 95, rainfallIndicator: 'Heavy' },
  ];

  const randomReading = readings[Math.floor(Math.random() * readings.length)];
  
  console.log(`\n📡 Sending water level reading: ${randomReading.waterLevel} cm`);
  console.log(`🌧️  Rainfall: ${randomReading.rainfallIndicator}`);

  try {
    const response = await fetch('http://localhost:3000/api/water-monitoring/device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: 'hydro-001',
        ...randomReading,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success!');
      console.log(`   Alert Level: ${data.data.alertLevel}`);
      console.log(`   Timestamp: ${data.data.timestamp}`);
      console.log('\n💡 Check your browser - the UI should update automatically!');
    } else {
      console.error('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Failed to send reading:', error.message);
    console.log('\n⚠️  Make sure the server is running on port 3000');
  }
}

sendWaterLevelReading();
