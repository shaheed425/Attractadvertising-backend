import Settings from '../models/Settings.js';

const DEFAULT_TIME_SLOTS = [
  {
    id: 'slot-morning',
    name: 'Morning Prime Slot',
    timeRange: '09:00 AM – 12:00 PM',
    duration: '3 Hours',
    status: 'available',
    popular: false,
    tag: 'Office Commute Traffic',
  },
  {
    id: 'slot-afternoon',
    name: 'Afternoon Retail Slot',
    timeRange: '12:00 PM – 03:00 PM',
    duration: '3 Hours',
    status: 'available',
    popular: false,
    tag: 'Lunch & Mall Traffic',
  },
  {
    id: 'slot-evening',
    name: 'Evening Peak Slot',
    timeRange: '03:00 PM – 06:00 PM',
    duration: '3 Hours',
    status: 'available',
    popular: true,
    tag: 'High Impression Rush',
  },
  {
    id: 'slot-night',
    name: 'Night Prime Glow Slot',
    timeRange: '06:00 PM – 09:00 PM',
    duration: '3 Hours',
    status: 'booked',
    popular: true,
    tag: 'Max Illumination & Nightlife',
  },
  {
    id: 'slot-fullday',
    name: 'Full-Day All-Access Package',
    timeRange: '09:00 AM – 09:00 PM',
    duration: '12 Hours Full Day',
    status: 'available',
    popular: true,
    tag: 'Maximum Brand Dominance',
  },
];

// @desc    Get system settings (UPI config & time slots)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        upiId: '8590204464@ybl',
        ownerName: 'ATTRACT ADVERTISING',
        qrImage: '',
        instagramUrl: 'https://www.instagram.com/Stackxxio_/',
        timeSlots: DEFAULT_TIME_SLOTS,
      });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

// @desc    Update system settings (UPI config & time slots & Instagram URL)
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    const { upiId, ownerName, qrImage, instagramUrl, heroShowcaseImage, timeSlots } = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({
        upiId: upiId || '8590204464@ybl',
        ownerName: ownerName || 'ATTRACT ADVERTISING',
        qrImage: qrImage || '',
        instagramUrl: instagramUrl || 'https://www.instagram.com/Stackxxio_/',
        heroShowcaseImage: heroShowcaseImage || '',
        timeSlots: timeSlots || DEFAULT_TIME_SLOTS,
      });
    } else {
      if (upiId !== undefined) settings.upiId = upiId;
      if (ownerName !== undefined) settings.ownerName = ownerName;
      if (qrImage !== undefined) settings.qrImage = qrImage;
      if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
      if (heroShowcaseImage !== undefined) settings.heroShowcaseImage = heroShowcaseImage;
      if (timeSlots !== undefined) settings.timeSlots = timeSlots;
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};
