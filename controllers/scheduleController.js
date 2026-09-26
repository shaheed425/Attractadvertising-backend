import Schedule from '../models/Schedule.js';
import Coupon from '../models/Coupon.js';

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
      originalAmount,
      couponCode,
      paymentScreenshot,
    } = req.body;

    if (!customerName || !phoneNumber || !email || !date || !district || !place || !timeSlot) {
      return res.status(400).json({ message: 'Please provide all required fields (Name, Phone, Email, Date, Location, Time Slot).' });
    }

    const bookingId = `ATT-SCH-${Math.floor(100000 + Math.random() * 900000)}`;

    let baseAmount = Number(originalAmount) || Number(totalAmount) || 4000;
    let appliedCouponCode = '';
    let appliedDiscountPct = 0;
    let appliedDiscountAmt = 0;
    let finalPayableAmount = baseAmount;

    // Server-side Coupon Validation
    if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      const dbCoupon = await Coupon.findOne({ code: cleanCode });

      if (dbCoupon && dbCoupon.status === 'Active') {
        const now = new Date();
        const startValid = now >= new Date(dbCoupon.startDate);
        const expiryValid = now <= new Date(dbCoupon.expiryDate);
        const minAmountValid = dbCoupon.minimumBookingAmount === 0 || baseAmount >= dbCoupon.minimumBookingAmount;
        const usageLimitValid = dbCoupon.usageLimit === 0 || dbCoupon.usageCount < dbCoupon.usageLimit;

        if (startValid && expiryValid && minAmountValid && usageLimitValid) {
          appliedCouponCode = dbCoupon.code;
          appliedDiscountPct = dbCoupon.discountPercentage;
          let calculatedDiscount = Math.round((baseAmount * dbCoupon.discountPercentage) / 100);

          if (dbCoupon.maximumDiscount > 0 && calculatedDiscount > dbCoupon.maximumDiscount) {
            calculatedDiscount = dbCoupon.maximumDiscount;
          }

          appliedDiscountAmt = calculatedDiscount;
          finalPayableAmount = Math.max(0, baseAmount - appliedDiscountAmt);

          // Atomic increment of coupon usage count
          await Coupon.findByIdAndUpdate(dbCoupon._id, { $inc: { usageCount: 1 } });
        }
      }
    }

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
      totalAmount: finalPayableAmount,
      originalAmount: baseAmount,
      couponCode: appliedCouponCode,
      discountPercentage: appliedDiscountPct,
      discountAmount: appliedDiscountAmt,
      finalAmount: finalPayableAmount,
      paymentScreenshot: paymentScreenshot || '',
      paymentStatus: 'Pending Confirmation',
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
