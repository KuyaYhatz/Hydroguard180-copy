const prisma = require('../db');

// Get settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await prisma.settings.findFirst();

    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const {
      systemName,
      barangay,
      city,
      logo,
      primaryColor,
      secondaryColor,
      contact,
      alertsEnabled,
      sensors,
      calibration
    } = req.body;

    // Get existing settings
    const existingSettings = await prisma.settings.findFirst();

    let settings;
    if (existingSettings) {
      // Update existing
      settings = await prisma.settings.update({
        where: { id: existingSettings.id },
        data: {
          systemName,
          barangay,
          city,
          logo,
          primaryColor,
          secondaryColor,
          contact,
          alertsEnabled,
          sensors,
          calibration
        }
      });
    } else {
      // Create new
      settings = await prisma.settings.create({
        data: {
          systemName,
          barangay,
          city,
          logo,
          primaryColor,
          secondaryColor,
          contact,
          alertsEnabled,
          sensors,
          calibration
        }
      });
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        userName: req.user.fullName,
        action: 'Settings Updated',
        target: 'System Settings',
        details: 'Updated system configuration'
      }
    });

    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
