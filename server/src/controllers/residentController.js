const prisma = require('../db');

// Get all residents
exports.getAllResidents = async (req, res) => {
  try {
    const residents = await prisma.resident.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(residents);
  } catch (error) {
    console.error('Get all residents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single resident
exports.getResidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const resident = await prisma.resident.findUnique({
      where: { id }
    });

    if (!resident) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    res.json(resident);
  } catch (error) {
    console.error('Get resident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create resident
exports.createResident = async (req, res) => {
  try {
    const { residentName, address, contactNumber, emergencyContact, householdCount, notes } = req.body;

    // Validate required fields
    if (!residentName || !residentName.trim()) {
      return res.status(400).json({ error: 'Resident name is required' });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ error: 'Address is required' });
    }
    if (!contactNumber || !contactNumber.trim()) {
      return res.status(400).json({ error: 'Contact number is required' });
    }
    if (!emergencyContact || !emergencyContact.trim()) {
      return res.status(400).json({ error: 'Emergency contact is required' });
    }
    if (!householdCount || isNaN(parseInt(householdCount))) {
      return res.status(400).json({ error: 'Valid household count is required' });
    }

    const resident = await prisma.resident.create({
      data: {
        residentName: residentName.trim(),
        address: address.trim(),
        contactNumber: contactNumber.trim(),
        emergencyContact: emergencyContact.trim(),
        householdCount: parseInt(householdCount),
        notes: notes ? notes.trim() : '',
        status: 'active'
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        userName: req.user.fullName,
        action: 'Resident Added',
        target: residentName,
        details: 'Added new resident to directory'
      }
    });

    res.status(201).json(resident);
  } catch (error) {
    console.error('Create resident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update resident
exports.updateResident = async (req, res) => {
  try {
    const { id } = req.params;
    const { residentName, address, contactNumber, emergencyContact, householdCount, notes, status } = req.body;

    const resident = await prisma.resident.update({
      where: { id },
      data: {
        residentName,
        address,
        contactNumber,
        emergencyContact,
        householdCount: parseInt(householdCount),
        notes,
        status
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        userName: req.user.fullName,
        action: 'Resident Updated',
        target: residentName,
        details: 'Updated resident information'
      }
    });

    res.json(resident);
  } catch (error) {
    console.error('Update resident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete resident
exports.deleteResident = async (req, res) => {
  try {
    const { id } = req.params;

    const resident = await prisma.resident.findUnique({
      where: { id }
    });

    if (!resident) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    await prisma.resident.delete({
      where: { id }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        userName: req.user.fullName,
        action: 'Resident Deleted',
        target: resident.residentName,
        details: 'Removed resident from directory'
      }
    });

    res.json({ message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('Delete resident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
