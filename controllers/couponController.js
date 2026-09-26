import Coupon from '../models/Coupon.js';

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupons', error: error.message });
  }
};

// @desc    Get public active valid coupons (Customer Carousel)
// @route   GET /api/coupons/public
// @access  Public
export const getPublicCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      status: 'Active',
      isPublic: true,
      expiryDate: { $gte: now },
    }).sort({ createdAt: -1 });

    // Filter out usage limit reached
    const validCoupons = coupons.filter(
      (c) => c.usageLimit === 0 || c.usageCount < c.usageLimit
    );

    res.json(validCoupons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public coupons', error: error.message });
  }
};

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private
export const createCoupon = async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      code,
      discountType,
      discountPercentage,
      minimumBookingAmount,
      maximumDiscount,
      startDate,
      expiryDate,
      usageLimit,
      perCustomerLimit,
      status,
      isPublic,
    } = req.body;

    if (!title || !code || !discountPercentage || !startDate || !expiryDate) {
      return res.status(400).json({ message: 'Title, Coupon Code, Discount %, Start Date, and Expiry Date are required.' });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check if code already exists
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({ message: `Coupon code '${cleanCode}' already exists.` });
    }

    const percentage = Number(discountPercentage);
    if (isNaN(percentage) || percentage < 1 || percentage > 100) {
      return res.status(400).json({ message: 'Discount percentage must be between 1% and 100%.' });
    }

    const coupon = new Coupon({
      title,
      description: description || '',
      imageUrl: imageUrl || '',
      code: cleanCode,
      discountType: discountType || 'Percentage',
      discountPercentage: percentage,
      minimumBookingAmount: Number(minimumBookingAmount) || 0,
      maximumDiscount: Number(maximumDiscount) || 0,
      startDate: new Date(startDate),
      expiryDate: new Date(expiryDate),
      usageLimit: Number(usageLimit) || 0,
      perCustomerLimit: Number(perCustomerLimit) || 1,
      status: status || 'Active',
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ message: 'Server error creating coupon', error: error.message });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    const {
      title,
      description,
      imageUrl,
      code,
      discountPercentage,
      minimumBookingAmount,
      maximumDiscount,
      startDate,
      expiryDate,
      usageLimit,
      perCustomerLimit,
      status,
      isPublic,
    } = req.body;

    if (code) {
      const cleanCode = code.trim().toUpperCase();
      if (cleanCode !== coupon.code) {
        const existing = await Coupon.findOne({ code: cleanCode });
        if (existing) {
          return res.status(400).json({ message: `Coupon code '${cleanCode}' is already taken.` });
        }
        coupon.code = cleanCode;
      }
    }

    if (title) coupon.title = title;
    if (description !== undefined) coupon.description = description;
    if (imageUrl !== undefined) coupon.imageUrl = imageUrl;
    if (discountPercentage !== undefined) {
      const pct = Number(discountPercentage);
      if (pct < 1 || pct > 100) {
        return res.status(400).json({ message: 'Discount percentage must be between 1% and 100%.' });
      }
      coupon.discountPercentage = pct;
    }
    if (minimumBookingAmount !== undefined) coupon.minimumBookingAmount = Number(minimumBookingAmount);
    if (maximumDiscount !== undefined) coupon.maximumDiscount = Number(maximumDiscount);
    if (startDate) coupon.startDate = new Date(startDate);
    if (expiryDate) coupon.expiryDate = new Date(expiryDate);
    if (usageLimit !== undefined) coupon.usageLimit = Number(usageLimit);
    if (perCustomerLimit !== undefined) coupon.perCustomerLimit = Number(perCustomerLimit);
    if (status) coupon.status = status;
    if (isPublic !== undefined) coupon.isPublic = isPublic;

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: 'Error updating coupon', error: error.message });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }
    await coupon.deleteOne();
    res.json({ message: 'Coupon deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coupon', error: error.message });
  }
};

// @desc    Validate coupon code for customer
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res) => {
  try {
    const { code, originalAmount } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Please enter a coupon code.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code.' });
    }

    if (coupon.status !== 'Active') {
      return res.status(400).json({ message: 'This coupon is currently inactive.' });
    }

    const now = new Date();
    if (now < new Date(coupon.startDate)) {
      return res.status(400).json({ message: 'This coupon promotion has not started yet.' });
    }

    if (now > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: 'This coupon has expired.' });
    }

    const amount = Number(originalAmount) || 0;
    if (coupon.minimumBookingAmount > 0 && amount < coupon.minimumBookingAmount) {
      return res.status(400).json({
        message: `Minimum booking amount of ₹${coupon.minimumBookingAmount.toLocaleString()} required for this coupon.`,
      });
    }

    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'This coupon has reached its maximum redemption limit.' });
    }

    // Calculate discount
    let discountAmount = Math.round((amount * coupon.discountPercentage) / 100);
    if (coupon.maximumDiscount > 0 && discountAmount > coupon.maximumDiscount) {
      discountAmount = coupon.maximumDiscount;
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    res.json({
      valid: true,
      coupon: {
        _id: coupon._id,
        title: coupon.title,
        description: coupon.description,
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        discountAmount,
        originalAmount: amount,
        finalAmount,
        minimumBookingAmount: coupon.minimumBookingAmount,
        maximumDiscount: coupon.maximumDiscount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error validating coupon', error: error.message });
  }
};
