import Testimonial from '../models/Testimonial.js';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res) => {
  try {
    const { clientName, companyName, designation, avatar, rating, reviewText, isFeatured } = req.body;

    const testimonial = new Testimonial({
      clientName,
      companyName,
      designation,
      avatar,
      rating: rating || 5,
      reviewText,
      isFeatured: isFeatured !== undefined ? isFeatured : true,
    });

    const created = await testimonial.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Error creating testimonial', error: error.message });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res) => {
  try {
    const { clientName, companyName, designation, avatar, rating, reviewText, isFeatured } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      testimonial.clientName = clientName || testimonial.clientName;
      testimonial.companyName = companyName !== undefined ? companyName : testimonial.companyName;
      testimonial.designation = designation !== undefined ? designation : testimonial.designation;
      testimonial.avatar = avatar !== undefined ? avatar : testimonial.avatar;
      testimonial.rating = rating !== undefined ? rating : testimonial.rating;
      testimonial.reviewText = reviewText || testimonial.reviewText;
      testimonial.isFeatured = isFeatured !== undefined ? isFeatured : testimonial.isFeatured;

      const updated = await testimonial.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating testimonial', error: error.message });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      await testimonial.deleteOne();
      res.json({ message: 'Testimonial removed' });
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
  }
};
