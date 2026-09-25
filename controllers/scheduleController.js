import Schedule from '../models/Schedule.js';

// @desc    Create a new scheduled booking
// @route   POST /api/schedule
// @access  Public
export const createScheduleBooking = async (req, res) => {
  try {
    const {
      customerName,
      phoneNumber,
      email,
      companyName,
      designation,
      address,
      notes,
      date,
      preferredDate,
      district,
      place,
      timeSlot,
      totalAmount,
      paymentScreenshot,
    } = req.body;

    if (!customerName || !phoneNumber || !email || !date || !district || !place || !timeSlot || !paymentScreenshot) {
      return res.status(400).json({ message: 'Please provide all required fields including the payment screenshot.' });
    }

    const bookingId = `ATT-SCH-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking = new Schedule({
      bookingId,
      customerName,
      phoneNumber,
      email,
      companyName: companyName || '',
      designation: designation || '',
      address: address || '',
      notes: notes || '',
      date,
      preferredDate: preferredDate || date,
      district,
      place,
      timeSlot,
      totalAmount: totalAmount || 4999,
      paymentScreenshot,
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Error creating scheduled booking:', error);
    res.status(500).json({ message: 'Server error creating scheduled booking', error: error.message });
  }
};

// @desc    Get all scheduled bookings (for admin)
// @route   GET /api/schedule
// @access  Private
export const getScheduleBookings = async (req, res) => {
  try {
    const bookings = await Schedule.find({}).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// @desc    Update booking payment status
// @route   PUT /api/schedule/:id/status
// @access  Private
export const updateScheduleStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const booking = await Schedule.findById(req.params.id);

    if (booking) {
      booking.paymentStatus = paymentStatus || booking.paymentStatus;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};
